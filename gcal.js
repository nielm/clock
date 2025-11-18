// Copyright 2025 github.com/nielm

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

function loadClient() {
  const apikey = new URLSearchParams(document.location.search).get("apikey");
  if(! apikey) {
    throw new Error("No apikey parameter in URL")
  }
  gapi.client.setApiKey(apikey);
  return gapi.client
    .load("https://content.googleapis.com/discovery/v1/apis/calendar/v3/rest")
    .then(
      function () {
        console.log("GAPI client loaded for calendar api");
      },
      function (err) {
        console.error("Error loading GAPI client for calendar API", err);
      }
    );
}

// Make sure the client is loaded and sign-in is complete before calling this method.
async function getEvents(calendarId, startDate) {
  const date = new Date(startDate.getTime());
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  const startTime = date.toISOString();
  date.setHours(48);
  const endTime = date.toISOString();

  const args = {
    calendarId: calendarId,
    showDeleted: false,
    singleEvents: true,
    timeMax: endTime,
    timeMin: startTime,
  };
  const result = await gapi.client.calendar.events.list(args);
  return result.result.items;
}

function compareEvents(a, b) {
  try { 
    const startA = a.start.date ? a.start.date : a.start.dateTime;
    const startB = b.start.date ? b.start.date : b.start.dateTime;
    return startA.localeCompare(startB);
  } catch (e) {
    console.error("failed compare\na=%o\nb=%o",a,b);
  }
}

function initGapi() {
  if (gapi.client && gapi.client.calendar) {
    return null;
  }
  return new Promise((resolve, reject) => {
    gapi.load("client", async function () {
      loadClient().then(resolve, reject);
    });
  });
}

function getTodayTomorrow(date) {
  const LOCALWEEKDAYS=localizedWeekdayNames("es-es", "long");
  let day = date.getDay();
  // convert 0-7 Sun -> Sat to Mon->Sun
  day = (day == 0 ? 7 : day) - 1
  
  console.log([LOCALWEEKDAYS[day],LOCALWEEKDAYS[(day+1)%7]]);
  return [LOCALWEEKDAYS[day],LOCALWEEKDAYS[(day+1)%7]];
}

async function refreshGcal() {
  await initGapi();
  const today= globalThis.FIXED_DATE ? globalThis.FIXED_DATE: new Date();
  const searchParams=new URLSearchParams(document.location.search);  const calendars = searchParams.getAll("calendar");

  const allEvents = (await Promise.all(calendars.map((c) => getEvents(c,today)))).flat();  console.log(allEvents);
  allEvents.sort(compareEvents);
  const date = new Date(today.getTime());
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  const todayMillis = date.getTime();
  const todayTomorrow = getTodayTomorrow(date);
  date.setHours(24);
  const tomorrowMillis = date.getTime();

  const todayEvents = allEvents.filter((e) => {
    if (e.start.date) {
      const startTime = parseIsoDate(e.start.date);
      const endTime = parseIsoDate(e.end.date);
      return startTime < tomorrowMillis && endTime > todayMillis;
    }
    // Event has start/end time...
    const eventStartMillis = new Date(e.start.dateTime).getTime();
    // get end, defaultting to start +1hr
    const eventEndMillis = e.end?.dateTime ? new Date(e.end.dateTime).getTime() : eventStartMillis+3600000;
    return  eventStartMillis < tomorrowMillis && eventEndMillis > today.getTime();
  });
  const tomorrowEvents = allEvents.filter((e) => {
    if (e.start.date) {
      const startTime = parseIsoDate(e.start.date);
      return startTime >= tomorrowMillis;
    }
    return new Date(e.start.dateTime).getTime() >= tomorrowMillis;
  });

  const todayDisplay = todayEvents.map(generateEventText);
  const tomorrowDisplay = tomorrowEvents.map(generateEventText);

  console.log("today: %o", todayDisplay);
  console.log("tomorrow: %o", tomorrowDisplay);

  document.getElementById("todayTitle").innerText="hoy: "; //+todayTomorrow[0];
  document.getElementById("tomorrowTitle").innerText="Mañana: "+todayTomorrow[1];
  populateDiv("calendar-today", todayDisplay);
  populateDiv("calendar-tomorrow", tomorrowDisplay);
}

function parseIsoDate(s) {
  const ds = s.split(/\D/).map((s) => parseInt(s));
  ds[1] = ds[1] - 1; // adjust month
  return new Date(...ds);
}

const timeFormat = Intl.DateTimeFormat("es-es", { timeStyle: "short" });

function generateEventText(e) {
  if (e.start.dateTime) {
    const time = new Date(e.start.dateTime);
    return `${timeFormat.format(time)} ${e.summary}`;
  }
  return e.summary;
}

function populateDiv(container, events) {
  if(events.length ===0 ) {
    events.push("\xA0");
  }

  const containerEl = document.getElementById(container);
  const eventElements = events.map((event) => {
    const e = document.createElement("li");
    e.innerText = event;
    return e;
  });
  containerEl.replaceChildren(...eventElements);
}

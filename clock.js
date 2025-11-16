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

// set a timeout for midnight local time
let midnightRefreshTimeout = null;

async function midnightRefresh() {
  if (midnightRefreshTimeout) {
    clearTimeout(midnightRefreshTimeout);
  }
  refreshCalendar();
  await refreshGcal();
  const date = new Date();
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  date.setHours(24);
  const tomorrowMillis = date.getTime();
  console.log("will refresh at " + date.toISOString());
  midnightRefreshTimeout = setTimeout(
    midnightRefresh,
    tomorrowMillis - Date.now()
  );
}

// Force a weather Refresh.
function removeReaddWeather() {
  const weatherClass = "elfsight-app-201230c4-550c-430e-9863-b0d53a23b1c0";
  [...document.getElementsByClassName(weatherClass)].forEach((element) => {
    console.log("removing %o", element);
    element.parentElement.removeChild(element);
  });
  const weather = document.createElement("div");
  weather.id = "weather-elfsight";
  weather.classList.add("elfsight-app-201230c4-550c-430e-9863-b0d53a23b1c0");
  weather.classList.add("widget");
  const layout = document.getElementById("layout");
  layout.appendChild(weather);
}

function startUp() {
  const fixedDate = new URLSearchParams(document.location.search).get("date");
  if (fixedDate) {
    try {
      globalThis.FIXED_DATE = new Date(fixedDate);
    } catch (e) {
      console.error("invalid fixed date: %s", fixedDate);
    }
  }
  midnightRefresh();
  liveDateTime();
  removeReaddWeather();
  setInterval(removeReaddWeather, 3600000 /* 1hr */);
  if (globalThis.FIXED_DATE) {
    [...document.getElementsByClassName("widget")].forEach(
      (e) => (e.style.border = "1px solid white")
    );
  }
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", (e) => {
    startUp();
  });
} else {
  startUp();
}

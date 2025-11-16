
// Modified from https://codesandbox.io/p/sandbox/vanilla-js-month-calendar-kyd2l
//

const calendarBody = document.getElementById("days");
const months = [...localizedMonthNames("es-es", "long")];

function showCalendar(today, month, year) {
  let dayInt = today.getDate();
  // gets the day of the week for this date
  let firstDay = new Date(year, month).getDay();
  // clearing all previous cells
  calendarBody.innerHTML = "";
  // checking the mount of days in this month to control the loop
  let totalDays = daysInMonth(month, year);

  // adding the blank boxes so that date start on correct day of the week
  // substracting 1 to set monday as the first weekday
  // and testing for sunday because it became the 7th day
  blankDates(firstDay === 0 ? 6 : firstDay - 1);
  // adding the dates to the calendar
  for (let day = 1; day <= totalDays; day++) {
    // create li node with text content & apend to body
    let cell = document.createElement("li");
    let cellText = document.createTextNode(day);
    // adding active class if day matches today
    if (
      dayInt === day &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      cell.classList.add("active");
    }

    // appending date attributes to single date li element
    cell.setAttribute("data-day", day);
    cell.setAttribute("data-month", month);
    cell.setAttribute("data-year", year);

    //appending li to body of calendar
    cell.classList.add("singleDay");
    cell.appendChild(cellText);
    calendarBody.appendChild(cell);
    cell.addEventListener("click", dateClicked);
  }

  // set month string value
  document.getElementById("month").innerHTML = months[month] + " " + year;
}

function daysInMonth(month, year) {
  // day 0 here returns the last day of the PREVIOUS month
  return new Date(year, month + 1, 0).getDate();
}

function blankDates(count) {
  // looping to add the correct amount of blank days to the calendar
  for (let x = 0; x < count; x++) {
    let cell = document.createElement("li");
    let cellText = document.createTextNode("");
    cell.appendChild(cellText);
    // add the empty class to remove the borders
    cell.classList.add("empty");
    calendarBody.appendChild(cell);
  }
}

function next() {
  year = month === 11 ? year + 1 : year;
  month = (month + 1) % 12;
  showCalendar(month, year);
}

function previous() {
  year = month === 0 ? year - 1 : year;
  month = month === 0 ? 11 : month - 1;
  showCalendar(month, year);
}

const weekdays = document.getElementById("weekdays");
[...localizedWeekdayNames("es-es", "short")].forEach((n) => {
  const e = document.createElement("li");
  e.innerText = n;
  weekdays.appendChild(e);
});

function dateClicked(event) {
  const e=event.target;
  let showYear = e.getAttribute("data-year");
  let showMonth = e.getAttribute("data-month");
  let showDay = e.getAttribute("data-day");
  const dateClicked=`${showYear}-${parseInt(showMonth)+1}-${showDay.length===1?"0":""}${showDay}`;
  const destUrl= new URL(document.location.href);
  destUrl.searchParams.set("date",dateClicked);
  if(globalThis.FIXED_DATE){
    document.location.replace(destUrl);
  }
}

function refreshCalendar() {
  let today = globalThis.FIXED_DATE ? globalThis.FIXED_DATE : new Date();
  let month = today.getMonth();
  let year = today.getFullYear();
  // init calendar
  showCalendar(today, month, year);
}
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
  const weatherClass = "weather-widget";
  [...document.getElementsByClassName(weatherClass)].forEach((element) => {
    console.log("removing %o", element);
    element.parentElement.removeChild(element);
  });
  const weather = document.createElement("div");
  weather.classList.add("widget");
  weather.classList.add("weather-widget");

  /*
    // Elfsight weather
    weather.id = "weather-elfsight";
    weather.classList.add("elfsight-app-201230c4-550c-430e-9863-b0d53a23b1c0");
  */

  // // WeatherWidgets weather
  // weather.innerHTML=`
  //   <a class="weatherwidget-io" 
  //      href="https://forecast7.com/es/50d834d37/ixelles/"
  //      data-label_1="IXELLES"
  //      data-font="Roboto"
  //      data-days="3"
  //      data-theme="original"
  //      data-basecolor="#000030">
  //      IXELLES
  //   </a>
  // `
  // !(function (d, s, id) {
  //   var js,
  //     fjs = d.getElementsByTagName(s)[0];
  //   if (!d.getElementById(id)) {
  //     js = d.createElement(s);
  //     js.id = id;
  //     js.src = "https://weatherwidget.io/js/widget.min.js";
  //     fjs.parentNode.insertBefore(js, fjs);
  //   }
  // })(document, "script", "weatherwidget-io-js");

  // https://weatherwidget.org/
  weather.setAttribute("id","ww_58ce876d0c548");
  weather.setAttribute("v","1.3");
  weather.setAttribute("loc","auto");
  
  const params = {
    t: "responsive",
    lang: "es",
    sl_lpl: 1,
    ids: [],
    font: "Arial",
    sl_ics: "one",
    sl_sot: "celsius",
    cl_bkg: "image",
    cl_font: "#FFFFFF",
    cl_cloud: "#FFFFFF",
    cl_persp: "#81D4FA",
    cl_sun: "#FFC107",
    cl_moon: "#FFC107",
    cl_thund: "#FF5722",
    sl_tof: "3",
    cl_odd: "#0000000a",
    el_nme: 3,
  };
  weather.setAttribute("a",JSON.stringify(params))
  weather.style.fontSize="0.1px";
  weather.innerHTML =`
      Más previsiones:
      <a
        href="https://tiempolargo.com/madrid_tiempo_25_dias/"
        id="ww_58ce876d0c548_u"
        target="_blank"
        >Tiempo en 25 días</a
      >
  `;
  const layout = document.getElementById("layout");
  layout.appendChild(weather);
  setTimeout(() => updateWidget('ww_58ce876d0c548', 0),100);
  setTimeout(() => updateWeatherDays('ww_58ce876d0c548'),500);
}

function updateWeatherDays(id) {
  if(document.getElementById(id)) {
    const days = [...document.querySelectorAll(`#${id} .ww-box div.day-forecast`)];
    if( days.length ===3  ) {
      days[2].parentElement.removeChild(days[2]);
      days[0].querySelector(".date").textContent="Hoy";
      days[1].querySelector(".date").textContent="Mañana";
    } else {
      setTimeout(() => updateWeatherDays('ww_58ce876d0c548'),500);
    }
  }
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

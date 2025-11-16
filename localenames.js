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

const DAYS_IN_WEEK = 7;
const MONTHS_IN_YEAR = 12;

function localizedWeekdayNames(locale = "default", dateStyle = "short") {
  const dayNames = [];
  const currentDate = new Date();
  while (currentDate.getDay() !== 1) {
    currentDate.setDate(currentDate.getDate() + 1);
  }
  for (let day = 0; day < DAYS_IN_WEEK; day++) {
    dayNames.push(
      currentDate.toLocaleDateString(locale, {
        weekday: dateStyle,
      })
    );
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dayNames;
}

function localizedMonthNames(locale = "default", dateStyle = "short") {
  const monthNames = [];
  const currentDate = new Date();
  while (currentDate.getMonth() !== 0) {
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  for (let month = 0; month < MONTHS_IN_YEAR; month++) {
    monthNames.push(
      currentDate.toLocaleDateString(locale, {
        month: dateStyle,
      })
    );
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  return monthNames;
}

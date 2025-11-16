# Kiosk clock/calendar display

Use URL `calendar=` parameter to specify public Google calendar events to display.

Designed for landscape layout

For display of google calendar events, requires an API key to be specified in `apikey` parameter

Example:

```
https://nielm.github.io/clock/clock.html
  ?calendar=calendar=es-es.spain%23holiday@group.v.calendar.google.com
  &calendar=fr-fr.be%23holiday@group.v.calendar.google.com
  &apikey=XXXXXXXXXXXXXXXXXXXXX
```

Add `&date=2025-11-12T13:14` to display a fixed date/time for debugging, which also allows you to click on dates to change display date

Use with a kiosk - style full screen pinned app webview, for example: 

https://github.com/nktnet1/webview-kiosk
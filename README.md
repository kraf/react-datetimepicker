About
=====

Simple datetimepicker for use with React and Browserify. The only dependencies are _moment_ and _React_. The styling is minimal and needs to be adapted to the use case.

![Screenshot](https://raw.githubusercontent.com/kraf/react-datetimepicker/master/screenshot.jpg)

Usage
=====

`npm install react-datetimepicker`

`var DateTimePicker = require("react-datetimepicker");`

API
===

Properties with defaults (all optional)
------------------------

```
weekStart=1 // 0 -> Sun, 1 -> Mon, 2 -> Tue, 3 -> Wed, 4 -> Thu, 5 -> Fri, 6 -> Sat
time=true // show/hide time picker part
inputMode=true // render input or inline datepicker
dateFormat='YYYY-MM-DD' // used for input when time is set to false
dateTimeFormat='YYYY-MM-DD HH:mm' // used for input when time is set to true
selectedDate=undefined // moment object for initial selection
onChange=undefined // Gets invoked when selection changes
```

Debugging
=========

I provided a simple Makefile. Start ```make watchify``` in a terminal tab and ```make debugserver``` in another, then point browser to ```http://localhost:4444```.

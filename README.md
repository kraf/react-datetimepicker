About
=====

Simple datetimepicker for use with React.js. The only dependencies are _moment_ and _React_. The styling is minimal and you will most likely have to customize it.

![Screenshot](https://raw.githubusercontent.com/kraf/react-datetimepicker/master/screenshot.jpg)

Changes
=======

* 2.0.0
  * Breaking: switched to managed values

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
dateValidator=undefined // bool function(date) - return false to disable selection of particular date
dateTimeFormat='YYYY-MM-DD HH:mm' // used for input when time is set to true
value=(new Date()) // 
onChange=undefined // Gets invoked when selection changes
```

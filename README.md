About
=====

Simple datetimepicker for use with React and Browserify. I was unhappy with the alternatives and needed something with almost no dependencies. The only dependency is _moment_ (and _React_ obviously).

Usage
=====

`npm install react-datetimepicker`

`var DateTimePicker = require("react-datetimepicker");`

API
===

Properties with defaults
------------------------

```
weekStart=1 // 0 -> Sun, 1 -> Mon, 2 -> Tue, 3 -> Wed, 4 -> Thu, 5 -> Fri, 6 -> Sat
time=true
inputMode=true
dateFormat='YYYY-MM-DD' // used for input when time is set to false
dateTimeFormat='YYYY-MM-DD HH:mm' // used for input when time is set to true
onChange=undefined // Gets invoked when selection changes
```

Debugging
=========

I provided a simple Makefile. Start ```make watchify``` in a terminal tab and ```make debugserver``` in another, then point browser to ```http://localhost:4444```.

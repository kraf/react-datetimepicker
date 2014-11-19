'use strict';
// test app for datepicker

var React = require('react');
var DatePicker = require('../src/DateTimePicker');
var moment = require("moment");

window.datePicker = React.render(
	<DatePicker onChange={console.log.bind(console)} selectedDate={moment()} inputMode={false} time={true} />,
	document.getElementById('container')
);

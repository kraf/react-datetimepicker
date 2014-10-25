'use strict';
// test app for datepicker

var React = require('react');
var DatePicker = require('../src/DateTimePicker');
var moment = require("moment");

window.datePicker = React.renderComponent(
	<DatePicker onChange={console.log.bind(console)} selectedDate={moment().startOf('day')} inputMode={false} time={false} />,
	document.getElementById('container')
);

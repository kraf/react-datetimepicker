'use strict';
// test app for datepicker

var React = require('react');
var DatePicker = require('../src/DateTimePicker');

window.datePicker = React.renderComponent(
	<DatePicker onChange={console.log.bind(console)} />,
	document.getElementById('container')
);

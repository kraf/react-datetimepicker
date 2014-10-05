'use strict';
// test app for datepicker

var React = require('react');
var DatePicker = require('../src/DateTimePicker.jsx');

window.datePicker = React.renderComponent(
	<DatePicker />,
	document.getElementById('container')
);

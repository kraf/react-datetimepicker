/** @jsx React.DOM */

"use strict";

var React = require("react");

var DAY_MINUTES = 60 * 24;

function toTimePartString(timepart) {
	var s = timepart.toString();
	if(s.length === 1) {
		return "0" + s;
	} else {
		return s;
	}
}

function formatMinutes(minutes) {
	var hourPart = Math.floor(minutes / 60);
	var minutePart = minutes % 60;
	
	return toTimePartString(hourPart) + ":" + toTimePartString(minutePart);
}

var TimePicker = React.createClass({displayName: 'TimePicker',

	getDefaultProps:function() {
		return {
			timeInterval: 30 // minutes
		};
	},

	render:function() {
		var items = [];
		for(var ii=0; ii<DAY_MINUTES; ii+=this.props.timeInterval) {
			var value = formatMinutes(ii);
			items.push(React.DOM.option({key: ii, value: ii}, value));
		}

		return React.DOM.div({className: "time-picker"}, 
			React.DOM.select({ref: "select", onChange: this._handleChange}, 
				items
			)
		);
	},

	getValue:function() {
		return parseInt(this.refs.select.getDOMNode().value, 10);
	},

	_handleChange:function() {
		this.props.onChange(this.getValue());
	}
});

module.exports = TimePicker;

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

var TimePicker = React.createClass({displayName: 'TimePicker',

	getInitialState:function() {
		return {
			hours: 0,
			minutes: 0
		};
	},

	render:function() {
		return React.DOM.div({className: "time-picker"}, 
			React.DOM.div({className: "hours"}, 
				React.DOM.input({
					id: "hours", 
					type: "range", 
					ref: "hours", 
					min: 0, 
					max: 23, 
					value: this.state.hours, 
					onChange: this._handleChange}), 
				React.DOM.span(null, toTimePartString(this.state.hours))
			), 

			React.DOM.div({className: "minutes"}, 
				React.DOM.input({
					id: "minutes", 
					type: "range", 
					ref: "minutes", 
					min: 0, 
					max: 59, 
					value: this.state.minutes, 
					onChange: this._handleChange}), 
				React.DOM.span(null, toTimePartString(this.state.minutes))
			)
		);
	},

	getValue:function() {
		return this.state.hours * 60 + this.state.minutes;
	},

	_handleChange:function() {
		var hours = parseInt(this.refs.hours.getDOMNode().value, 10);
		var minutes = parseInt(this.refs.minutes.getDOMNode().value, 10);

		this.setState({
			hours: hours,
			minutes: minutes
		}, this.props.onChange);
	}
});

module.exports = TimePicker;

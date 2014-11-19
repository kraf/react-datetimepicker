/** @jsx React.DOM */

"use strict";

var React = require("react");

function toTimePartString(timepart) {
	var s = timepart.toString();
	if(s.length === 1) {
		return "0" + s;
	} else {
		return s;
	}
}

var TimePicker = React.createClass({

	getInitialState() {
		return {
			hours: 0,
			minutes: 0
		};
	},

	render() {
		return <div className="time-picker">
			<div className="hours">
				<input 
					id="hours"
					type="range" 
					ref="hours" 
					min={0} 
					max={23} 
					value={this.state.hours} 
					onChange={this._handleChange} />
				<span>{toTimePartString(this.state.hours)}</span>
			</div>

			<div className="minutes">
				<input 
					id="minutes"
					type="range" 
					ref="minutes" 
					min={0} 
					max={59} 
					value={this.state.minutes} 
					onChange={this._handleChange} />
				<span>{toTimePartString(this.state.minutes)}</span>
			</div>
		</div>;
	},

	getValue() {
		return this.state.hours * 60 + this.state.minutes;
	},

	setValue(minutesParam) {
		var hours = Math.floor(minutesParam / 60);
		var minutes = minutesParam % 60;

		this.setState({
			hours: hours,
			minutes: minutes
		});
	},

	_handleChange() {
		var hours = parseInt(this.refs.hours.getDOMNode().value, 10);
		var minutes = parseInt(this.refs.minutes.getDOMNode().value, 10);

		this.setState({
			hours: hours,
			minutes: minutes
		}, this.props.onChange);
	}
});

module.exports = TimePicker;

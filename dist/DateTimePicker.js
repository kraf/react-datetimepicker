/** @jsx React.DOM */

"use strict";

var moment = require("moment");
var React = require("react");

var Days = require("./Days");
var TimePicker = require("./TimePicker");

var DateTimePicker = React.createClass({displayName: 'DateTimePicker',

	getInitialState:function() {
		return {
			currentMonth: moment(),
			visible: !this.props.inputMode,
			minutes: 0
		};
	},

	getDefaultProps:function() {
		return {
			weekStart: 1, // Monday
			time: true,
			inputMode: true,
			dateTimeFormat: 'YYYY-MM-DD HH:mm',
			dateFormat: 'YYYY-MM-DD'
		};
	},

	render:function() {
		var weekDays = [
			"Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"  // weekStart: 0
		];
		for(var ii = 0; ii < this.props.weekStart; ii++) {
			weekDays.push(weekDays.shift());
		}

		var dayColumnHeaderCaptions = weekDays.map(function(day)  {
			return React.DOM.th({key: day}, day);
		});

		var timePicker = null;
		if(this.props.time) {
			timePicker = TimePicker({ref: "timePicker", onChange: this._handleTimeChange});
		}

		var datePicker = React.DOM.div({className: this._getClass()}, 
			React.DOM.div({className: "month-header"}, 
				React.DOM.button({className: "previous-month", onClick: this._handlePrev}, 
					"<"
				), 
				React.DOM.div({className: "month-label"}, 
					this.state.currentMonth.format('MMMM YYYY')
				), 
				React.DOM.button({className: "next-month", onClick: this._handleNext}, 
					">"
				)
			), 
			React.DOM.div(null, 
			React.DOM.table({className: "days"}, 
				React.DOM.thead(null, 
					React.DOM.tr(null, dayColumnHeaderCaptions)
				), 
				Days({
					month: this.state.currentMonth, 
					weekStart: this.props.weekStart, 
					selectedDate: this.state.selectedDate, 
					dateValidator: this.props.dateValidator, 
					onDayClick: this._handleDayChange})
			)
			), 

			timePicker
		);

		if(this.props.inputMode) {
			return React.DOM.div({className: "date-picker-wrapper"}, 
				React.DOM.input({type: "text", 
					onClick: this._handleInputClick, 
					value: this.getFormattedValue(), 
					readOnly: true}), 

				datePicker
			);
		} else {
			return datePicker;
		}
	},

	componentWillReceiveProps: function(nextProps) {
		if(this.props.inputMode && !nextProps.inputMode) {
			this.setState({ visible: true });
		}
	},

	getValue:function() {
		if(!this.state.selectedDate) {
			return null;
		}

		var selectedDate = this.state.selectedDate.clone();
		if(this.props.time) {
			selectedDate.add(this.state.minutes, 'minutes');
		}

		return selectedDate;
	},

	getFormattedValue:function() {
		var value = this.getValue();
		if(value) {
			if(!this.props.time && this.props.dateFormat) {
				value = value.format(this.props.dateFormat);
			} else {
				value = value.format(this.props.dateTimeFormat);
			}
		}
		return value;
	},

	_getClass:function() {
		var classes = "date-picker";

		if(this.props.inputMode) {
			classes += " input-mode";
		}

		if(!this.state.visible) {
			classes += " hidden";
		}

		return classes;
	},

	_handlePrev:function() {
		this.setState({
			currentMonth: this.state.currentMonth.clone().subtract(1, 'months')
		});
	},

	_handleNext:function() {
		this.setState({
			currentMonth: this.state.currentMonth.clone().add(1, 'months')
		});
	},

	_handleTimeChange:function() {
		var minutes = this.refs.timePicker.getValue();
		if(minutes >= 24*60) {
			throw new Error("The returned amount of minutes would change the date.");
		}
		this.setState({ minutes: minutes }, function()  {
			if(!this.props.inputMode) {
				this._emitChange();
			}
		}.bind(this));
	},

	_handleInputClick:function() {
		if(this.state.visible) {
			this.setState({ visible: false }, this._emitChange);
		} else {
			this.setState({ visible: true });
		}
	},

	_emitChange:function() {
		if(typeof this.props.onChange === 'function' && this.state.selectedDate) {
			this.props.onChange(this.getValue());
		}
	},

	_handleDayChange:function(date) {
		this.setState({ selectedDate: date }, function()  {
			if(!this.props.inputMode) {
				this._emitChange();
			} else if(!this.props.time) {
				this._emitChange();
				this.setState({ visible: false });
			}
		}.bind(this));
	}
});

module.exports = DateTimePicker;

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
			selectedDate: this.props.selectedDate
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
			return React.createElement("th", {key: day}, day);
		});

		var timePicker = null;
		if(this.props.time) {
			timePicker = React.createElement(TimePicker, {ref: "timePicker", onChange: this._handleTimeChange});
		}

		var datePicker = React.createElement("div", {className: this._getClass(), onClick: this._handleClick}, 
			React.createElement("div", {className: "month-header"}, 
				React.createElement("button", {className: "previous-month", onClick: this._handlePrev}, 
					"<"
				), 
				React.createElement("div", {className: "month-label"}, 
					this.state.currentMonth.format('MMMM YYYY')
				), 
				React.createElement("button", {className: "next-month", onClick: this._handleNext}, 
					">"
				)
			), 
			React.createElement("div", null, 
			React.createElement("table", {className: "days"}, 
				React.createElement("thead", null, 
					React.createElement("tr", null, dayColumnHeaderCaptions)
				), 
				React.createElement(Days, {
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
			return React.createElement("div", {className: "date-picker-wrapper"}, 
				React.createElement("input", {type: "text", 
					onClick: this._handleInputClick, 
					value: this.getFormattedValue(), 
					readOnly: true}), 

				datePicker
			);
		} else {
			return datePicker;
		}
	},

	componentWillUnmount:function() {
		if(this.state.visible) {
			document.removeEventListener('click', this._handleOutsideClick);
		}
	},

	componentWillReceiveProps: function(nextProps) {
		var updatedState = {};

		if(this.props.selectedDate !== nextProps.selectedDate) {
			if(nextProps.selectedDate) {
				updatedState.selectedDate = nextProps.selectedDate;
			}
		}
		if(this.props.inputMode && !nextProps.inputMode) {
			updatedState.visible = true;
		}
		this.setState(updatedState);
	},

	componentDidUpdate:function(prevProps, prevState) {
		if(prevState.visible !== this.state.visible) {
			if(this.state.visible) {
				document.addEventListener('click', this._handleOutsideClick);
			} else {
				document.removeEventListener('click', this._handleOutsideClick);
			}
		}
	},

	getValue:function() {
		if(!this.state.selectedDate) {
			return null;
		}

		var selectedDate = this.state.selectedDate.clone().startOf('day');
		if(this.props.time) {
			var minutes = this.refs.timePicker.getValue();
			selectedDate.add(minutes, 'minutes');
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

	setValue:function(date) {
		var momentDate = date._isAMomentObject ? date : moment(date);

		if(this.props.time) {
			var minutes = momentDate.hours() * 60 + momentDate.minutes();
			this.refs.timePicker.setValue(minutes);
		}

		this.setState({
			selectedDate: momentDate.clone().startOf('day')
		});
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

	_handleClick:function(ev) {
		ev.nativeEvent.stopImmediatePropagation();
	},

	_handleTimeChange:function() {
		if(!this.props.inputMode) {
			this._emitChange();
		}
	},

	_handleInputClick:function() {
		if(this.state.visible) {
			this.setState({ visible: false }, this._emitChange);
		} else {
			this.setState({ visible: true });
		}
	},

	_handleOutsideClick:function() {
		if(this.state.visible) {
			this.setState({ visible: false }, this._emitChange);
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

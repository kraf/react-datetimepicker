/** @jsx React.DOM */

"use strict";

var moment = require("moment");
var React = require("react");

var Days = require("./Days");
var TimePicker = require("./TimePicker");

var DateTimePicker = React.createClass({

	getInitialState() {
		return {
			currentMonth: moment(),
			visible: !this.props.inputMode
		};
	},

	getDefaultProps() {
		return {
			weekStart: 1, // Monday
			time: true,
			inputMode: true,
			dateTimeFormat: 'YYYY-MM-DD HH:mm',
			dateFormat: 'YYYY-MM-DD'
		};
	},

	render() {
		var weekDays = [
			"Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"  // weekStart: 0
		];
		for(var ii = 0; ii < this.props.weekStart; ii++) {
			weekDays.push(weekDays.shift());
		}

		var dayColumnHeaderCaptions = weekDays.map(day => {
			return <th key={day}>{day}</th>;
		});

		var timePicker = null;
		if(this.props.time) {
			timePicker = <TimePicker ref="timePicker" onChange={this._handleTimeChange} />;
		}

		var datePicker = <div className={this._getClass()}>
			<div className="month-header">
				<button className="previous-month" onClick={this._handlePrev}>
					{"<"}
				</button>
				<div className="month-label">
					{this.state.currentMonth.format('MMMM YYYY')}
				</div>
				<button className="next-month" onClick={this._handleNext}>
					{">"}
				</button>
			</div>
			<div>
			<table className="days">
				<thead>
					<tr>{dayColumnHeaderCaptions}</tr>
				</thead>
				<Days 
					month={this.state.currentMonth}
					weekStart={this.props.weekStart}
					selectedDate={this.state.selectedDate}
					dateValidator={this.props.dateValidator}
					onDayClick={this._handleDayChange} />
			</table>
			</div>

			{timePicker}
		</div>;

		if(this.props.inputMode) {
			return <div className="date-picker-wrapper">
				<input type="text" 
					onFocus={this._handleInputFocused} 
					value={this.getFormattedValue()}
					readOnly={true} />

				{datePicker}
			</div>;
		} else {
			return datePicker;
		}
	},

	componentWillReceiveProps: function(nextProps) {
		if(this.props.inputMode && !nextProps.inputMode) {
			this.setState({ visible: true });
		}
	},

	getValue() {
		if(!this.state.selectedDate) {
			return null;
		}

		var date = this.state.selectedDate.clone();

		if(this.props.time) {
			var minutes = this.refs.timePicker.getValue();
			date.add(minutes, 'minutes');
		}
		return date;
	},

	getFormattedValue() {
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

	_getClass() {
		var classes = "date-picker";

		if(this.props.inputMode) {
			classes += " input-mode";
		}

		if(!this.state.visible) {
			classes += " hidden";
		}

		return classes;
	},

	_handlePrev() {
		this.setState({
			currentMonth: this.state.currentMonth.clone().subtract(1, 'months')
		});
	},

	_handleNext() {
		this.setState({
			currentMonth: this.state.currentMonth.clone().add(1, 'months')
		});
	},

	_handleTimeChange() {
		this._emitChange();
		if(this.state.selectedDate) {
			this.setState({ visible: false });
		}
	},

	_handleInputFocused() {
		this.setState({ visible: true });
	},

	_emitChange() {
		if(typeof this.props.onChange === 'function' && this.state.selectedDate) {
			this.props.onChange(this.getValue());
		}
	},

	_handleDayChange(date) {
		var newState = {
			selectedDate: date
		};

		if(this.props.inputMode) {
			newState.visible = false;
		}

		this.setState(newState, this._emitChange);
	}
});

module.exports = DateTimePicker;

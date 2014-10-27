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
			visible: !this.props.inputMode,
			minutes: 0,
			selectedDate: this.props.selectedDate
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

		var datePicker = <div className={this._getClass()} onClick={this._handleClick}>
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
					onClick={this._handleInputClick} 
					value={this.getFormattedValue()}
					readOnly={true} />

				{datePicker}
			</div>;
		} else {
			return datePicker;
		}
	},

	componentWillUnmount() {
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

	componentDidUpdate(prevProps, prevState) {
		if(prevState.visible !== this.state.visible) {
			if(this.state.visible) {
				document.addEventListener('click', this._handleOutsideClick);
			} else {
				document.removeEventListener('click', this._handleOutsideClick);
			}
		}
	},

	getValue() {
		if(!this.state.selectedDate) {
			return null;
		}

		var selectedDate = this.state.selectedDate.clone();
		if(this.props.time) {
			selectedDate.add(this.state.minutes, 'minutes');
		}

		return selectedDate;
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

	_handleClick(ev) {
		ev.nativeEvent.stopImmediatePropagation();
	},

	_handleTimeChange() {
		var minutes = this.refs.timePicker.getValue();
		if(minutes >= 24*60) {
			throw new Error("The returned amount of minutes would change the date.");
		}
		this.setState({ minutes: minutes }, () => {
			if(!this.props.inputMode) {
				this._emitChange();
			}
		});
	},

	_handleInputClick() {
		if(this.state.visible) {
			this.setState({ visible: false }, this._emitChange);
		} else {
			this.setState({ visible: true });
		}
	},

	_handleOutsideClick() {
		if(this.state.visible) {
			this.setState({ visible: false }, this._emitChange);
		}
	},

	_emitChange() {
		if(typeof this.props.onChange === 'function' && this.state.selectedDate) {
			this.props.onChange(this.getValue());
		}
	},

	_handleDayChange(date) {
		this.setState({ selectedDate: date }, () => {
			if(!this.props.inputMode) {
				this._emitChange();
			} else if(!this.props.time) {
				this._emitChange();
				this.setState({ visible: false });
			}
		});
	}
});

module.exports = DateTimePicker;

'use strict';

const moment = require('moment');
const React = require('react');

const Days = require('./Days');
const TimePicker = require('./TimePicker');

const DateTimePicker = React.createClass({

    getInitialState() {
        const selectedDate = moment(this.props.value);
        const minutes = selectedDate ?
                  selectedDate.hours() * 60 + selectedDate.minutes() : 0;

        return {
            selectedDate: selectedDate,
            currentMonth: selectedDate,
            visible: !this.props.inputMode,
            minutes: minutes
        };
    },

    getDefaultProps() {
        return {
            weekStart: 1, // Monday
            time: true,
            inputMode: true,
            dateTimeFormat: 'YYYY-MM-DD HH:mm',
            dateFormat: 'YYYY-MM-DD',
            value: new Date()
        };
    },

    render() {
        const weekDays = [
            'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'  // weekStart: 0
        ];
        for(let ii = 0; ii < this.props.weekStart; ii++) {
            weekDays.push(weekDays.shift());
        }

        const dayColumnHeaderCaptions = weekDays.map(day => {
            return <th key={day}>{day}</th>;
        });

        const timePicker = this.props.time ?
        <TimePicker minutes={this.state.minutes}
                    ref="timePicker" 
                    onChange={this._handleTimeChange} /> : null;

        const selectedDate = (this.props.inputMode && this.state.visible) ?
        this.state.selectedDate : moment(this.props.value);
        
        const datePicker = (
            <div className={this._getClass()} onClick={this._handleClick}>
                <div className="month-header">
                    <button className="previous-month" onClick={this._handlePrev}>
                        {'<'}
                    </button>
                    <div className="month-label">
                        {this.state.currentMonth.format('MMMM YYYY')}
                    </div>
                    <button className="next-month" onClick={this._handleNext}>
                        {'>'}
                    </button>
                </div>
                <div>
                    <table className="days">
                        <thead>
                            <tr>{dayColumnHeaderCaptions}</tr>
                        </thead>
                        <Days month={this.state.currentMonth}
                              weekStart={this.props.weekStart}
                              selectedDate={selectedDate}
                              dateValidator={this.props.dateValidator}
                              onDayClick={this._handleDayChange} />
                    </table>
                </div>

                {timePicker}
            </div>
        );

        if(this.props.inputMode) {
            return (
                <div className="date-picker-wrapper">
                    <input type="text" 
                           onClick={this._handleInputClick} 
                           value={this.getFormattedValue()}
                           readOnly={true} />

                    {datePicker}
                </div>
            );
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
        const updatedState = {};

        if(this.props.inputMode && !nextProps.inputMode) {
            updatedState.visible = true;
        }
        if(this.props.value !== nextProps.value) {
            updatedState.selectedDate = moment(this.props.value);
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

    setCurrentMonth(month) {
        this.setState({
            currentMonth: moment(month)
        });
    },
    
    getFormattedValue() {
        let value = moment(this.props.value);
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
        let classes = 'date-picker';

        if(this.props.inputMode) {
            classes += ' input-mode';
        }

        if(!this.state.visible) {
            classes += ' hidden';
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

    _handleTimeChange(newMinutes) {
        this.setState({
            minutes: newMinutes
        }, () => {
            if(!this.props.inputMode) {
                this._emitChange();
            }
        });
    },

    _handleInputClick() {
        if(this.state.visible) {
            this.setState({visible: false}, this._emitChange);
        } else {
            this.setState({
                visible: true,
                selectedDate: moment(this.props.value)
            });
        }
    },

    _handleOutsideClick() {
        if(this.state.visible) {
            this.setState({visible: false}, this._emitChange);
        }
    },

    _emitChange() {
        if(typeof this.props.onChange === 'function' && this.state.selectedDate) {
            this.props.onChange(this.state.selectedDate);
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
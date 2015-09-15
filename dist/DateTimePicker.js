'use strict';

var moment = require('moment');
var React = require('react');

var Days = require('./Days');
var TimePicker = require('./TimePicker');

var DateTimePicker = React.createClass({
    displayName: 'DateTimePicker',

    getInitialState: function getInitialState() {
        return this._deriveState();
    },

    getDefaultProps: function getDefaultProps() {
        return {
            weekStart: 1, // Monday
            time: true,
            inputMode: true,
            dateTimeFormat: 'YYYY-MM-DD HH:mm',
            dateFormat: 'YYYY-MM-DD',
            value: new Date()
        };
    },

    render: function render() {
        var weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa' // weekStart: 0
        ];
        for (var ii = 0; ii < this.props.weekStart; ii++) {
            weekDays.push(weekDays.shift());
        }

        var dayColumnHeaderCaptions = weekDays.map(function (day) {
            return React.createElement(
                'th',
                { key: day },
                day
            );
        });

        var timePicker = this.props.time ? React.createElement(TimePicker, { minutes: this.state.minutes,
            ref: 'timePicker',
            onChange: this._handleTimeChange }) : null;

        var selectedDate = this.props.inputMode && this.state.visible ? this.state.selectedDate : moment(this.props.value);

        var datePicker = React.createElement(
            'div',
            { className: this._getClass(), onClick: this._handleClick },
            React.createElement(
                'div',
                { className: 'month-header' },
                React.createElement(
                    'button',
                    { className: 'previous-month', onClick: this._handlePrev },
                    '<'
                ),
                React.createElement(
                    'div',
                    { className: 'month-label' },
                    this.state.currentMonth.format('MMMM YYYY')
                ),
                React.createElement(
                    'button',
                    { className: 'next-month', onClick: this._handleNext },
                    '>'
                )
            ),
            React.createElement(
                'div',
                null,
                React.createElement(
                    'table',
                    { className: 'days' },
                    React.createElement(
                        'thead',
                        null,
                        React.createElement(
                            'tr',
                            null,
                            dayColumnHeaderCaptions
                        )
                    ),
                    React.createElement(Days, { month: this.state.currentMonth,
                        weekStart: this.props.weekStart,
                        selectedDate: selectedDate,
                        dateValidator: this.props.dateValidator,
                        onDayClick: this._handleDayChange })
                )
            ),
            timePicker
        );

        if (this.props.inputMode) {
            return React.createElement(
                'div',
                { className: 'date-picker-wrapper' },
                React.createElement('input', { type: 'text',
                    onClick: this._handleInputClick,
                    value: this.getFormattedValue(),
                    readOnly: true }),
                datePicker
            );
        } else {
            return datePicker;
        }
    },

    componentWillUnmount: function componentWillUnmount() {
        if (this.state.visible) {
            document.removeEventListener('click', this._handleOutsideClick);
        }
    },

    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        // XXX what to do about this? it's unlikely someone will do this
        if (this.props.inputMode && !nextProps.inputMode) {
            this.setState({ visible: true });
        }

        if (this.props.value !== nextProps.value) {
            this.setState(this._deriveState());
        }
    },

    componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
        if (prevState.visible !== this.state.visible) {
            if (this.state.visible) {
                document.addEventListener('click', this._handleOutsideClick);
            } else {
                document.removeEventListener('click', this._handleOutsideClick);
            }
        }
    },

    setCurrentMonth: function setCurrentMonth(month) {
        this.setState({
            currentMonth: moment(month)
        });
    },

    getFormattedValue: function getFormattedValue() {
        var value = moment(this.props.value);
        if (value) {
            if (!this.props.time && this.props.dateFormat) {
                value = value.format(this.props.dateFormat);
            } else {
                value = value.format(this.props.dateTimeFormat);
            }
        }
        return value;
    },

    _deriveState: function _deriveState() {
        var selectedDate = moment(this.props.value);
        var minutes = selectedDate ? selectedDate.hours() * 60 + selectedDate.minutes() : 0;

        return {
            selectedDate: selectedDate,
            currentMonth: selectedDate,
            visible: !this.props.inputMode,
            minutes: minutes
        };
    },

    _getClass: function _getClass() {
        var classes = 'date-picker';

        if (this.props.inputMode) {
            classes += ' input-mode';
        }

        if (!this.state.visible) {
            classes += ' hidden';
        }

        return classes;
    },

    _handlePrev: function _handlePrev() {
        this.setState({
            currentMonth: this.state.currentMonth.clone().subtract(1, 'months')
        });
    },

    _handleNext: function _handleNext() {
        this.setState({
            currentMonth: this.state.currentMonth.clone().add(1, 'months')
        });
    },

    _handleClick: function _handleClick(ev) {
        ev.nativeEvent.stopImmediatePropagation();
    },

    _handleTimeChange: function _handleTimeChange(newMinutes) {
        var _this = this;

        this.setState({
            minutes: newMinutes
        }, function () {
            if (!_this.props.inputMode) {
                _this._emitChange();
            }
        });
    },

    _handleInputClick: function _handleInputClick() {
        if (this.state.visible) {
            this.setState({ visible: false }, this._emitChange);
        } else {
            this.setState({
                visible: true
            });
        }
    },

    _handleOutsideClick: function _handleOutsideClick() {
        if (this.state.visible) {
            this.setState({ visible: false }, this._emitChange);
        }
    },

    // TODO emit change is the hard part, half-done
    _emitChange: function _emitChange(date) {
        if (typeof this.props.onChange === 'function' && date) {
            this.props.onChange(date);
        }
    },

    _handleDayChange: function _handleDayChange(date) {
        var _this2 = this;

        this.setState({ selectedDate: date }, function () {
            if (!_this2.props.inputMode) {
                _this2._emitChange(date.toDate());
            } else if (!_this2.props.time) {
                _this2._emitChange(date.toDate());
                _this2.setState({ visible: false });
            }
        });
    }
});

module.exports = DateTimePicker;
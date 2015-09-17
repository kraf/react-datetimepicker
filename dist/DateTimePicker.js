'use strict';

// TODO 'current' should be renamed to 'transient'

var moment = require('moment');
var React = require('react');

var Days = require('./Days');
var TimePicker = require('./TimePicker');

var KEYS = {
    RETURN: 13,
    ESC: 27,
    TAB: 9
};

var DateTimePicker = React.createClass({
    displayName: 'DateTimePicker',

    getInitialState: function getInitialState() {
        var initialState = this._deriveState();
        initialState.currentMonth = initialState.selectedDate;
        return initialState;
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

        var selectedDate = this._getCurrentValue();

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
                    value: this._getFormattedCurrentValue(),
                    readOnly: true }),
                datePicker
            );
        } else {
            return datePicker;
        }
    },

    componentWillUnmount: function componentWillUnmount() {
        if (this.state.visible) {
            document.removeEventListener('click', this._closeInput);
            document.removeEventListener('keydown', this._handleKeyDown);
        }
    },

    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        var nextState = this._deriveState(nextProps);

        // XXX what to do about this? it's unlikely someone will do this
        if (this.props.inputMode && !nextProps.inputMode) {
            nextState.visible = true;
            this.setState(nextState);
        }

        if (this.props.value !== nextProps.value) {
            nextState.currentMonth = nextState.selectedDate;
            this.setState(nextState);
        }
    },

    componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
        if (prevState.visible !== this.state.visible) {
            if (this.state.visible) {
                document.addEventListener('click', this._closeInput);
                document.addEventListener('keydown', this._handleKeyDown);
            } else {
                document.removeEventListener('click', this._closeInput);
                document.removeEventListener('keydown', this._handleKeyDown);
            }
        }
    },

    getFormattedValue: function getFormattedValue() {
        if (!this.props.time && this.props.dateFormat) {
            return moment(this.props.value).format(this.props.dateFormat);
        } else {
            return moment(this.props.value).format(this.props.dateTimeFormat);
        }
    },

    _getCurrentValue: function _getCurrentValue() {
        if (this.props.inputMode && this.state.visible) {
            var date = this.state.selectedDate;
            return date.startOf('day').add(this.state.minutes, 'minutes');
        } else {
            return moment(this.props.value);
        }
    },

    _getFormattedCurrentValue: function _getFormattedCurrentValue() {
        var value = this._getCurrentValue();
        if (!this.props.time && this.props.dateFormat) {
            return value.format(this.props.dateFormat);
        } else {
            return value.format(this.props.dateTimeFormat);
        }
    },

    _deriveState: function _deriveState(props) {
        if (!props) {
            props = this.props;
        }

        var selectedDate = moment(props.value);
        var minutes = selectedDate ? selectedDate.hours() * 60 + selectedDate.minutes() : 0;

        return {
            selectedDate: selectedDate,
            visible: !props.inputMode,
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
        var _this2 = this;

        var currentValue = this._getCurrentValue().toDate();

        var nextState = this._deriveState();

        if (this.state.visible) {
            nextState.visible = false;
            this.setState(nextState, function () {
                return _this2._emitChange(currentValue);
            });
        } else {
            nextState.visible = true;
            this.setState(nextState);
        }
    },

    _closeInput: function _closeInput() {
        var _this3 = this;

        if (this.state.visible) {
            (function () {
                var currentValue = _this3._getCurrentValue().toDate();

                var nextState = _this3._deriveState();
                nextState.visible = false;

                _this3.setState(nextState, function () {
                    return _this3._emitChange(currentValue);
                });
            })();
        }
    },

    _handleKeyDown: function _handleKeyDown(e) {
        e.preventDefault();

        switch (e.which) {
            case KEYS.ESC:
            case KEYS.TAB:
                this._closeInput();
                return;
        }
    },

    // TODO emit change is the hard part, half-done
    _emitChange: function _emitChange(date) {
        if (typeof this.props.onChange === 'function' && date) {
            this.props.onChange(date);
        }
    },

    _handleDayChange: function _handleDayChange(date) {
        var _this4 = this;

        if (!this.props.inputMode) {
            this._emitChange(date.toDate());
            return;
        }

        if (!this.props.time) {
            var nextState = this._deriveState();
            nextState.visible = false;
            this.setState(nextState, function () {
                _this4._emitChange(date.toDate());
            });
            return;
        }

        this.setState({ selectedDate: date });
    }
});

module.exports = DateTimePicker;
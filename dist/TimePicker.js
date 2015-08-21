'use strict';

var React = require('react');

function toTimePartString(timepart) {
    var s = timepart.toString();
    if (s.length === 1) {
        return '0' + s;
    } else {
        return s;
    }
}

var TimePicker = React.createClass({
    displayName: 'TimePicker',

    render: function render() {
        return React.createElement(
            'div',
            { className: 'time-picker' },
            React.createElement(
                'div',
                { className: 'hours' },
                React.createElement('input', { id: 'hours',
                    type: 'range',
                    ref: 'hours',
                    min: 0,
                    max: 23,
                    value: this.getHours(),
                    onChange: this._handleChange }),
                React.createElement(
                    'span',
                    null,
                    toTimePartString(this.getHours())
                )
            ),
            React.createElement(
                'div',
                { className: 'minutes' },
                React.createElement('input', { id: 'minutes',
                    type: 'range',
                    ref: 'minutes',
                    min: 0,
                    max: 59,
                    value: this.getMinutes(),
                    onChange: this._handleChange }),
                React.createElement(
                    'span',
                    null,
                    toTimePartString(this.getMinutes())
                )
            )
        );
    },

    getHours: function getHours() {
        return Math.floor(this.props.minutes / 60);
    },

    getMinutes: function getMinutes() {
        return this.props.minutes % 60;
    },

    _handleChange: function _handleChange() {
        var hours = parseInt(this.refs.hours.getDOMNode().value, 10);
        var minutes = parseInt(this.refs.minutes.getDOMNode().value, 10);

        this.props.onChange(hours * 60 + minutes);
    }
});

module.exports = TimePicker;
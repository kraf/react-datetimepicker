/** @jsx React.DOM */

'use strict';

var React = require('react');

function toTimePartString(timepart) {
    var s = timepart.toString();
    if(s.length === 1) {
        return "0" + s;
    } else {
        return s;
    }
}

var TimePicker = React.createClass({

    render() {
        return (
            <div className="time-picker">
                <div className="hours">
                    <input id="hours"
                           type="range" 
                           ref="hours" 
                           min={0} 
                           max={23} 
                           value={this.getHours()} 
                           onChange={this._handleChange} />
                    <span>{toTimePartString(this.getHours())}</span>
                </div>

                <div className="minutes">
                    <input id="minutes"
                           type="range" 
                           ref="minutes" 
                           min={0} 
                           max={59} 
                           value={this.getMinutes()} 
                           onChange={this._handleChange} />
                    <span>{toTimePartString(this.getMinutes())}</span>
                </div>
            </div>
        );
    },

    getHours() {
        return Math.floor(this.props.minutes / 60);
    },

    getMinutes() {
        return this.props.minutes % 60;
    },

    _handleChange() {
        var hours = parseInt(this.refs.hours.getDOMNode().value, 10);
        var minutes = parseInt(this.refs.minutes.getDOMNode().value, 10);

        this.props.onChange(hours * 60 + minutes);
    }
});

module.exports = TimePicker;

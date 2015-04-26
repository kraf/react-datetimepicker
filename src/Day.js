/** @jsx React.DOM */

'use strict';

var React = require('react');

var Day = React.createClass({
    render() {
        return <td className={this._getClass()} onClick={this._handleDayClick}>
            {this.props.date.date()}
        </td>;
    },

    _getClass() {
        var classes = 'day';
        if(this.props.cssClass) {
            classes += ' ' + this.props.cssClass;
        }
        if(this.props.disabled) {
            classes += ' disabled';
        }
        if(this.props.selected) {
            classes += ' selected';
        }
        if(this.props.today) {
            classes += ' today';
        }
        return classes;
    },

    _handleDayClick() {
        if(!this.props.disabled) {
            this.props.onClick(this.props.date);
        }
    }
});

module.exports = Day;

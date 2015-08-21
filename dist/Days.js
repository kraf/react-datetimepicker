'use strict';

var React = require('react');
var Day = require('./Day');
var moment = require('moment');

var Days = React.createClass({
    displayName: 'Days',

    render: function render() {
        var month = this.props.month;
        var weekStart = this.props.weekStart;

        var firstOfMonth = month.clone().startOf('month');
        var lastOfMonth = month.clone().endOf('month');

        var subtract = (firstOfMonth.day() - weekStart) % 7;
        subtract = subtract < 0 ? subtract + 7 : subtract;

        var startDate = firstOfMonth.clone().subtract(subtract, 'days');

        // we want stopDate to be 1 day higher than the last
        // day to be rendered, so we can use moment#isBefore
        var stopDate = undefined;
        if (weekStart === lastOfMonth.day()) {
            stopDate = lastOfMonth.clone().add(7, 'days');
        } else {
            var add = (weekStart - lastOfMonth.day()) % 7;
            add = add < 0 ? add + 7 : add;
            stopDate = lastOfMonth.clone().add(add, 'days');
        }

        var rows = [];
        var thisRow = null;
        var thisDate = startDate;
        while (thisDate.isBefore(stopDate)) {
            if (thisDate.day() === weekStart) {
                if (thisRow) {
                    rows.push(thisRow);
                }
                thisRow = [];
            }

            var cssClass = null;if (thisDate.isBefore(firstOfMonth)) {
                cssClass = 'prev';
            } else if (thisDate.isAfter(lastOfMonth)) {
                cssClass = 'next';
            }

            var isDisabled = false;
            if (typeof this.props.dateValidator === 'function') {
                isDisabled = !this.props.dateValidator(thisDate);
            }

            var isSelected = false;
            if (this.props.selectedDate) {
                var selectedDate = this.props.selectedDate.startOf('day').clone();
                isSelected = thisDate.isSame(selectedDate);
            }

            thisRow.push(React.createElement(Day, { date: thisDate.clone(),
                key: thisDate.valueOf(),
                cssClass: cssClass,
                selected: isSelected,
                disabled: isDisabled,
                today: thisDate.isSame(moment().startOf('day')),
                onClick: this.props.onDayClick }));

            thisDate.add(1, 'days');
        }

        var domRows = rows.map(function (row, rowIndex) {
            /*
             * XXX Adding index as key to get rid of Reacts
             *     warnings. Does this make sense here?
             */
            return React.createElement(
                'tr',
                { key: rowIndex },
                row
            );
        });

        return React.createElement(
            'tbody',
            null,
            domRows
        );
    }
});

module.exports = Days;
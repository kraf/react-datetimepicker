'use strict';

const React = require('react');
const Day = require('./Day');
const moment = require('moment');

const Days = React.createClass({
    render() {
        const month = this.props.month;
        const weekStart = this.props.weekStart;

        const firstOfMonth = month.clone().startOf('month');
        const lastOfMonth = month.clone().endOf('month');

        let subtract = (firstOfMonth.day() - weekStart) % 7; 
        subtract = subtract < 0 ? subtract + 7 : subtract;
        
        const startDate = firstOfMonth.clone().subtract(
            subtract, 'days' 
        );

        // we want stopDate to be 1 day higher than the last
        // day to be rendered, so we can use moment#isBefore
        let stopDate;
        if(weekStart === lastOfMonth.day()) {
            stopDate = lastOfMonth.clone().add(
                7, 'days'
            );
        } else {
            let add = (weekStart - lastOfMonth.day()) % 7;
            add = add < 0 ? add + 7 : add;
            stopDate = lastOfMonth.clone().add(
                add, 'days'
            );
        }

        const rows = [];
        let thisRow = null;
        let thisDate = startDate;
        while(thisDate.isBefore(stopDate)) {
            if(thisDate.day() === weekStart) {
                if(thisRow) {
                    rows.push(thisRow);
                }
                thisRow = [];
            }

            let cssClass = null; if(thisDate.isBefore(firstOfMonth)) {
                cssClass = 'prev';
            } else if(thisDate.isAfter(lastOfMonth)) {
                cssClass = 'next';
            }

            let isDisabled = false;
            if(typeof this.props.dateValidator === 'function') {
                isDisabled = !this.props.dateValidator(thisDate);
            }

            let isSelected = false;
            if(this.props.selectedDate) {
                const selectedDate = this.props.selectedDate.startOf('day').clone();
                isSelected = thisDate.isSame(selectedDate);
            }

            thisRow.push(
                <Day date={thisDate.clone()} 
                     key={thisDate.valueOf()}
                     cssClass={cssClass}
                     selected={isSelected}
                     disabled={isDisabled}
                     today={thisDate.isSame(moment().startOf('day'))}
                     onClick={this.props.onDayClick}/>);

            thisDate.add(1, 'days');
        }

        const domRows = rows.map((row, rowIndex) => {
            /*
             * XXX Adding index as key to get rid of Reacts
             *     warnings. Does this make sense here?
             */
            return (
                <tr key={rowIndex}>
                    {row}
                </tr>
            );
        });

        return (
            <tbody>
                {domRows}
            </tbody>
        );
    }
});

module.exports = Days;

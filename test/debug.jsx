'use strict';
// test app for datepicker

var React = require('react');
var DatePicker = require('../src/DateTimePicker');
var moment = require("moment");

var Test = React.createClass({
    
    getInitialState() {
        var self = this;
        window.setMonth = function(m) {
            self.refs.dp.setCurrentMonth(m);
        };
        
        return {
            value: new Date()
        };
    },
    
    render() {
        return <DatePicker onChange={this._handleDateChange}
                           ref="dp"
                           value={this.state.value}
                           inputMode={true}
                           time={true} />;
    },

    _handleDateChange(newDate) {
        console.log(newDate);
        /*         this.setState({value: newDate}); */
    }
})

window.datePicker = React.render(
    <Test />,
    document.getElementById('container')
);

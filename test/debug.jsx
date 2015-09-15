'use strict';
// test app for datepicker

var React = require('react');
var DatePicker = require('../src/DateTimePicker');
var moment = require('moment');

var Test = React.createClass({
    
    getInitialState() {
        return {
            value: new Date(2014, 1, 2, 14, 0)
        };
    },
    
    render() {
        return (
            <div>
            <DatePicker onChange={this._handleDateChange}
            value={this.state.value}
            inputMode={true}
            time={false} />
            
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            
            <DatePicker onChange={this._handleDateChange}
                        value={this.state.value}
                        inputMode={false}
                        time={false} />
            </div>
        );

    },

    _handleDateChange(newDate) {
        console.log('onChange', newDate);
        this.setState({value: newDate});
    }
});

window.datePicker = React.render(
    <Test />,
    document.getElementById('container')
);

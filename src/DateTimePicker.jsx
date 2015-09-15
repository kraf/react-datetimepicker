'use strict';

// TODO 'current' should be renamed to 'transient'

const moment = require('moment');
const React = require('react');

const Days = require('./Days');
const TimePicker = require('./TimePicker');

const KEYS = {
    RETURN: 13,
    ESC: 27,
    TAB: 9
};

const DateTimePicker = React.createClass({

    getInitialState() {
        const initialState = this._deriveState();
        initialState.currentMonth = initialState.selectedDate;
        return initialState;
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

        const selectedDate = this._getCurrentValue();
        
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
                           value={this._getFormattedCurrentValue()}
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
            document.removeEventListener('click', this._closeInput);
            document.removeEventListener('keydown', this._handleKeyDown);
        }
    },

    componentWillReceiveProps: function(nextProps) {
        const nextState = this._deriveState(nextProps);
        
        // XXX what to do about this? it's unlikely someone will do this
        if(this.props.inputMode && !nextProps.inputMode) {
            nextState.visible = true;
            this.setState(nextState);
        }
        
        if(this.props.value !== nextProps.value) {
            nextState.currentMonth = nextState.selectedDate;
            this.setState(nextState);
        }
    },

    componentDidUpdate(prevProps, prevState) {
        if(prevState.visible !== this.state.visible) {
            if(this.state.visible) {
                document.addEventListener('click', this._closeInput);
                document.addEventListener('keydown', this._handleKeyDown);
            } else {
                document.removeEventListener('click', this._closeInput);
                document.removeEventListener('keydown', this._handleKeyDown);
            }
        }
    },

    setCurrentMonth(month) {
        this.setState({
            currentMonth: moment(month)
        });
    },
    
    _getCurrentValue() {
        if(this.props.inputMode && this.state.visible) {
            const date = this.state.selectedDate;
            return date.startOf('day').add(this.state.minutes, 'minutes');
        } else {
            return moment(this.props.value);
        }
    },

    _getFormattedCurrentValue() {
        const value = this._getCurrentValue();
        if(!this.props.time && this.props.dateFormat) {
            return value.format(this.props.dateFormat);
        } else {
            return value.format(this.props.dateTimeFormat);
        }
    },

    _deriveState(props) {
        if(!props) {
            props = this.props;
        }
        
        const selectedDate = moment(props.value);
        const minutes = selectedDate ?
                        selectedDate.hours() * 60 + selectedDate.minutes() : 0;

        return {
            selectedDate: selectedDate,
            visible: !props.inputMode,
            minutes: minutes
        };
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
        const currentValue = this._getCurrentValue().toDate();
        
        const nextState = this._deriveState();
        
        if(this.state.visible) {
            nextState.visible = false;
            this.setState(nextState, () => this._emitChange(currentValue));
        } else {
            nextState.visible = true;
            this.setState(nextState);
        }
    },

    _closeInput() {
        if(this.state.visible) {
            const currentValue = this._getCurrentValue().toDate();
            
            const nextState = this._deriveState();
            nextState.visible = false;
            
            this.setState(nextState, () => this._emitChange(currentValue));
        }
    },

    _handleKeyDown(e) {
        e.preventDefault();
        
        switch(e.which) {
            case KEYS.ESC:
            case KEYS.TAB:
                this._closeInput();
                return;
        }
    },

    // TODO emit change is the hard part, half-done
    _emitChange(date) {
        if(typeof this.props.onChange === 'function' && date) {
            this.props.onChange(date);
        }
    },

    _handleDayChange(date) {
        if(!this.props.inputMode) {
            this._emitChange(date.toDate());
            return;
        }

        if(!this.props.time) {
            const nextState = this._deriveState();
            nextState.visible = false;
            this.setState(nextState, () => {
                this._emitChange(date.toDate());
            });
            return;
        }
        
        this.setState({selectedDate: date});
    }
});

module.exports = DateTimePicker;

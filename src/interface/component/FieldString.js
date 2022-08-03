import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ButtonClear from './ButtonClear.js';

class FieldString extends Component {

    constructor(props) {
        super(props);
        this.state = {
          focused: (props.locked && props.focused) || false,
          value: props.value || '',
          error: props.error || '',
          label: props.label || '',
          placeholder: props.placeholder || '',
          visibility: props.visibility
        };
    }

    static propTypes = {
        id: PropTypes.string.isRequired,
        locked: PropTypes.bool,
        focused: PropTypes.bool,
        value: PropTypes.string,
        error: PropTypes.string,
        label: PropTypes.string,
        placeholder: PropTypes.string,
        onChange: PropTypes.func,
    };

    static defaultProps = {
        locked: false,
        focused: false,
        value: '',
        error: '',
        label: '',
        placeholder: '',
        onChange: () => '',
    };

    onChange = (e) => {
        const { id } = this.props;
        const value = e.target.value;
        this.setState({ 
            value,
            error: '' 
        });
        return this.props.onChange(id, value);
    }

    clearField = () => {
        //const { id } = this.props;
        this.setState({ 
            value: '',
            error: '' 
        });
        return this.props.onClear();
        //return this.props.onChange(id, '');
	}

render() {
    const { focused, placeholder, value, error, label } = this.state;
    const { id, locked } = this.props;
    const fieldClassName = `field ${(locked ? focused : focused || value) && 
                           'focused'} ${locked && !focused && 'locked'}`;
    const centerField = fieldClassName + ' ' + this.state.visibility;

    return (
            <div className={centerField}>
                <input
                    id={id}
                    value={value}   
                    placeholder={placeholder}
                    onChange={this.onChange}
                    onFocus={() => !locked && this.setState({ focused: true })}
                    onBlur={() => !locked && this.setState({ focused: false })}
                    onKeyPress={this.onKeyPress}
                />

                <label htmlFor={id} className={error && 'error'}>
                    {error || label}
                </label>

                <ButtonClear onClick={this.clearField} />
            </div>
    )
  }
}

export default FieldString;
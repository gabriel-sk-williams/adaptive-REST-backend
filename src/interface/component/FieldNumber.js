import React, { Component } from 'react';
import PropTypes from 'prop-types';

class FieldNumber extends Component {

    constructor(props) {
        super(props);
        this.state = {
          focused: (props.locked && props.focused) || false,
          value: props.value || 0,
          error: props.error || '',
          label: props.label || '',
          placeholder: props.placeholder || 0,
          unit: props.unit || '',
          unitMargin: '',
          visibility: props.visibility
        };
    }

    static propTypes = {
        id: PropTypes.string.isRequired,
        locked: PropTypes.bool,
        focused: PropTypes.bool,
        value: PropTypes.number,
        error: PropTypes.string,
        label: PropTypes.string,
        placeholder: PropTypes.number,
        unit: PropTypes.string,
        unitMargin: PropTypes.string,
        onChange: PropTypes.func,
    };

    static defaultProps = {
        locked: false,
        focused: false,
        value: 0,
        error: '',
        label: '',
        placeholder: 0,
        unit: '',
        unitMargin: '',
        onChange: () => '',
    };

    componentDidMount() {
        // adjusts unitMargin according to size
        const cntr = document.createElement("div");
        cntr.style.display = "inline-block";
        cntr.style.position = "absolute";
        cntr.style.visibility = "hidden";
        cntr.style.zIndex = -1;

        var txt = document.createElement('p');
        txt.innerHTML = this.props.unit;

        cntr.appendChild(txt);
        document.body.appendChild(cntr);
        
        const boxwidth = cntr.clientWidth + 15;
        const width = '-' + boxwidth.toString() + 'px';
        this.setState({ unitMargin: width });
        cntr.parentNode.removeChild(cntr);
    }

    onChange = (e) => {
        const { id } = this.props;
        const value = e.target.value;
        this.setState({ value, error: '' });

        return this.props.onChange(id, value); /*currently using OnKeyPress instead*/
    }

    onKeyPress = (e) => {
        let key = e.key;
        let val = parseFloat(e.target.value);
        const { id } = this.props;
        if (key === 'Enter') {
            return this.props.onEnter(id, val);
        }     
    }

render() {
    const { focused, placeholder, value, error, label, unit, unitMargin } = this.state;
    const { id, locked } = this.props;
    const fieldClassName = `field ${(locked ? focused : focused || value) && 
                           'focused'} ${locked && !focused && 'locked'}`;
    const centerField = fieldClassName + ' ' + this.state.visibility;

    return (
            <div className={centerField}>
                <input
                id={id}
                unit={unit}
                value={value}   
                placeholder={placeholder}
                onChange={this.onChange}
                onFocus={() => !locked && this.setState({ focused: true })}
                onBlur={() => !locked && this.setState({ focused: false })}
                onKeyPress={this.onKeyPress}
                />

                <span style={{marginLeft: unitMargin}}>{unit}</span>

                <label htmlFor={id} className={error && 'error'}>
                {error || label}
                </label>
            </div>
    )
  }
}

export default FieldNumber;
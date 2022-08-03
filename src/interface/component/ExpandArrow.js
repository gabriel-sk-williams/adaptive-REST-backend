import React, { Component } from 'react';
import IconArrow from '../icon/IconArrow.js';

class ExpandArrow extends Component {
	constructor(props) {
		super(props);
		this.state = {
            expanded: props.expanded
		}
	}

    static getDerivedStateFromProps(newProps) {
        return { expanded: newProps.expanded }
    }   

    handleClick = () => {
		this.props.onClick();
	}

	render() {
		let { expanded } = this.state;
		return (
            <li className="expand-container flex">
                <div className="expand-blank" />
                <div 
                    onClick={this.handleClick} 
                    className="expand-arrow"
                >
                    {expanded ? 
                        <IconArrow type="down" /> :
                        <IconArrow type="up" />
                    }
                </div>
            </li>
		);
	}
}

export default ExpandArrow
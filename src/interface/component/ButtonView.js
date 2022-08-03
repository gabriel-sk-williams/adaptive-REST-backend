import React, { Component } from 'react';
import IconMono from "../icon/IconMono.js";

class ButtonView extends Component {

	constructor(props) {
		super(props);
		this.state = {
			active: props.active || false
		}
	}

	static getDerivedStateFromProps(props, state) {
		if (props.active !== state.active) return { active: props.active };
		return null;
	}
	
	handleClick = () => {
		this.setState(prevState => ({
			active: !prevState.active,
		}), () => {
			this.props.onClick();
		});	
	}

	render() {
		const { active } = this.state;
		const buttonClass = active 
			? "flex click model-active"
			: "flex click model-viewer";
		
		const iconClass = active
			? "#77c9d4"
			: "#6a7484";
		
		const textClass = active
			? "p-indent model feather"
			: "p-indent model";
			
		return (
			<div className={buttonClass} onClick={this.handleClick}>
				<div className="p-indent"><IconMono color={iconClass}/></div>
				<h4 className={textClass}>{this.props.title}</h4>
			</div>
		);
	}
}

export default ButtonView;
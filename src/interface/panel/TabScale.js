import React, { Component } from 'react';

class TabScale extends Component {
	constructor(props) {
		super(props);
        this.state = {
			hover: false,
		}
	}

	handleClick = () => { this.props.changeActiveScale(this.props.id); }
    handleHover = () => { this.setState({ hover: !this.state.hover }) }

	render() {
		const isActive = this.props.activeScale === this.props.id;
		const className = isActive ? "active" : "inactive";
        const type = this.props.id;
        const highlight = isActive ? true : this.state.hover ? true : false
		const prefix = highlight ? "w_" : "g_";
		return (
			<li 
				onClick={this.handleClick} 
				className={className} 
				onMouseOver={this.handleHover} 
				onMouseLeave={this.handleHover} >
				<img 
					src={require("../asset/" + prefix + type + ".png").default}
					alt='' 
					className="menu" 
					style= {{cursor:"pointer"}} 
				/>
			</li>
		);
	}
}

export default TabScale
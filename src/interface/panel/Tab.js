import React, { Component } from 'react';

class Tab extends Component {
	constructor() {
		super();
        this.state = {
			hover: false
		}
	}

	handleClick = () => {
		this.props.changeActiveTab(this.props.id);
	}

	handleHover = () => {
        this.setState({
			hover: !this.state.hover
		})
	}

	render() {
		const isActive = this.props.activeTab === this.props.id;
		const className = isActive ? "active" : "inactive";
		const type = this.props.id;
		const highlight = isActive ? true : this.state.hover ? true : false
		const prefix = highlight ? "w_" : "g_";
		return (
			<li onClick={this.handleClick} 
				className={className}  
				onMouseEnter={this.handleHover} 
				onMouseLeave={this.handleHover}>
				<img src={require("../asset/" + prefix + type + ".png").default} 
					 alt='' 
					 className="menu" 
					 style= {{cursor:"pointer"}} />
			</li>
		);
	}
}

export default Tab
import React, { Component } from 'react';
import IconLogo from '../icon/IconLogo.js';

class PanelHeader extends Component {
	render() {
		return (
			<header>
				<div className="flex">
					<IconLogo />
					<img 
						src={require("../asset/adaptive_small_logo.png").default} 
					    alt=''
						className="menu"
						style= {{cursor:"pointer"}} 
					/>	
					<p className="version">{this.props.children}</p>
				</div>
			</header>
		);
	}
}

export default PanelHeader
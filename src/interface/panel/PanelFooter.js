import React, { Component } from 'react';

class PanelFooter extends Component {
	render() {
		return (
			<footer>
			<div className="FooterContent">
			{this.props.children}
			</div>
			</footer>
		);
	}
}

export default PanelFooter
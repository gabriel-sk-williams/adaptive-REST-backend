import React, { Component } from 'react';

class ButtonClear extends Component {

	handleClick = () => {
		this.props.onClick();
	}

	render() {
		return (
			<div onClick={this.handleClick} id={this.props.id} className="flex fthr button">
				<h5 className="center col-12-12">CLEAR</h5>
			</div>
		);
	}
}

export default ButtonClear
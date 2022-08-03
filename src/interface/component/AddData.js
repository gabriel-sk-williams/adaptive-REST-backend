import React, { Component } from 'react';

class AddData extends Component {
	constructor() {
		super();
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick() {
		this.props.onClick();
	}

	render() {
		return (
			<div onClick={this.handleClick} id={this.props.id} className="flex elc button">
				<h5 className="center col-12-12">+ Add Data</h5>
			</div>
		);
	}
}

export default AddData
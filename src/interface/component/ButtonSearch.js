import React, { Component } from 'react';

class ButtonSearch extends Component {

    constructor(props){
		super(props)
		this.state = {
			viewSearch: props.viewSearch
        }
	}

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

export default ButtonSearch
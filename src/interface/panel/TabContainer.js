import React, { Component } from 'react';

class TabContainer extends Component {

	render() {
		return (
			<ul className={this.props.className}>
			{this.props.children}
			</ul>
		);
	}
}

export default TabContainer
import React, { Component } from 'react';
import IconFocus from './icon/IconFocus.js';
import IconView from './icon/IconView.js';

class ViewOptions extends Component {

    toggleView = () => { this.props.toggleView(); }
	focus = () => { this.props.focus(); }

  	render() {
    	return (
            <div className="flex-column view-wrapper">
                <IconView toggleView={this.toggleView} />
                <div className="icon-gap" />
                <IconFocus focused={this.props.focused} focus={this.focus} />
            </div>
    	);
  	}
}

export default ViewOptions;
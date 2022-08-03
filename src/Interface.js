import React, { Component } from 'react';
import Panel from './interface/Panel.js';
import ViewOptions from './interface/ViewOptions.js';

class Interface extends Component {

	componentDidUpdate(prevProps, prevState, snapshot) {
		// console.log(nextProps.selectedObject);
		// you may setState immediately but it must be wrapped in a condition
	}

	// Panel Props
	hlLayer = () => { this.props.hlLayer(); }
	returnDensity = (density) => { this.props.returnDensity(density); }
	returnMenuObj = (menuObj) => { this.props.returnMenuObj(menuObj); }
	returnTab = (newTab) => { this.props.returnTab(newTab); }
	returnScale = (newScale) => { this.props.returnScale(newScale); }
	toggleModel = () => { this.props.toggleModel(); }
	
	// View Options Props
	focus = () => { this.props.focus(); }
	toggleView = () => { this.props.toggleView(); }

  	render() {
    	return (
			<section className="content">
				<Panel
					hlLayer={this.hlLayer}
					returnDensity={this.returnDensity}
					returnMenuObj={this.returnMenuObj}
					returnTab={this.returnTab}
					returnScale={this.returnScale}
					toggleModel={this.toggleModel}

					layer={this.props.layer}
					meta={this.props.meta}
					hovered={this.props.hovered} 
					selected={this.props.selected}
					density={this.props.density}
					expanded={this.props.expanded}
				/>

				<ViewOptions 
					focus={this.focus}
					toggleView={this.toggleView} 	
					focused={this.props.focused} 
				/>
			</section>
    	);
  	}
}

export default Interface;
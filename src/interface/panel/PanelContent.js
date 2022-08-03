import React, { Component } from 'react';
import LayoutModel from './LayoutModel.js';
import LayoutLayers from './LayoutLayers.js';
import LayoutSearch from './LayoutSearch.js';

class PanelContent extends Component {

	returnObj = (menuObj) => { this.props.returnObj(menuObj); }
	returnDensity = (density) => {this.props.returnDensity(density); }
	toggleModel = () => { this.props.toggleModel(); }
	hlLayer = () => { this.props.hlLayer(); }

	render() {
		const containerClass = this.props.expanded ? "PanelCollapsed" : "PanelContent";
		const contentClass = this.props.expanded ? "panel-expanded" : "panel-container"; 
		const model = this.props.activeTab === "Model";
		const layers = this.props.activeTab === "Layers";
		const search = this.props.activeTab === "Search";
		const layout = 	model 
						? <LayoutModel 
							toggleModel={this.toggleModel}
							returnObj={this.returnObj} 
							returnDensity={this.returnDensity}
							density={this.props.density}
						  /> 
						: layers 
						? <LayoutLayers 
							hlLayer={this.hlLayer}
							layer={this.props.layer} 
							returnObj={this.returnObj} 
						  /> 
						: search 
						? <LayoutSearch 
							returnObj={this.returnObj} 
						  /> 
						: null;
		return (
			<div id={this.props.id} className={containerClass} >
				<div className={contentClass}>
					<h1>{this.props.activeTab}</h1>
					{layout}
				</div>
			</div>
		);
	}
}

export default PanelContent
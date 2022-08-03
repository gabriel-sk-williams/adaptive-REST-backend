import React, { Component } from 'react';
import DataEntry from '../component/DataEntry.js';

class LayoutLayers extends Component {

	constructor(props) {
		super(props);
		this.state = {
			layer: props.layer,
		}
	}

	onMouseLeave = () => { } // would like to rewrite layerJSON here

	hlLayer = () => { this.props.hlLayer(); }

	updateHover = (id) => {
		let layer = this.state.layer;
		layer[id].hover = !layer[id].hover;
		
		this.setState({
			layer: layer
		}, () => {
			this.props.returnObj(this.state.layer);
		});	
	}

	updateVisible = (id) => {
		let layer = this.state.layer;
		layer[id].visible = !layer[id].visible;
		
		this.setState({
			layer: layer
		}, () => {
			this.props.returnObj(this.state.layer);
		});	
	}

	render() {
		const layerList = this.props.layer.map(link => {
			return ( 
				<DataEntry	
					id={link.id}
					key={link.id}
					fileName={link.layer} 
					objects={link.objects} 
					visible={link.visible} 
					hover={link.hover}
					hlLayer={this.hlLayer}
					updateHover={this.updateHover}
					updateVisible={this.updateVisible} 
				/>
			);
		});

		return (
			<div 
				id={this.props.id} 
				className=""
				onMouseLeave={this.onMouseLeave}>
				{layerList}		
			</div>
		);
	}
}

export default LayoutLayers
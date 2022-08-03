import React, { Component } from 'react';
import Slider from "@material-ui/core/Slider";
import monocentric from "../../model/Monocentric.js"
import util from "../../util/Util.js"

class SliderConsole extends Component {

	constructor(props) {
		super(props);
		this.state = {
			density: props.density,
		}
	}

	onSliderChange = link => (e, value) => {
		let { density } = this.state;
		let autoval = 
			link === "v0" ? monocentric.calcMain( value, density.g, density.x ) :
			link === "vx" ? monocentric.calcZero( value, density.g, density.x ) :
			link === "g" ? monocentric.calcMain( density.v0, value, density.x ) :
			link === "x" ? monocentric.calcMain( density.v0, density.g, value ) : null;
		
		let contraval = link === "vx" ? "v0" : "vx";

		density[link] = value;
		density[contraval] = autoval;
		this.props.returnDensity(density);
	}

	render() {
		function valuetext(value) { return `${value}`; }
		const sliders = Object.keys(this.props.density).map(link => {
			let step = link === "v0" ? 150
					 : link === "vx" ? 100
					 : link === "g" ? 0.05
					 : link === "x" ? 0.5
					 : null;
			let max = link === "v0" ? 2400
					: link === "vx" ? 1800
					: link === "g" ? 0.9
					: link === "x" ? 8
					: null;

			return (
				<div key={util.makeId(5)} className="test col-3-12">
					<div key={util.makeId(5)} className="small-label">
						<h2 key={util.makeId(5)} className="grey">{link}</h2></div>
					<div key={util.makeId(5)} className="slide-divider" />
					<Slider
						key={link}
						orientation="vertical"
						defaultValue={this.props.density[link]}
						aria-labelledby="vertical-slider"
						getAriaValueText={valuetext}
						valueLabelDisplay="auto"
						step={step}
						marks
						min={0}
						max={max}
						onChangeCommitted={this.onSliderChange(link)}
					/>
				</div> 
			)
		});
			
		return (
			<div className="table flex-right">
				{sliders}
			</div> 
		);
	}
}

export default SliderConsole;
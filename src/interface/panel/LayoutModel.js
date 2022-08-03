import React, { Component } from "react";
import ButtonView from "../component/ButtonView.js";
import ListMenu from "./ListMenu.js";


class LayoutModel extends Component {	

	constructor(props) {
		super(props)
		this.state = {
			active: false,
			menu: [{
				title: "Density",
				mode: [{ 
					title: "Existing", 
					params: [ "Total", "Residential", "Office" ]
				},
				{ 
					title: "Expected",
					params: [ "Total" ]
				},
				{ 
					title: "Distortion", 
					params: props.density
				}]
			},
			{
				title: "Land Value",
				mode: [{ 
					title: "Zoned Capacity", 
					params: false
				}]
			}],
		}
	}

	toggleModel = () => {
		this.setState(prevState => ({
			active: !prevState.active
		}), () => {
			this.props.toggleModel(); 
		})
	}

	returnDensity = (density) => { this.props.returnDensity(density); }

	returnSelect = (indexObj) => {
		let { equation, mode, param } = indexObj;
		let menuObj = this.state.menu[equation];
		let modeObj = menuObj.mode[mode];
		let paramObj = Number.isInteger(param) 
			? modeObj.params[param].toLowerCase() 
			: param;
			
		const returnObj = {
			equation: menuObj.title.toLowerCase(),
			mode: modeObj.title.toLowerCase(),
			param: paramObj
		}

		this.setState({
			active: true
		}, () => {
			this.props.returnObj(returnObj);
		});
	}
	
	render() {
		const { menu, active } = this.state;
		return (
			<div id={this.props.id} className="">
				<ButtonView 
					title={"Monocentric Model"}
					active={active}
					onClick={this.toggleModel} />
				<ListMenu
					menu={menu} 
					returnSelect={this.returnSelect}
					returnDensity={this.returnDensity} 
				/>
			</div>
		);
	}
}

export default LayoutModel
import React, { Component } from 'react';
import PanelHeader from './panel/PanelHeader.js';
import PanelContent from './panel/PanelContent.js';
import SelectedContent from './panel/SelectedContent.js';
import TabContainer from './panel/TabContainer.js';
import TabScale from './panel/TabScale.js';
import Tab from './panel/Tab.js';
import ExpandArrow from './component/ExpandArrow.js';
import './interface.css';

class Panel extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeTab: "Model",
			activeScale: "Region",
			selected: props.selected,
			hovered: props.hovered,
			expanded: props.expanded
		}
	}

	returnObj = (menuObj) => { this.props.returnMenuObj(menuObj); }
	returnDensity = (density) => { this.props.returnDensity(density); }
	toggleModel = () => { this.props.toggleModel(); }
	hlLayer = () => { this.props.hlLayer(); }

	static getDerivedStateFromProps(props, state) {
		if (props.selected !== state.selected) { return { selected: props.selected }; }
		if (props.hovered !== state.hovered) { return { hovered: props.hovered }; }
		return null;
	}

	componentDidUpdate(prevProps) {
		if (prevProps.selected !== this.state.selected) {
			if (this.props.selected) {
				let { scale } = this.props.selected;
				this.setState({ activeScale: scale });
			}
			if (!this.state.hovered && !this.state.selected) {
				this.setState({ activeScale: "Region" });
			}
		}

		if (prevProps.hovered !== this.state.hovered) {
			if (this.props.hovered) {
				let { scale } = this.props.hovered;
				this.setState({ activeScale: scale });
			}
			if (!this.state.hovered && !this.state.selected) {
				this.setState({ activeScale: "Region" });
			}
		}
	}

	changeActiveTab = (tabId) => {
		this.setState({
			activeTab: tabId
		}, () => {
			this.props.returnTab(tabId);
		});
	}

	// needs to overwrite activeScale
	changeActiveScale = (scaleId) => {
		this.setState({
			activeScale: scaleId
		}, () => {
			this.props.returnScale(scaleId);
		});
	}

	handleExpand = () => {
		this.setState(prevState => ({
			expanded: !prevState.expanded
		}));
	}

	render() {
		return (
		  <div className="Panel" >
				<div className="panel-container">
					<PanelHeader>
					v. alpha 2021
					</PanelHeader>
				
					<TabContainer className="tab-container">			
						<Tab 
							id="Model" 
							changeActiveTab={this.changeActiveTab} 
							activeTab={this.state.activeTab} 
						/>
						<Tab 
							id="Layers" 
							changeActiveTab={this.changeActiveTab} 
							activeTab={this.state.activeTab} 
						/>
						<Tab 
							id="Search" 
							changeActiveTab={this.changeActiveTab} 
							activeTab={this.state.activeTab}
						/>
					</TabContainer>
				</div>

				<PanelContent 	
					expanded={this.state.expanded}
					activeTab={this.state.activeTab}
					returnDensity={this.returnDensity}
					returnObj={this.returnObj}
					toggleModel={this.toggleModel}
					hlLayer={this.hlLayer}

					layer={this.props.layer} 
					density={this.props.density}
				/>

				<TabContainer className="tab-container dark">			
					<TabScale
						id="Region" 
						changeActiveScale={this.changeActiveScale} 
						activeScale={this.state.activeScale} 
					/>
					<TabScale
						id="Block" 
						changeActiveScale={this.changeActiveScale} 
						activeScale={this.state.activeScale} 
					/>
					<TabScale
						id="Lot" 
						changeActiveScale={this.changeActiveScale}
						activeScale={this.state.activeScale} 
					/>
					<ExpandArrow
						onClick={this.handleExpand}
						expanded={this.state.expanded} 
					/>
				</TabContainer>

				<div className="panel-container">
					<SelectedContent 
						meta={this.props.meta}
						expanded={this.state.expanded}
						hovered={this.props.hovered}
						selected={this.props.selected}
						activeScale={this.state.activeScale}
					/>
				</div>
		  </div>
		);
	}
}

export default Panel;

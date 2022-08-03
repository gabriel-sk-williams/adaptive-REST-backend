import React, { Component } from 'react';
import IconArrow from '../icon/IconArrow.js';
import OutsideClick from './OutsideClick.js';

class DropMenu extends Component {
	constructor(props) {
		super(props);
		this.state = {
			listOpen: false,
			headerTitle: this.props.title
		}
	}

	static getDerivedStateFromProps(newProps) {
		return {headerTitle: newProps.title}
	}

	collapseList = () => {
		this.setState({
			listOpen: false
		})
	}

	handleSelection = (id, key) => {
		this.collapseList();
		this.props.toggleItem(id, key);
	}

	toggleList = () => {
		this.setState(prevState => ({
		  listOpen: !prevState.listOpen
		}))
	}

	remainingList = (obj) => {
		return obj.filter((item) => item.selected === false);
	}
	
	render() {
		let { listOpen, headerTitle } = this.state;
		const list = this.remainingList(this.props.list);
		const major = this.props.id === "major";
		return (
			<OutsideClick proc={this.collapseList}>
				<div id={this.props.id} className="drop-down">
					<div className="full flex click" onClick={() => this.toggleList()}>
						{major &&
						<div className="p-indent">
							{this.props.children}
						</div>}
						<h4 className="drop feather left p-indent col-12-12">{headerTitle}</h4>
						<div className="col-arrow">
							{listOpen ? 
								<IconArrow type="up" /> :
								<IconArrow type="down" />
							}
						</div>
					</div>

					{listOpen && 
					<ul className="dd-list">
						{list.map((item) => (
						<li className="dd-list-item p-indent"
							key={item.title} 
							onClick={() => this.handleSelection(item.id, item.key)}>{item.title}
						</li>
						))}
					</ul>}
				</div>
			</OutsideClick>
		);
	}
}

export default DropMenu
import React, { Component } from 'react';
import DropMenu from '../component/DropMenu.js';
import FieldString from '../component/FieldString.js';

class LayoutSearch extends Component {

	constructor(props){
		super(props)
		this.state = {
			query: props.query || '',
			search: [{
						id: 0,
						title: 'Keyword',
						type: 'lemma',
						selected: true,
						key: 'search'
					},
					{
						id: 1,
						title: 'Address',
						type: 'address',
						selected: false,
						key: 'search'
					},
					{
						id: 2,
						title: 'Name',
						type: 'name',
						selected: false,
						key: 'search'
					}]
		}
	}

	onClear = () => {
		console.log("onClear");
		this.setState({
			query: '',
		}, () => {
			this.props.returnObj(this.getAllSelected());
		});
	}

	onFieldChange = (title, value) => {
		this.setState({
			query: value
		}, () => {
			this.props.returnObj(this.getAllSelected());
		});
	}

	toggleSelected = (id, key) => { // number, "search"

		const select = (id, obj) => {
			return Object.assign({}, obj, {selected: obj.id === id})
		}

		let menuObj = this.state[key].map((item) => select(id, item));
		
		this.setState({
		  	[key]: menuObj
		}, () => {
			this.props.returnObj(this.getAllSelected());
		});
	}

	getSelectedTitle = (obj) => { return obj.filter(item => item.selected)[0].title; }
	getSelectedType = (obj) => { return obj.filter(item => item.selected)[0].type; }
	getAllSelected = () => {
		let { query, search } = this.state;
		let view = !!query ? true : false;
		let type = this.getSelectedType(search);
		
		return {
			view: view,
			type: type,
			query: query
		}
	}

	render() {
		const { query, search } = this.state;
		let searchTitle = this.getSelectedTitle(search);
		return (
			<div id={this.props.id} className="">
				<DropMenu 
					id="minor" 
					title={searchTitle} 
					list={search} 
					toggleItem={this.toggleSelected}
				/>
				<FieldString
					id={searchTitle}
					value={query}
					placeholder="Search Query"
					onChange={this.onFieldChange}
					onClear={this.onClear}
				/>
			</div>
		);
	}
}

export default LayoutSearch
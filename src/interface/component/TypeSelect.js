import React, { Component } from 'react';
import PropTypes from 'prop-types';

class TypeSelect extends Component {
	constructor(props) {
		super(props);
		this.state = {
            id: props.id,
            title: props.title,
            selected: props.selected,
		}
    }

    static propTypes = {
        id: PropTypes.number,
        key: PropTypes.string,
        title: PropTypes.string,
        selected: PropTypes.bool
    };

    static getDerivedStateFromProps(props, state) {
		if (props.selected !== state.selected) return { selected: props.selected };
        if (props.title !== state.title) return { title: props.title };
        return null;
	}

    handleClick = (id, key) => { 
        this.setState({
            selected: true,
        }, ()=> {
            this.props.updateSelected(id, key); 
        });
    }

	render() {
        const { id, type, title, selected } = this.state;
        const squareClass = selected ? "type-square-active" : "type-square-inactive";
        const square = <div className={squareClass} />
        const textClass = selected ? "feather adjust" : "adjust";
		return (
            <div id={id} className="type-select">
                <div className="flex table" onClick={ () => this.handleClick(id, type) }>
                    <div className="cell flex-column col-1-12">
                        <div className="cell middle">{square}</div>
                    </div>
                    <div className="cell flex-column col-6-12">
                        <div className="cell middle">
                            <h3 className={textClass}>{title}</h3>
                        </div>
                    </div>
                </div>
            </div>
		);
	}
}

export default TypeSelect;
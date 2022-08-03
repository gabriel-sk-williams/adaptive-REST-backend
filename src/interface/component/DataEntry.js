import React, { Component } from 'react';
import PropTypes from 'prop-types';

class DataEntry extends Component {
	constructor(props) {
		super(props);
		this.state = {
            hover: props.hover,
            id: props.id,
            fileName: props.fileName,
            objects: props.objects,
            visible: props.visible,
		}
    }
    
    static propTypes = {
        hover: PropTypes.bool,
        id: PropTypes.number,
        fileName: PropTypes.string,
        objects: PropTypes.string,
        visible: PropTypes.bool
    };

    dataSquare = (visible) => {
        let type = visible ? "data-active" : "data-inactive";
        return ( <div className={type} /> );
    }

    handleClick = (id) => {
        this.setState( prevState => ({
			visible: !prevState.visible
        }), () => {
            this.props.updateVisible(id);
        });
	}

    handleHover = (id) => {
        this.setState( prevState => ({
		    hover: !prevState.hover
        }), () => {
            this.props.updateHover(id);
        });
	}

	render() {
        let { id, fileName, objects, visible } = this.state;
        let square = this.dataSquare(visible);
		return (
            <div id={id} className="data-entry">
                <div 
                    className="flex table"
                    onMouseEnter={ () => this.handleHover(this.props.id) } 
                    onMouseLeave={ () => this.handleHover(this.props.id) }
                    onClick={ () => this.handleClick(this.props.id) }
                >
                    <div className="cell flex-column col-1-12">
                        <div className="cell">{square}</div>
                        <div className="cell"><div className="fill-square"></div></div>
                    </div>
                    <div className="cell flex-column col-11-12">
                        <div className="cell top"><h3 className="lg">{fileName}</h3></div>
                        <div className="cell bottom"><h3>{objects} objects</h3></div>
                    </div>
                </div>
            </div>
		);
	}
}

export default DataEntry
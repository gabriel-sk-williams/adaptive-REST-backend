import React, { Component } from "react";
import TypeSelect from "../component/TypeSelect.js";
import SliderConsole from "../component/SliderConsole.js";

class ListParams extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeParam: props.activeParam || 0,
            params: props.params
        }
    }

    static getDerivedStateFromProps(props, state) {
		if (props.params !== state.params) return {
            activeParam: props.activeParam || 0,
            params: props.params 
        };
        return null;
	}

    paramSelect = (id) => {
        this.setState({ 
            activeParam: id 
        }, ()=> {
            this.props.returnSelect({param: id})
        });
    }

    returnDensity = (density) => {
        this.setState({ 
            params: density
        }, ()=> {
            this.props.returnDensity(density)
        });
    }

    list = (array) => {
		return (
            array.map((item, index) => {
            const selected = index === this.state.activeParam;
                return (
                    <li key={item}>
                        <TypeSelect
                            id={index}
                            title={item}
                            selected={selected}
                            updateSelected={this.paramSelect}
                        />
                    </li>
                );
            })
        );
	}

    render() {
        const { params } = this.state;
        const paramList = params instanceof Array
            ? this.list(params)
            : params instanceof Object
            ? <SliderConsole density={params} returnDensity={this.returnDensity} />
            : null;

        return (
            <div>
                <div className="label"><h2>Parameters</h2></div>
                <div className="m-indent">{paramList}</div>
            </div>
        );
    }
}

export default ListParams;
import React, { Component } from "react";
import TypeSelect from "../component/TypeSelect.js";
import ListParams from "./ListParams.js";


class ListMode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeMode: props.activeMode || 0,
            mode: props.mode
        }
    }

    static getDerivedStateFromProps(props, state) {
		if (props.mode !== state.mode) return {
            activeMode: props.activeMode || 0,
            mode: props.mode
        };
        return null;
	}

    // you have a list of modes, you chose a new one from the list
    modeSelect = (id) => {
        this.setState({ 
            activeMode: id
        }, () => {
            this.state.mode[id].params instanceof Array
                ? this.returnSelect({param: 0})
                : this.returnSelect({param: false})
        });
    }

    returnSelect = (obj) => {
        let modeObj = { ...obj, mode: this.state.activeMode }
        this.props.returnSelect(modeObj);
    }

    returnDensity = (density) => {
        this.props.returnDensity(density);
    }

    list = (array) => {
		return (
            array.map((item, index) => {
            const selected = index === this.state.activeMode;
                return (
                    <li key={item.title}>
                        <TypeSelect
                            id={index}
                            title={item.title}
                            selected={selected}
                            updateSelected={this.modeSelect}
                        />
                    </li>
                );
            })
        );
	}

    render() {
        const { mode, activeMode } = this.state;
        const modeList = this.list(mode);
        const params = mode[activeMode].params;
        return(
            <div>
                <div className="label"><h2>Mode</h2></div>
                <div className="m-indent">{modeList}</div>
                <ListParams 
                    params={params} 
                    returnSelect={this.returnSelect}
                    returnDensity={this.returnDensity}
                />
            </div>
        );
    }
}

export default ListMode;
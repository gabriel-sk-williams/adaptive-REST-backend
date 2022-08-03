import React, { Component } from "react";
import TypeSelect from "../component/TypeSelect.js";
import ListMode from "./ListMode.js";

class ListMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeEquation: props.activeEquation || 0,
            menu: props.menu
        }
    }
    
    static getDerivedStateFromProps(props, state) {
		if (props.menu !== state.menu) return { menu: props.menu };
        return null;
	}

    getDefaultObj = (aeq) => {
        let { menu } = this.state;
        let equation = menu[aeq];
        return (
            equation.mode[0].params instanceof Array
            ? { mode: 0, param: 0 }
            : { mode: 0, param: false }
        );
    }

    eqSelect = (id) => {
        this.setState({ 
            activeEquation: id 
        }, () => {
            this.returnSelect(this.getDefaultObj(id))
        });
    }

    returnSelect = (obj) => {
        let menuObj = { ...obj, equation: this.state.activeEquation }
        this.props.returnSelect(menuObj);
    }

    returnDensity = (density) => {
        this.props.returnDensity(density);
    }

    list = (array) => {
		return (
            array.map((item, index) => {
            const selected = index === this.state.activeEquation;
                return (
                    <li key={item.title}>
                        <TypeSelect
                            id={index}
                            title={item.title}
                            selected={selected}
                            updateSelected={this.eqSelect}
                        />
                    </li>
                );
            })
        );
	}

    render() {
        const { menu, activeEquation } = this.state;
        const menuList = this.list(menu);
        const mode = menu[activeEquation].mode;
        return(
            <div>
                <div className="label"><h2>Equation</h2></div>
                <div className="m-indent">{menuList}</div>
                <ListMode
                    mode={mode}
                    returnSelect={this.returnSelect}
                    returnDensity={this.returnDensity}
                />
            </div>
        );
    }
}

export default ListMenu;
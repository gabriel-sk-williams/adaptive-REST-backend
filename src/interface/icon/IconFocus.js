import React, { Component } from 'react';
import '../interface.css';

class IconFocus extends Component {

    constructor(){
        super();
        this.state = {
            highlight: false,
            focused: false
        }
    }

    static getDerivedStateFromProps(props) {
        return { focused: props.focused };
	}

    mouseOver = () => { this.setState({highlight: true}) }
    mouseOut = () => { this.setState({highlight: false}) }

    circle = () => {
        const grey = this.state.highlight || this.state.focused ? "#a0a7b4" : "#6a7484";
        return grey;
    }

    focus = () => {
        this.setState(prevState => ({
            focused: !prevState.focused,
        }));
        
        this.props.focus();
    }

    render() {
        const lightgrey = "#d3d8e0";
	    return (
            <svg width="54" height="54" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" 
            styles={{fillRule:'evenodd', clipRule:'evenodd', strokeLineCap:'square', strokeLineJoin:'round', strokeMiterLimit:1}}>
                <g  onMouseOver={this.mouseOver}
                    onMouseOut={this.mouseOut}
                    onClick={this.focus}
                    className="click">
                    <path d="M234.795,234L234.795,416.087L262.697,416.087L262.697,262.108L416.676,262.108L416.676,234L234.795,234Z" 
                    style={{fill:lightgrey, fillRule:'nonzero'}} />
                    <path d="M584.708,234L584.708,262.108L738.687,262.108L738.687,416.087L766.795,416.087L766.795,234L584.708,234Z" 
                    style={{fill:lightgrey, fillRule:'nonzero'}} />
                    <path d="M738.687,584.12L738.687,738.098L584.708,738.098L584.708,766L766.795,766L766.795,584.12L738.687,584.12Z" 
                    style={{fill:lightgrey, fillRule:'nonzero'}} />
                    <path d="M234.795,584.12L234.795,766L416.676,766L416.676,738.098L262.697,738.098L262.697,584.12L234.795,584.12Z" 
                    style={{fill:lightgrey, fillRule:'nonzero'}} />
                    <path d="M318.708,318.12L318.708,500L346.817,500L346.817,346.021L500.795,346.021L500.795,318.12L318.708,318.12Z" 
                    style={{fill:lightgrey, fillRule:'nonzero'}} />
                    <path d="M500.795,318.12L500.795,346.021L654.774,346.021L654.774,500L682.676,500L682.676,318.12L500.795,318.12Z" 
                    style={{fill:lightgrey, fillRule:'nonzero'}} />
                    <path d="M318.708,500L318.708,682.087L500.795,682.087L500.795,653.979L346.817,653.979L346.817,500L318.708,500Z" 
                    style={{fill:lightgrey, fillRule:'nonzero'}} />
                    <path d="M654.774,500L654.774,653.979L500.795,653.979L500.795,682.087L682.676,682.087L682.676,500L654.774,500Z" 
                    style={{fill:lightgrey, fillRule:'nonzero'}} />
                    <circle cx="500" cy="500" r="500" 
                    style={{fill:this.circle(), fillRule:'nonzero'}}/>
                    <path d="M226.868,234.303L226.868,416.182L255.328,416.182L255.328,262.379L412.384,262.379L412.384,234.303L226.868,234.303Z" 
                    style={{fill:lightgrey, fillRule:'nonzero'}} />
                    <path d="M583.775,234.303L583.775,262.379L740.83,262.379L740.83,416.182L769.501,416.182L769.501,234.303L583.775,234.303Z" 
                    style={{fill:lightgrey, fillRule:'nonzero'}} />
                    <path d="M740.83,584.024L740.83,737.827L583.775,737.827L583.775,765.697L769.501,765.697L769.501,584.024L740.83,584.024Z" 
                    style={{fill:lightgrey, fillRule:'nonzero'}} />
                    <path d="M226.868,584.024L226.868,765.697L412.384,765.697L412.384,737.827L255.328,737.827L255.328,584.024L226.868,584.024Z" 
                    style={{fill:lightgrey, fillRule:'nonzero'}} />
                    <path d="M312.458,318.327L312.458,500L341.129,500L341.129,346.197L498.185,346.197L498.185,318.327L312.458,318.327Z" 
                    style={{fill:lightgrey, fillRule:'nonzero'}} />
                    <path d="M498.185,318.327L498.185,346.197L655.24,346.197L655.24,500L683.7,500L683.7,318.327L498.185,318.327Z" 
                    style={{fill:lightgrey, fillRule:'nonzero'}} />
                    <path d="M312.458,500L312.458,681.879L498.185,681.879L498.185,653.803L341.129,653.803L341.129,500L312.458,500Z" 
                    style={{fill:lightgrey, fillRule:'nonzero'}} />
                    <path d="M655.24,500L655.24,653.803L498.185,653.803L498.185,681.879L683.7,681.879L683.7,500L655.24,500Z" 
                    style={{fill:lightgrey, fillRule:'nonzero'}} />
                </g>
            </svg>
	    );
    }
}

export default IconFocus;
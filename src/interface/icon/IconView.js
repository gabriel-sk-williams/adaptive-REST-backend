import React, { Component } from 'react';
import '../interface.css';

class IconView extends Component {

    constructor(){
        super();
        this.state = {
            highlight: false,
            polyView: true
        }
    }

    mouseOver = () => { this.setState({highlight: true}); }
    mouseOut = () => { this.setState({highlight: false}); }

    circle = () => {
        const grey = this.state.highlight ? "#a0a7b4" : "#6a7484";
        return grey;
    }

    toggleView = () => {
        this.setState(prevState => ({
            polyView: !prevState.polyView,
        }));
        this.props.toggleView();
    }

    render() {
        const lightgrey = "#d3d8e0";
	    return (
            <svg width="54" height="54" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" 
            styles={{fillRule:'evenodd', clipRule:'evenodd', strokeLineCap:'square', strokeLineJoin:'round', strokeMiterLimit:1}}>
            <g  onMouseOver={this.mouseOver}
                onMouseOut={this.mouseOut}
                onClick={this.toggleView}
                className="click">
                <path d="M234.795,234L234.795,416.087L262.697,416.087L262.697,262.108L416.676,262.108L416.676,234L234.795,234Z" 
                style={{fill:lightgrey, fillRule:'nonzero'}}/>
                <path d="M584.708,234L584.708,262.108L738.687,262.108L738.687,416.087L766.795,416.087L766.795,234L584.708,234Z" 
                style={{fill:lightgrey, fillRule:'nonzero'}}/>
                <path d="M738.687,584.12L738.687,738.098L584.708,738.098L584.708,766L766.795,766L766.795,584.12L738.687,584.12Z" 
                style={{fill:lightgrey, fillRule:'nonzero'}}/>
                <path d="M234.795,584.12L234.795,766L416.676,766L416.676,738.098L262.697,738.098L262.697,584.12L234.795,584.12Z" 
                style={{fill:lightgrey, fillRule:'nonzero'}}/>
                <path d="M318.708,318.12L318.708,500L346.817,500L346.817,346.021L500.795,346.021L500.795,318.12L318.708,318.12Z" 
                style={{fill:lightgrey, fillRule:'nonzero'}}/>
                <path d="M500.795,318.12L500.795,346.021L654.774,346.021L654.774,500L682.676,500L682.676,318.12L500.795,318.12Z" 
                style={{fill:lightgrey, fillRule:'nonzero'}}/>
                <path d="M318.708,500L318.708,682.087L500.795,682.087L500.795,653.979L346.817,653.979L346.817,500L318.708,500Z" 
                style={{fill:lightgrey, fillRule:'nonzero'}}/>
                <path d="M654.774,500L654.774,653.979L500.795,653.979L500.795,682.087L682.676,682.087L682.676,500L654.774,500Z" 
                style={{fill:lightgrey, fillRule:'nonzero'}}/>
                <circle cx="500" cy="500" r="500" 
                style={{fill:this.circle(), fillRule:'nonzero'}} />
                <path d="M100.662,100.661L100.662,102.381L100.926,102.381L100.926,100.926L102.381,100.926L102.381,100.661L100.662,100.661Z" 
                style={{fill:lightgrey, fillRule:'nonzero'}}/>
                <path d="M103.969,100.661L103.969,100.926L105.424,100.926L105.424,102.381L105.689,102.381L105.689,100.661L103.969,100.661Z" 
                style={{fill:lightgrey, fillRule:'nonzero'}}/>
                <path d="M105.424,103.969L105.424,105.424L103.969,105.424L103.969,105.688L105.689,105.688L105.689,103.969L105.424,103.969Z" 
                style={{fill:lightgrey, fillRule:'nonzero'}}/>
                <path d="M100.662,103.969L100.662,105.688L102.381,105.688L102.381,105.424L100.926,105.424L100.926,103.969L100.662,103.969Z" 
                style={{fill:lightgrey, fillRule:'nonzero'}}/>
                <path d="M101.455,101.455L101.455,103.174L101.721,103.174L101.721,101.719L103.176,101.719L103.176,101.455L101.455,101.455Z" 
                style={{fill:lightgrey, fillRule:'nonzero'}}/>
                <path d="M103.176,101.455L103.176,101.719L104.631,101.719L104.631,103.174L104.895,103.174L104.895,101.455L103.176,101.455Z" 
                style={{fill:lightgrey, fillRule:'nonzero'}}/>
                <path d="M101.455,103.174L101.455,104.895L103.176,104.895L103.176,104.629L101.721,104.629L101.721,103.174L101.455,103.174Z" 
                style={{fill:lightgrey, fillRule:'nonzero'}}/>
                <path d="M104.631,103.174L104.631,104.629L103.176,104.629L103.176,104.895L104.895,104.895L104.895,103.174L104.631,103.174Z" 
                style={{fill:lightgrey, fillRule:'nonzero'}}/>
                <path d="M499.802,766.974L727.17,673.481L499.802,580.207L272.434,673.481L499.802,766.974L499.802,766.974ZM745.606,650.875L745.606,334.184L513.848,238.936L513.848,555.626L745.606,650.875ZM253.999,650.875L485.756,555.626L485.756,238.936L253.999,334.184L253.999,650.875Z" 
                style={{fill:lightgrey, fillRule:'nonzero'}}/>
            </g>
            </svg>
	    );
    }
}

export default IconView;
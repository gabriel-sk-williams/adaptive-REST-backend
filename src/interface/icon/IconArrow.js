import React, { Component } from 'react';

class IconArrow extends Component {

    render() {
        const color = "#77c9d4";
        const up = this.props.type === "up";
        const left = this.props.type === "left";
        const right = this.props.type === "right";
        const degree = up ? '180' : left ? '90' : right ? '270' : '0';
        const transform = 'rotate(' + degree + ')';
	    return (
            <svg 
                width="15" 
                height="9" 
                viewBox="0 0 668 375" 
                transform={transform} 
                xmlns="http://www.w3.org/2000/svg" 
                styles={{
                    fillRule:'evenodd', clipRule:'evenodd', strokeLineCap:'square', strokeLineJoin:'round', strokeMiterLimit:1
                }}>
                <g>
                    <path d="M363,363L656,71C672,54 672,28 656,12C640,-4 613,-4 597,12L334,275L71,12C54,-4 28,-4 12,12C-4,28 -4,54 12,71L304,363C321,379 347,379 363,363Z"
                          style={{fill:color, stroke:color, strokeWidth:'2.5px'}}
                    />
                </g>                
            </svg>        
	    );
    }
}

export default IconArrow;
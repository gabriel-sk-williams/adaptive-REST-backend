import React, { Component } from 'react';

class IconLogo extends Component {
    //svg for export
    //selection without background
    //flatten transforms

    render() {
        const color = "#77c9d4";
	    return (
            <svg width="50" height="50" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" 
            styles={{fillRule:'evenodd', clipRule:'evenodd', strokeLineCap:'square', strokeLineJoin:'round', strokeMiterLimit:1}}>
                    
                <g id="skyline">
                <path 
                    d="M5.888,96.561L17,81L29,81L29,72L34,63L46,63L46,52L61,43L73,43L88,52L88,64L97,64L97,58L126,58L126,74L142,74L155,97L154.781,108.417C158.139,99.584 159.997,90.01 159.997,79.996C159.997,35.816 124.179,0 80,0C35.82,0 0,35.816 0,79.996C0,90.656 2.103,100.819 5.888,110.118L5.888,96.561Z"
                    style={{fill:color, fillRule:'nonzero'}} />
                </g>            
            </svg>        
	    );
    }
}

export default IconLogo;
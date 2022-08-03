import React, { Component } from 'react';

class IconEnvelope extends Component {

    render() {
        const color = "#77c9d4";
	    return (
            <svg width="30" height="30" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" 
                 styles={{fillRule:'evenodd', clipRule:'evenodd', strokeLineCap:'square', strokeLineJoin:'round', strokeMiterLimit:1}}>
                <path d="M80.881,45.779L75.754,45.779L75.754,8.519L63.734,8.519L63.734,2.155L36.266,2.155L36.266,8.519L24.247,8.519L24.247,45.779L19.119,45.779L19.119,94.536L10.63,94.536L10.63,96.892L89.37,96.892L89.37,94.536L80.881,94.536L80.881,45.779Z"
                style={{fill:color, stroke:color, fillRule:'nonzero'}} />
            </svg>        
	    );
    }
}

export default IconEnvelope;
import React, { Component } from 'react';

class IconRELU extends Component {

    render() {
        const color = "#77c9d4";
	    return (
            <svg width="30" height="30" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" 
            styles={{fillRule:'evenodd', clipRule:'evenodd', strokeLineCap:'square', strokeLineJoin:'round', strokeMiterLimit:1}}>
                <g>
                <path d="M95,45.946L59.398,45.946C57.821,42.316 54.204,39.77 50,39.77C48.67,39.77 47.402,40.033 46.234,40.496L35.341,29.602C31.939,26.201 27.416,24.327 22.605,24.327L5,24.327L5,32.461L22.605,32.461C25.243,32.461 27.724,33.489 29.589,35.354L40.181,45.946L5,45.946L5,54.08L40.603,54.08C42.18,57.71 45.797,60.257 50,60.257C51.33,60.257 52.598,59.995 53.766,59.531L64.66,70.426C68.063,73.827 72.586,75.7 77.395,75.7L95,75.7L95,67.566L77.395,67.566C74.758,67.566 72.277,66.538 70.411,64.674L59.817,54.08L95,54.08L95,45.946ZM42.661,50.013C42.661,45.967 45.954,42.675 50,42.675C54.047,42.675 57.34,45.967 57.34,50.013C57.34,54.06 54.047,57.353 50,57.353C45.954,57.353 42.661,54.06 42.661,50.013Z"
                          style={{fill:color, stroke:color, strokeWidth:'2.5px', fillRule:'nonzero'}}
                    />
                </g>                
            </svg>        
	    );
    }
}

export default IconRELU;
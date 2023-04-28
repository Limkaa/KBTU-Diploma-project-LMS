import React from 'react';

const TimeLineSvg = (props) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            fill="none"
            {...props}
        >
            <path
                stroke={props.color}
                strokeLinecap="round"
                strokeWidth={3}
                d="M5.45 13.926h16.1c2.3 0 3.45-1.193 3.45-3.578v-4.77C25 3.193 23.85 2 21.55 2H5.45C3.15 2 2 3.193 2 5.578v4.77c0 2.385 1.15 3.578 3.45 3.578ZM20.4 2v5.963M6.6 2v4.77M11.257 2 11.2 7.963M15.8 2v3.578"
            />
        </svg>
    );
};

export default TimeLineSvg;
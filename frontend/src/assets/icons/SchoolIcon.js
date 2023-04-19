import React from 'react';

const SchoolSvg = (props) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            fill="none"
            {...props}
        >
            <path
                stroke={props.color}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit={10}
                strokeWidth={3}
                d="M2 11c0-2 1-3 3-3h5v11c0 2 1 3 3 3H5c-2 0-3-1-3-3v-4M10.11 4c-.08.3-.11.63-.11 1v3H5V6c0-1.1.9-2 2-2h3.11ZM14 8v5M18 8v5M17 17h-2c-.55 0-1 .45-1 1v4h4v-4c0-.55-.45-1-1-1ZM6 13v4"
            />
            <path
                stroke={props.color}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit={10}
                strokeWidth={3}
                d="M10 19V5c0-2 1-3 3-3h6c2 0 3 1 3 3v14c0 2-1 3-3 3h-6c-2 0-3-1-3-3Z"
            />
        </svg>
    );
};

export default SchoolSvg;
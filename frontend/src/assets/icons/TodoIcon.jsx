import React from 'react';

const TodoSvg = (props) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={27}
            height={27}
            fill="none"
            {...props}
        >
            <path
                stroke={props.color}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M10.357 24.57h6.9c5.75 0 8.05-2.3 8.05-8.05v-6.9c0-5.75-2.3-8.05-8.05-8.05h-6.9c-5.75 0-8.05 2.3-8.05 8.05v6.9c0 5.75 2.3 8.05 8.05 8.05Z"
            />
            <path
                stroke={props.color}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="m8.919 13.07 3.254 3.254 6.52-6.51"
            />
        </svg>
    );
};

export default TodoSvg;
import React from 'react';

const GroupSvg = (props) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={25}
            height={25}
            fill="none"
            {...props}
        >
            <path
                stroke={props.color}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M18.947 22.6c-.924.274-2.016.4-3.297.4h-6.3c-1.281 0-2.373-.126-3.297-.4.23-2.73 3.034-4.882 6.447-4.882 3.412 0 6.216 2.153 6.447 4.883Z"
            />
            <path
                stroke={props.color}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M15.65 2h-6.3C4.1 2 2 4.1 2 9.35v6.3c0 3.969 1.197 6.143 4.053 6.951.231-2.73 3.035-4.883 6.447-4.883s6.216 2.153 6.447 4.883C21.803 21.793 23 19.619 23 15.65v-6.3C23 4.1 20.9 2 15.65 2ZM12.5 14.778a3.764 3.764 0 0 1-3.759-3.769A3.755 3.755 0 0 1 12.5 7.25a3.755 3.755 0 0 1 3.759 3.759c0 2.079-1.68 3.77-3.759 3.77Z"
            />
            <path
                stroke={props.color}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M16.259 11.01c0 2.078-1.68 3.769-3.76 3.769a3.764 3.764 0 0 1-3.758-3.77A3.755 3.755 0 0 1 12.5 7.25a3.755 3.755 0 0 1 3.759 3.76Z"
            />
        </svg>
    );
};

export default GroupSvg;
import React from 'react';

const StudentSvg = (props) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={23}
            height={23}
            fill="none"
            {...props}
        >
            <path
                fill={props.color}
                d="M17.419 15.686c.819-.506 1.894.046 1.894.965v1.483c0 1.46-1.21 3.024-2.665 3.484l-3.9 1.218c-.684.219-1.796.219-2.468 0l-3.9-1.218c-1.467-.46-2.665-2.024-2.665-3.484V16.64c0-.908 1.076-1.46 1.883-.966l2.518 1.54c.966.61 2.188.909 3.41.909 1.223 0 2.445-.3 3.411-.908l2.482-1.53Z"
            />
            <path
                fill={props.color}
                d="M21.267 5.13 13.945.612c-1.32-.816-3.496-.816-4.817 0L1.77 5.13c-2.359 1.437-2.359 4.69 0 6.14l1.956 1.195 5.403 3.31c1.32.817 3.497.817 4.817 0l5.366-3.31 1.675-1.035v3.518c0 .471.416.862.917.862.501 0 .917-.39.917-.862V9.292c.489-1.483-.013-3.208-1.553-4.162Z"
            />
        </svg>
    );
};

export default StudentSvg;
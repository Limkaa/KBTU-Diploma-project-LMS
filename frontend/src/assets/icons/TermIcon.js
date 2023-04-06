import * as React from "react";

const TermSvg = (props) => (
  <svg
    width={24}
    height={26}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M22 7.556v11.11c0 3.334-1.667 5.556-5.556 5.556H7.556C3.666 24.222 2 22 2 18.667V7.556C2 4.222 3.667 2 7.556 2h8.888C20.334 2 22 4.222 22 7.556Z"
      stroke={props.color}
      strokeWidth={3}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15.889 2v8.733a.558.558 0 0 1-.933.411l-2.578-2.377a.55.55 0 0 0-.756 0l-2.577 2.377a.558.558 0 0 1-.934-.41V2h7.778ZM13.389 15.333h4.722M8.667 19.778h9.444"
      stroke={props.color}
      strokeWidth={3}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default TermSvg;

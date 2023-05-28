import * as React from "react";
const PlusSvg = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={15}
    height={15}
    fill="none"
    {...props}
  >
    <path
      fill={props.color}
      d="M14.167 8.333H.833A.84.84 0 0 1 0 7.5a.84.84 0 0 1 .833-.833h13.334A.84.84 0 0 1 15 7.5a.84.84 0 0 1-.833.833Z"
    />
    <path
      fill={props.color}
      d="M7.5 15a.84.84 0 0 1-.833-.833V.833A.84.84 0 0 1 7.5 0a.84.84 0 0 1 .833.833v13.334A.84.84 0 0 1 7.5 15Z"
    />
  </svg>
);
export default PlusSvg;

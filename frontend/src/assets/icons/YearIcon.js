import React from "react";

const YearSvg = ({ props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="27"
      height="30"
      fill="none"
      viewBox="0 0 27 30"
      {...props}
    >
      <path
        stroke={props.fill}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit="10"
        strokeWidth="3"
        d="M8.389 2v3.833M18.611 2v3.833M2.639 11.06H24.36M25 10.306v10.86c0 3.834-1.917 6.39-6.389 6.39H8.39C3.917 27.556 2 25 2 21.166v-10.86c0-3.834 1.917-6.39 6.389-6.39H18.61c4.472 0 6.389 2.556 6.389 6.39z"
      ></path>
      <path
        stroke={props.fill}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
        d="M18.22 16.95h.012M18.22 20.783h.012M13.494 16.95h.012M13.494 20.783h.012M8.765 16.95h.011M8.765 20.783h.011"
      ></path>
    </svg>
  );
};

export default YearSvg;

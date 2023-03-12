import * as React from "react";

const AssignmentsSvg = (props) => (
  <svg
    width={27}
    height={27}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    fillOpacity={0}
    {...props}
  >
    <path
      d="M13.925 9.912h6.038M7.037 9.912l.862.862 2.588-2.587M13.925 17.962h6.038M7.037 17.962l.862.862 2.588-2.587"
      stroke={props.fill}
      strokeWidth={3.446}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.05 25h6.9C22.7 25 25 22.7 25 16.95v-6.9C25 4.3 22.7 2 16.95 2h-6.9C4.3 2 2 4.3 2 10.05v6.9C2 22.7 4.3 25 10.05 25Z"
      stroke={props.fill}
      strokeWidth={3.446}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default AssignmentsSvg;

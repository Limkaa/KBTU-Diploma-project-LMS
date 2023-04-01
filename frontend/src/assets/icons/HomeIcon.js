import * as React from "react";

const HomeSvg = (props) => (
  <svg
    width={26}
    height={26}
    fill={props.fill}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="m13.86 4.783 10.5 10.5v7.362a2.625 2.625 0 0 1-2.625 2.625H5.985a2.625 2.625 0 0 1-2.625-2.625v-7.362l10.5-10.5Zm8.75-1.388V9.52l-3.5-3.5V3.395a.875.875 0 0 1 .875-.875h1.75a.875.875 0 0 1 .875.875Z"
      // fill="#163A61"
      fill={props.fill}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.763 2.625a1.75 1.75 0 0 1 2.474 0l11.632 11.63a.876.876 0 1 1-1.239 1.24L14 3.862 2.37 15.495a.876.876 0 0 1-1.24-1.24l11.633-11.63Z"
      // fill="#163A61"
      fill={props.fill}
    />
  </svg>
);

export default HomeSvg;

import * as React from "react";

const CoursesSvg = (props) => (
  <svg
    width={28}
    height={26}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    fillOpacity={0}
    {...props}
  >
    <path
      d="M25 5.208v13.277c0 1.056-.858 2.046-1.914 2.178l-.363.044c-2.398.32-6.094 1.54-8.206 2.706-.286.165-.759.165-1.056 0l-.044-.022c-2.112-1.155-5.797-2.365-8.184-2.684l-.319-.044C3.858 20.531 3 19.541 3 18.485V5.197c0-1.309 1.067-2.299 2.376-2.189 2.31.187 5.808 1.353 7.766 2.574l.275.165c.319.198.847.198 1.166 0l.187-.12c.693-.43 1.573-.859 2.53-1.244v4.488l2.2-1.463 2.2 1.463V3.13c.297-.055.583-.088.847-.11h.066C23.922 2.91 25 3.89 25 5.21ZM14 6.11v16.5"
      stroke={props.fill}
      strokeWidth={4.03}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21.7 3.13V8.87l-2.2-1.463-2.2 1.463V4.383c1.441-.572 3.047-1.034 4.4-1.254Z"
      stroke={props.fill}
      strokeWidth={4.03}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default CoursesSvg;

import React from "react";

const SchoolGradesSvg = (props) => {
  return (
    <svg
      width={24}
      height={23}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12.838 20.963c.33.077.36.509.038.616l-1.897.624c-4.767 1.537-7.276.253-8.825-4.514L.617 12.946C-.92 8.179.353 5.658 5.12 4.12l.629-.209c.484-.16.954.325.817.816-.068.243-.133.497-.197.761l-1.177 5.032c-1.32 5.655.612 8.777 6.268 10.121l1.378.321Z"
        fill={props.color}
      />
      <path
        d="M18.234.85 16.229.383c-4.01-.948-6.4-.168-7.805 2.738-.36.733-.648 1.621-.889 2.642l-1.176 5.03c-1.177 5.02.372 7.493 5.379 8.682l2.017.48c.697.168 1.345.276 1.945.324 3.747.36 5.74-1.393 6.748-5.727l1.177-5.02c1.177-5.018-.36-7.504-5.391-8.68Zm-2.258 12.152a.898.898 0 0 1-.876.672c-.072 0-.144-.012-.228-.024l-3.494-.888a.9.9 0 0 1-.649-1.093.9.9 0 0 1 1.093-.648l3.494.888c.492.12.78.613.66 1.093Zm3.519-4.058a.898.898 0 0 1-.877.672c-.072 0-.144-.012-.228-.024l-5.824-1.477a.9.9 0 0 1-.648-1.093.9.9 0 0 1 1.093-.648l5.823 1.477c.492.108.78.6.66 1.093Z"
        fill={props.color}
      />
    </svg>
  );
};

export default SchoolGradesSvg;
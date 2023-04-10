import React from "react";

const YearSvg = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="27"
      height="28"
      fill="none"
      viewBox="0 0 27 28"
      {...props}
    >
      <path
        stroke={props.color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit="10"
        strokeWidth="3"
        d="M8.055 2v3.633M17.744 2v3.633M2.606 10.586h20.588M21.631 18.676l-4.287 4.288c-.17.17-.327.484-.363.714l-.23 1.635c-.085.594.327 1.005.92.92l1.635-.23c.23-.036.557-.193.715-.363l4.287-4.287c.739-.739 1.09-1.599 0-2.689-1.078-1.077-1.938-.726-2.677.012zM21.014 19.294a3.858 3.858 0 002.689 2.689M12.9 26.221H8.055C3.817 26.221 2 23.8 2 20.166V9.872c0-3.633 1.817-6.055 6.055-6.055h9.689c4.239 0 6.055 2.422 6.055 6.055v4.239"
      ></path>
      <path
        stroke={props.color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
        d="M12.894 16.17h.012M8.412 16.17h.012M8.412 19.803h.012"
      ></path>
    </svg>
  );
};

export default YearSvg;

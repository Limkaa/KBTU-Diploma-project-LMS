import * as React from "react";
const FinalSvg = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={23}
    fill="none"
    {...props}
  >
    <path
      fill={props.color}
      d="M23.163 22.326H.837A.843.843 0 0 1 0 21.488c0-.457.38-.837.837-.837h22.326c.457 0 .837.38.837.837 0 .458-.38.838-.837.838Z"
    />
    <path
      fill={props.color}
      d="M9.488 2.233v20.093h5.024V2.233c0-1.228-.503-2.233-2.01-2.233h-1.004c-1.507 0-2.01 1.005-2.01 2.233Z"
    />
    <path
      fill={props.color}
      d="M1.953 8.93v13.396H6.42V8.93c0-1.228-.447-2.232-1.786-2.232H3.74c-1.34 0-1.787 1.004-1.787 2.232ZM17.581 14.512v7.814h4.466v-7.814c0-1.228-.447-2.233-1.787-2.233h-.893c-1.34 0-1.786 1.005-1.786 2.233Z"
      opacity={0.4}
    />
  </svg>
);
export default FinalSvg;

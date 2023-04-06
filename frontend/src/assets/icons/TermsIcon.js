import * as React from "react";

const TermsSvg = (props) => (
  <svg
    width={26}
    height={25}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M20.7 2h-2.2c-2.2 0-3.3 1.069-3.3 3.206v2.137c0 2.137 1.1 3.206 3.3 3.206h2.2c2.2 0 3.3-1.069 3.3-3.206V5.206M5.3 23.371h2.2c2.2 0 3.3-1.068 3.3-3.205v-2.137c0-2.138-1.1-3.206-3.3-3.206H5.3c-2.2 0-3.3 1.068-3.3 3.206v2.137M6.4 10.549c2.43 0 4.4-1.914 4.4-4.275C10.8 3.914 8.83 2 6.4 2 3.97 2 2 3.914 2 6.274c0 2.36 1.97 4.275 4.4 4.275ZM19.6 23.371c2.43 0 4.4-1.913 4.4-4.274 0-2.36-1.97-4.274-4.4-4.274-2.43 0-4.4 1.914-4.4 4.274 0 2.36 1.97 4.274 4.4 4.274Z"
      stroke={props.color}
      strokeWidth={3}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default TermsSvg;

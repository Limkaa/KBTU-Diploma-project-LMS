import * as React from "react"

const ClassromSvg = (props) => (
  <svg
    width={26}
    height={26}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#a)" fill={props.fill}>
      <path d="M12.67.414a.75.75 0 0 0-1.34 0L10.784 1.5H3.75A2.25 2.25 0 0 0 1.5 3.75V15h21V3.75a2.25 2.25 0 0 0-2.25-2.25h-7.037L12.671.414Z" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M.75 16.5a.75.75 0 1 0 0 1.5h4.29l-1.268 5.069a.75.75 0 0 0 1.456.363L5.835 21h12.33l.608 2.431a.75.75 0 0 0 1.454-.363L18.96 18h4.29a.75.75 0 1 0 0-1.5H.75Zm5.46 3 .375-1.5h10.83l.375 1.5H6.21Z"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
)

export default ClassromSvg


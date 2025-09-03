import * as React from "react";
const Logo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width={200}
    height={200}
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx={100} cy={100} r={90} fill="#1B263B" />
    <path
      d="M60,120 L100,60 L140,120 L140,160 L60,160 Z"
      fill="none"
      stroke="#E0A458"
      strokeWidth={8}
    />
    <rect x={120} y={80} width={10} height={20} fill="#E0A458" />
    <path d="M100,60 L110,50 L90,50 L100,60 Z" fill="#E0A458" />
    <rect x={90} y={130} width={20} height={30} fill="#E0A458" />
  </svg>
);
export default Logo;

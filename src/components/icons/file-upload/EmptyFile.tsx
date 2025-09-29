import { SVGProps } from 'react';
const EmptyFile = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={40}
    height={40}
    fill="none"
    viewBox="0 0 40 40"
    {...props}>
    <path
      fill="#fff"
      stroke="#D0D5DD"
      strokeWidth={1.5}
      d="M32 39.25H8A3.25 3.25 0 0 1 4.75 36V4A3.25 3.25 0 0 1 8 .75h16c.121 0 .238.048.323.134l10.793 10.793a.457.457 0 0 1 .134.323v24A3.25 3.25 0 0 1 32 39.25Z"
    />
    <path stroke="#D0D5DD" strokeWidth={1.5} d="M24 .5V8a4 4 0 0 0 4 4h7.5" />
    <path
      stroke="#155EEF"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M11.9 19.5h16.2m-16.2 3.6h16.2m-16.2 3.6h16.2m-16.2 3.6h12.6"
    />
  </svg>
);
export default EmptyFile;

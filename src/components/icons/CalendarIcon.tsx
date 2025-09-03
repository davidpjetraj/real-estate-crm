import { SVGProps } from "react";
const CalendarIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={18}
    height={18}
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M13.5 1.5V3M4.5 1.5V3"
      stroke="currentColor"
      strokeWidth={1.3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.5 12.75L7.49999 10.0104C7.49999 9.86663 7.39744 9.75 7.27094 9.75H6.75M10.2223 12.75L11.2381 10.0119C11.2856 9.88388 11.1846 9.75 11.0405 9.75H9.75"
      stroke="currentColor"
      strokeWidth={1.3}
      strokeLinecap="round"
    />
    <path
      d="M1.875 9.1824C1.875 5.91446 1.875 4.28046 2.81409 3.26523C3.75318 2.25 5.26462 2.25 8.2875 2.25H9.7125C12.7354 2.25 14.2469 2.25 15.1859 3.26523C16.125 4.28046 16.125 5.91446 16.125 9.1824V9.5676C16.125 12.8356 16.125 14.4695 15.1859 15.4848C14.2469 16.5 12.7354 16.5 9.7125 16.5H8.2875C5.26462 16.5 3.75318 16.5 2.81409 15.4848C1.875 14.4695 1.875 12.8356 1.875 9.5676V9.1824Z"
      stroke="currentColor"
      strokeWidth={1.3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.5 6H13.5"
      stroke="currentColor"
      strokeWidth={1.3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export default CalendarIcon;

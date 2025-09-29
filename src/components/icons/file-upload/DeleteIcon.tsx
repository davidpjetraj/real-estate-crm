import { SVGProps } from 'react';

export default function DeleteIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      fill="none"
      viewBox="0 0 20 20"
      {...props}>
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth={1.25}
        d="m16.25 4.583-.516 8.355c-.132 2.134-.198 3.201-.733 3.969-.265.379-.605.7-1 .94-.8.486-1.868.486-4.007.486-2.141 0-3.212 0-4.011-.487a3.332 3.332 0 0 1-1-.942c-.536-.768-.6-1.837-.73-3.975L3.75 4.583M2.5 4.583h15m-4.12 0-.57-1.173c-.377-.78-.566-1.17-.892-1.413a1.664 1.664 0 0 0-.229-.143c-.36-.187-.794-.187-1.66-.187-.888 0-1.332 0-1.7.195a1.668 1.668 0 0 0-.231.149c-.33.253-.514.657-.882 1.465L6.71 4.583M7.917 13.75v-5M12.083 13.75v-5"
      />
    </svg>
  );
}

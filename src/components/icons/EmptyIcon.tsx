export const EmptyIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={56}
    height={56}
    fill="none"
    {...props}>
    <rect width={48} height={48} x={4} y={4} fill="#F5F5F5" rx={24} />
    <path
      stroke="#525252"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m37 37-3.5-3.5m2.5-6a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0Z"
    />
    <rect
      width={48}
      height={48}
      x={4}
      y={4}
      stroke="#FAFAFA"
      strokeWidth={8}
      rx={24}
    />
  </svg>
);

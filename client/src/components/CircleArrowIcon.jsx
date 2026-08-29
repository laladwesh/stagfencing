function CircleArrowIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
      <g clipPath="url(#clip0_63_13708)">
        <path
          d="M3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M16 12L12 8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 12H8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 16L16 12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id="clip0_63_13708">
          <rect width="24" height="24" fill="white" transform="matrix(0 1 -1 0 24 0)" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default CircleArrowIcon;

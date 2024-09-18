const Twitter = (props: any): JSX.Element => {
  return (
    <svg width={props.width || 18} viewBox='0 0 18 18' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M17.45 3.7a4.55 4.55 0 01-2 .5A3.17 3.17 0 0017 2.3a5.84 5.84 0 01-2.2.8 3.55 3.55 0 00-2.5-1 3.48 3.48 0 00-3.5 3.5 2.2 2.2 0 00.1.8 10.18 10.18 0 01-7.2-3.7 3.45 3.45 0 00-.5 1.8 3.36 3.36 0 001.6 2.9A4.19 4.19 0 011.15 7 3.44 3.44 0 004 10.4a2.77 2.77 0 01-.9.1 2 2 0 01-.7-.1 3.36 3.36 0 003.3 2.4 7.23 7.23 0 01-4.3 1.5H.55a9.72 9.72 0 005.3 1.6 9.83 9.83 0 009.9-9.9v-.4a15.37 15.37 0 001.7-1.9z'
        fill={props.fill || '#fff'}
      />
    </svg>
  )
}

export default Twitter
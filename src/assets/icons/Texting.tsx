const Texting = (props: any): JSX.Element => {
  return (
    <svg width={props.width || 15} height='15' viewBox='0 0 15 15' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M13.167 0.416626H1.83366C1.05449 0.416626 0.424076 1.05413 0.424076 1.83329L0.416992 14.5833L3.25033 11.75H13.167C13.9462 11.75 14.5837 11.1125 14.5837 10.3333V1.83329C14.5837 1.05413 13.9462 0.416626 13.167 0.416626ZM11.7503 8.91663H3.25033V7.49996H11.7503V8.91663ZM11.7503 6.79163H3.25033V5.37496H11.7503V6.79163ZM11.7503 4.66663H3.25033V3.24996H11.7503V4.66663Z'
        fill={props.fill || '#fff'}
      />
    </svg>
  )
}

export default Texting

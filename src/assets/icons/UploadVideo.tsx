const UploadVideo = (props: any): JSX.Element => {
  return (
    <svg width={props.width || 24} viewBox='0 0 34 34' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M22.3763 24.233H10.4631V12.3198H18.1216V10.6179H10.4631C9.52705 10.6179 8.7612 11.3838 8.7612 12.3198V24.233C8.7612 25.1691 9.52705 25.9349 10.4631 25.9349H22.3763C23.3123 25.9349 24.0782 25.1691 24.0782 24.233V16.5745H22.3763V24.233ZM24.0782 10.6179V8.06512H22.3763V10.6179H19.8234C19.832 10.6265 19.8234 12.3198 19.8234 12.3198H22.3763V14.8641C22.3848 14.8727 24.0782 14.8641 24.0782 14.8641V12.3198H26.631V10.6179H24.0782Z'
        fill={props.fill || '#fff'}
      />
      <path d='M14.8234 22.5048V14.5048L19.8234 18.5048L14.8234 22.5048Z' fill={props.fill || '#fff'} />
    </svg>
  )
}

export default UploadVideo

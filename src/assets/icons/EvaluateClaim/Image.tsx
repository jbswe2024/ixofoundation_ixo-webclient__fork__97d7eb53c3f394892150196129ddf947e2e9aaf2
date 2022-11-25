const Image: React.FunctionComponent = (props: any) => {
  return (
    <svg width={props.width || 33} height='33' viewBox='0 0 33 33' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M18.4073 1.76302C18.4073 0.870232 17.6836 0.146484 16.7908 0.146484H3.01925C1.48876 0.146484 0.248047 1.38719 0.248047 2.91769V16.7586C0.248047 17.6514 0.971794 18.3751 1.86458 18.3751C2.75737 18.3751 3.48112 17.6514 3.48112 16.7586V3.37955H16.7908C17.6836 3.37955 18.4073 2.65581 18.4073 1.76302ZM29.8075 32.4772H15.9161C15.0233 32.4772 14.2996 31.7534 14.2996 30.8607C14.2996 29.9679 15.0233 29.2441 15.9161 29.2441H29.3457V15.7397C29.3457 14.8469 30.0694 14.1231 30.9622 14.1231C31.855 14.1231 32.5787 14.8469 32.5787 15.7397V29.706C32.5787 31.2365 31.338 32.4772 29.8075 32.4772Z'
        fill='white'
      />
    </svg>
  )
}

export default Image

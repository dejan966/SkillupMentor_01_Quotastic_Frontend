import { FC } from "react"

const SuccessPopup : FC = (props:any) => {
    return (
      <div className='popup-box'>
        <div className='box'>
          {props.content}
        </div>
      </div>
    )
  } 
  export default SuccessPopup
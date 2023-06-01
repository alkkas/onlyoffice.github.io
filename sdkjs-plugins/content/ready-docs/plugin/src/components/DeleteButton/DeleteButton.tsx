import React from 'react'
import './DeleteButton.styles.scss'

const DeleteButton = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button {...props} className={`delete-button ${props?.className}`}></button>
  )
}
export default DeleteButton

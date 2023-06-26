import React from 'react'
type ButtonProps = {
  children?: JSX.Element | string
  type?: 'primary' | 'submit' | 'button'
}

const Button = ({
  children,
  type,
  ...props
}: ButtonProps & React.HTMLProps<HTMLButtonElement>) => {
  return (
    <button
      {...props}
      type={type}
      className={`btn-text-default ${type || ''} ${props.className}`}
    >
      {children}
    </button>
  )
}
export default Button

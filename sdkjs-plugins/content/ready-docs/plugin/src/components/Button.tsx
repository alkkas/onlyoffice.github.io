import React from 'react'
type ButtonProps = {
  children?: JSX.Element | string
  type?: 'primary' | 'submit'
}

const Button = ({
  children,
  type,
  ...props
}: ButtonProps & React.HTMLProps<HTMLButtonElement>) => {
  return (
    <button
      {...props}
      className={`btn-text-default ${type || ''} ${props.className}`}
    >
      {children}
    </button>
  )
}
export default Button

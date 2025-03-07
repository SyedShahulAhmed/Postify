import React from 'react'

const Button = ({
    children,
    type = 'button',
    bgColor = 'bg-blue-700',
    textColor = 'text-white',
    className = '',
    ...props
}) => {
  return (
   <button className={`px-4 py-2 rounded-lg ${bgColor} ${textColor} ${children} ${className}`} {...props}>
    {children}
   </button>
  )
}

export default Button
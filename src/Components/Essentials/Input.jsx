import React, { forwardRef, useId } from 'react'

const Input = forwardRef(function name({
    label,
    type = "text",
    className = "",
    ...props
},ref ){
    const id = useId()
    return (
        <div className='w-full'>
            {label && 
            <label className='inline-block mb-1 pl-1' htmlFor={id}>
                {label}
            </label>
            }
            <input 
            type={type}
            className={`px-3py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 vorder border-gray-300  w-full border-2 py-1.5 px-3  ${className}`}
            ref={ref}
            {...props}
            id = {id}
            />
        </div>
    )
})

export default Input
import React, { forwardRef, useId } from 'react'

const Select = ({
    options,
    label,
    className,
    ...props
},ref) => {
    const id = useId()
  return (
    <div className='w-full'>
        {label && 
        <label htmlFor={id} className=''>
        </label>}
        <select
        {...props}
        id = {id}
        ref = {ref}
        className={`${className} px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full`}
        >
            {options ? options.map((item) => (
                <option key={item} value={item}>{item}
                </option>
            )) : null}
        </select>
    </div>
  )
}

export default forwardRef(Select)
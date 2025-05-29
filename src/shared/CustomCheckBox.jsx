import React from 'react'
import { Checkbox } from '@headlessui/react'

const CustomCheckBox = ({ checked, onChange, className }) => {
  return (
    <Checkbox
      checked={checked}
      onChange={onChange}
      className={`${className} border bg-white outline-hidden rounded-sm border-color-gray-300 hover:border-color-gray-700 group data-checked:bg-color-gray-900`}
    >
      <svg
        className="stroke-white opacity-0 group-data-checked:opacity-100"
        viewBox="0 0 14 14"
        fill="none"
      >
        <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Checkbox>
  )
}

export default CustomCheckBox
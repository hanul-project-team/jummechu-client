import React from 'react'
import { Checkbox } from '@headlessui/react'
import style from './customCheckBox.module.css'

const CustomCheckBox = ({ checked, onChange , className }) => {
  return (
    <Checkbox checked={checked} onChange={onChange} className={`${style.checkBox} ${className && className}`}>
      <svg className={`${style.checkMark}`} viewBox="0 0 14 14" fill="none">
        <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Checkbox>
  )
}

export default CustomCheckBox
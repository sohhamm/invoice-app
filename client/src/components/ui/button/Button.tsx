import * as React from 'react'
import clsx from 'clsx'
import classes from './button.module.css'
import {HiPlusCircle} from 'react-icons/hi2'

type Variant = 'default' | 'edit' | 'draft' | 'delete' | 'large'

interface ButtonProps {
  children: React.ReactNode
  hasAddIcon?: boolean
  variant?: Variant
  onClick?: any
  type?: 'button' | 'submit' | 'reset'
  overrideStyles?: React.CSSProperties
}

export default function Button({
  children,
  onClick,
  hasAddIcon = false,
  variant = 'default',
  type = 'button',
  overrideStyles = {},
}: ButtonProps) {
  return (
    <button
      className={clsx(
        classes.btn,
        !hasAddIcon && classes.noIcon,
        isEdit(variant) && classes.btnEdit,
        isDraft(variant) && classes.btnDraft,
        isDel(variant) && classes.btnDel,
        isLg(variant) && classes.btnLg,
      )}
      onClick={onClick}
      type={type}
      style={{...overrideStyles}}
    >
      {hasAddIcon && <HiPlusCircle size={36} style={{marginLeft: '-12px'}} />}
      {children}
    </button>
  )
}

const isEdit = (variant?: Variant) => variant === 'edit'
const isDraft = (variant?: Variant) => variant === 'draft'
const isLg = (variant?: Variant) => variant === 'large'
const isDel = (variant?: Variant) => variant === 'delete'

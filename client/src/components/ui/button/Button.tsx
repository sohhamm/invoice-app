import * as React from 'react'
import clsx from 'clsx'
import classes from './styles.module.css'
import {HiPlusCircle} from 'react-icons/hi2'

type Variant = 'default' | 'edit' | 'draft' | 'delete' | 'large'

interface ButtonProps {
  children: React.ReactNode
  hasAddIcon?: boolean
  variant?: Variant
}

export default function ButtonDefault({
  children,
  hasAddIcon = false,
  variant = 'default',
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
    >
      {hasAddIcon && <HiPlusCircle size={32} />}
      {children}
    </button>
  )
}

const isEdit = (variant?: Variant) => variant === 'edit'
const isDraft = (variant?: Variant) => variant === 'draft'
const isLg = (variant?: Variant) => variant === 'large'
const isDel = (variant?: Variant) => variant === 'delete'

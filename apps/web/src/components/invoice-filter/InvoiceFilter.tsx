import * as React from 'react'
import { Popover, PopoverDisclosure, usePopoverStore } from '@ariakit/react'
import classes from './invoice-filter.module.css'
import { HiChevronDown, HiCheck } from 'react-icons/hi2'
import { Option } from '@/types'
import { useMobile } from '@/utils/hooks/use-media-query'

interface InvoiceFilterProps {
  opts: Option
  setOpts: React.Dispatch<React.SetStateAction<Option>>
}

export default function InvoiceFilter({ opts, setOpts }: InvoiceFilterProps) {
  const { isMobile } = useMobile()
  const popover = usePopoverStore()

  const handleChange = (opt: 'draft' | 'pending' | 'paid') => {
    switch (opt) {
      case 'draft':
        setOpts(s => ({ ...s, draft: !s.draft }))
        break
      case 'pending':
        setOpts(s => ({ ...s, pending: !s.pending }))
        break
      case 'paid':
        setOpts(s => ({ ...s, paid: !s.paid }))
        break
    }
  }

  return (
    <>
      <PopoverDisclosure store={popover} className={classes.btn}>
        <span>{isMobile ? 'Filter' : 'Filter by status'}</span>
        <HiChevronDown color='#7C5DFA' strokeWidth={3} />
      </PopoverDisclosure>

      <Popover store={popover} className={classes.popoverContent}>
        <div className={classes.filterOption}>
          <div 
            className={classes.customCheckbox}
            onClick={() => handleChange('draft')}
            role="checkbox"
            aria-checked={opts.draft}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleChange('draft')
              }
            }}
          >
            <div className={`${classes.checkboxIndicator} ${opts.draft ? classes.checked : ''}`}>
              {opts.draft && <HiCheck className={classes.checkIcon} />}
            </div>
          </div>
          <label 
            className={classes.filterLabel}
            onClick={() => handleChange('draft')}
          >
            Draft
          </label>
        </div>

        <div className={classes.filterOption}>
          <div 
            className={classes.customCheckbox}
            onClick={() => handleChange('pending')}
            role="checkbox"
            aria-checked={opts.pending}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleChange('pending')
              }
            }}
          >
            <div className={`${classes.checkboxIndicator} ${opts.pending ? classes.checked : ''}`}>
              {opts.pending && <HiCheck className={classes.checkIcon} />}
            </div>
          </div>
          <label 
            className={classes.filterLabel}
            onClick={() => handleChange('pending')}
          >
            Pending
          </label>
        </div>

        <div className={classes.filterOption}>
          <div 
            className={classes.customCheckbox}
            onClick={() => handleChange('paid')}
            role="checkbox"
            aria-checked={opts.paid}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleChange('paid')
              }
            }}
          >
            <div className={`${classes.checkboxIndicator} ${opts.paid ? classes.checked : ''}`}>
              {opts.paid && <HiCheck className={classes.checkIcon} />}
            </div>
          </div>
          <label 
            className={classes.filterLabel}
            onClick={() => handleChange('paid')}
          >
            Paid
          </label>
        </div>
      </Popover>
    </>
  )
}
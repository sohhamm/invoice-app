import * as React from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import classes from './invoice-filter.module.css'
import {HiChevronDown, HiChevronUp, HiCheck} from 'react-icons/hi2'
import {Option} from '@/types'

interface InvoiceFilterProps {
  opts: Option
  setOpts: React.Dispatch<React.SetStateAction<Option>>
}

export default function InvoiceFilter({opts, setOpts}: InvoiceFilterProps) {
  const handleChange = (opt: 'draft' | 'pending' | 'paid') => {
    switch (opt) {
      case 'draft':
        setOpts(s => ({...s, draft: !s.draft}))
        break
      case 'pending':
        setOpts(s => ({...s, pending: !s.pending}))
        break
      case 'paid':
        setOpts(s => ({...s, paid: !s.paid}))
        break
    }
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <div aria-label='Select invoice filter' className={classes.btn}>
          <span>Filter by status</span>
          <HiChevronDown color='#7C5DFA' />
        </div>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className={classes.DropdownMenuContent} sideOffset={5}>
          <DropdownMenu.CheckboxItem
            className={classes.DropdownMenuCheckboxItem}
            checked={opts.draft}
            onCheckedChange={() => handleChange('draft')}
          >
            <DropdownMenu.ItemIndicator className={classes.DropdownMenuItemIndicator}>
              <HiCheck />
            </DropdownMenu.ItemIndicator>
            Draft
          </DropdownMenu.CheckboxItem>
          <DropdownMenu.CheckboxItem
            className={classes.DropdownMenuCheckboxItem}
            checked={opts.pending}
            // @ts-ignore
            onCheckedChange={() => handleChange('pending')}
          >
            <DropdownMenu.ItemIndicator className={classes.DropdownMenuItemIndicator}>
              <HiCheck />
            </DropdownMenu.ItemIndicator>
            Pending
          </DropdownMenu.CheckboxItem>

          <DropdownMenu.CheckboxItem
            className={classes.DropdownMenuCheckboxItem}
            checked={opts.paid}
            onCheckedChange={() => handleChange('paid')}
            style={{marginBottom: 0}}
          >
            <DropdownMenu.ItemIndicator className={classes.DropdownMenuItemIndicator}>
              <HiCheck />
            </DropdownMenu.ItemIndicator>
            Paid
          </DropdownMenu.CheckboxItem>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

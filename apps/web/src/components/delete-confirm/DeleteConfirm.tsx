import * as React from 'react'
import { Dialog, DialogDisclosure, useDialogStore } from '@ariakit/react'
import clsx from 'clsx'
import Button from '../ui/button'
import classes from './delete-confirm.module.css'

export default function DeleteConfirm({
  onDelete,
  invoiceId,
}: {
  onDelete: () => void
  invoiceId: string | number
}) {
  const dialog = useDialogStore()

  const handleDelete = () => {
    onDelete()
    dialog.hide() // Close dialog after deletion
  }

  const handleCancel = () => {
    dialog.hide() // Close dialog on cancel
  }

  return (
    <>
      <DialogDisclosure store={dialog}>
        <Button variant='delete'>Delete</Button>
      </DialogDisclosure>

      <Dialog store={dialog} className={classes.dialogContent} backdrop={classes.dialogOverlay}>
        <div className={classes.dialogHeader}>
          <h2 className={classes.dialogTitle}>
            Confirm Deletion
          </h2>
          <p className={classes.dialogDescription}>
            Are you sure you want to delete invoice #{invoiceId}? This action cannot be undone.
          </p>
        </div>
        
        <div className={classes.footer}>
          <Button 
            variant='edit' 
            overrideStyles={{width: '91px'}}
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button 
            variant='delete'
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </Dialog>
    </>
  )
}
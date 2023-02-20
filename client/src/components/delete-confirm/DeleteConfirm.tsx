import * as React from 'react'
import * as AlertDialog from '@radix-ui/react-alert-dialog'
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
  const handleDelete = () => {
    onDelete()
  }
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <div>
          <Button variant='delete'>Delete</Button>
        </div>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className={classes.AlertDialogOverlay} />
        <AlertDialog.Content className={classes.AlertDialogContent}>
          <AlertDialog.Title className={classes.AlertDialogTitle}>
            Confirm Deletion
          </AlertDialog.Title>
          <AlertDialog.Description className={classes.AlertDialogDescription}>
            Are you sure you want to delete invoice #{invoiceId}? This action cannot be undone.
          </AlertDialog.Description>
          <div style={{display: 'flex', gap: 25, justifyContent: 'flex-end'}}>
            <AlertDialog.Cancel asChild>
              <div>
                <Button variant='edit'>Cancel</Button>
              </div>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <div onClick={handleDelete}>
                <Button variant='delete'>Delete</Button>
              </div>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}

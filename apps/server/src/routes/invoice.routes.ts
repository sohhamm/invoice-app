import express from 'express';
import {
  createInvoiceHandler,
  getAllInvoicesHandler,
  getInvoiceByIdHandler,
  updateInvoiceHandler,
  deleteInvoiceHandler,
  markInvoiceAsPaidHandler
} from '@/controllers/invoice.controller';

const router = express.Router();

// GET /api/invoices - Get all invoices with optional status filter
router.get('/', getAllInvoicesHandler);

// GET /api/invoices/:id - Get specific invoice by ID
router.get('/:id', getInvoiceByIdHandler);

// POST /api/invoices - Create new invoice
router.post('/', createInvoiceHandler);

// PUT /api/invoices/:id - Update invoice
router.put('/:id', updateInvoiceHandler);

// PATCH /api/invoices/:id/mark-paid - Mark invoice as paid
router.patch('/:id/mark-paid', markInvoiceAsPaidHandler);

// DELETE /api/invoices/:id - Delete invoice
router.delete('/:id', deleteInvoiceHandler);

export default router;
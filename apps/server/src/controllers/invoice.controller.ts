import { Request, Response } from 'express';
import * as invoiceService from '@/services/invoice.service';
import { Logger } from '@/utils/logger';
import { ResponseUtils } from '@/utils/response';
import type { CreateInvoiceInput } from '@personal-finance-app/shared-types';

export async function createInvoiceHandler(req: Request, res: Response) {
  try {
    const { isDraft, ...invoiceData } = req.body;
    
    // Validate required fields for non-draft invoices
    if (!isDraft) {
      const requiredFields = [
        'description', 'clientName', 'clientEmail', 'paymentTerms',
        'senderAddress', 'clientAddress', 'items'
      ];
      
      for (const field of requiredFields) {
        if (!invoiceData[field]) {
          return res.status(400).json({
            error: `${field} is required when saving as pending`
          });
        }
      }
      
      // Validate address fields
      const addressFields = ['street', 'city', 'postCode', 'country'];
      for (const addressField of addressFields) {
        if (!invoiceData.senderAddress?.[addressField] || !invoiceData.clientAddress?.[addressField]) {
          return res.status(400).json({
            error: `Address ${addressField} is required when saving as pending`
          });
        }
      }
      
      // Validate items
      if (!invoiceData.items || invoiceData.items.length === 0) {
        return res.status(400).json({
          error: 'At least one item is required when saving as pending'
        });
      }
    }
    
    const status = isDraft ? 'draft' : 'pending';
    const invoice = await invoiceService.createInvoice({ ...invoiceData, status });
    
    Logger.info('Invoice created', { invoiceId: invoice.id, status });
    res.status(201).json(invoice);
  } catch (error) {
    Logger.error('Error creating invoice', { error });
    res.status(500).json({ error: 'Failed to create invoice' });
  }
}

export async function getAllInvoicesHandler(req: Request, res: Response) {
  try {
    const { status } = req.query;
    const invoices = await invoiceService.getAllInvoices(status as string);
    
    res.json(invoices);
  } catch (error) {
    Logger.error('Error fetching invoices', { error });
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
}

export async function getInvoiceByIdHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const invoice = await invoiceService.getInvoiceById(id);
    
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    res.json(invoice);
  } catch (error) {
    Logger.error('Error fetching invoice', { error, invoiceId: req.params.id });
    res.status(500).json({ error: 'Failed to fetch invoice' });
  }
}

export async function updateInvoiceHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Validate required fields for all updates (drafts become pending when updated)
    const requiredFields = [
      'description', 'clientName', 'clientEmail', 'paymentTerms',
      'senderAddress', 'clientAddress', 'items'
    ];
    
    for (const field of requiredFields) {
      if (!updateData[field]) {
        return res.status(400).json({
          error: `${field} is required when updating invoice`
        });
      }
    }
    
    const invoice = await invoiceService.updateInvoice(id, updateData);
    
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    Logger.info('Invoice updated', { invoiceId: id });
    res.json(invoice);
  } catch (error) {
    Logger.error('Error updating invoice', { error, invoiceId: req.params.id });
    res.status(500).json({ error: 'Failed to update invoice' });
  }
}

export async function markInvoiceAsPaidHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const invoice = await invoiceService.markInvoiceAsPaid(id);
    
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    Logger.info('Invoice marked as paid', { invoiceId: id });
    res.json(invoice);
  } catch (error) {
    Logger.error('Error marking invoice as paid', { error, invoiceId: req.params.id });
    res.status(500).json({ error: 'Failed to mark invoice as paid' });
  }
}

export async function deleteInvoiceHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await invoiceService.deleteInvoice(id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    Logger.info('Invoice deleted', { invoiceId: id });
    res.status(204).send();
  } catch (error) {
    Logger.error('Error deleting invoice', { error, invoiceId: req.params.id });
    res.status(500).json({ error: 'Failed to delete invoice' });
  }
}
import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import rootDir from '../util/path.js';

const formatCurrency = (n) => `$${n.toFixed(2)}`;
const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

function buildLineItems(order) {
  const lineItems = order.items.map((i) => {
    const unitPrice = i.productId?.price ?? 0;
    const lineTotal = unitPrice * i.quantity;
    return {
      title: i.productId?.title ?? 'Unknown product',
      qty: i.quantity,
      unitPrice,
      lineTotal,
    };
  });
  const grandTotal = lineItems.reduce((sum, l) => sum + l.lineTotal, 0);
  return { lineItems, grandTotal };
}

function generateInvoicePdf(order) {
  const { lineItems, grandTotal } = buildLineItems(order);

  const fileName = `invoice-${order._id}.pdf`;
  const filePath = path.join(rootDir, 'data', 'invoices', fileName);
  const doc = new PDFDocument({ size: 'A4', margin: 50 });

  doc.pipe(fs.createWriteStream(filePath));

  const pageWidth = doc.page.width;
  const leftX = 50;
  const rightX = pageWidth - 50;
  const contentWidth = rightX - leftX;

  // Header
  doc.font('Helvetica-Bold').fontSize(28).text('INVOICE', leftX, 50);
  doc
    .font('Helvetica')
    .fontSize(10)
    .text(`Invoice #: ${order._id}`, leftX, 50, { width: contentWidth, align: 'right' })
    .text(`Date: ${formatDate(order.createdAt)}`, { width: contentWidth, align: 'right' });

  doc.moveTo(leftX, 100).lineTo(rightX, 100).strokeColor('#cccccc').stroke();

  // Bill To
  doc.font('Helvetica-Bold').fontSize(12).fillColor('#000').text('Bill To', leftX, 120);
  doc
    .font('Helvetica')
    .fontSize(11)
    .text(order.userId?.name ?? 'Customer', leftX, 138)
    .text(order.userId?.email ?? '', leftX);

  // Items table
  const tableTop = 200;
  const colItem = leftX;
  const colQty = 300;
  const colUnit = 360;
  const colLine = 460;

  doc.font('Helvetica-Bold').fontSize(11).fillColor('#000');
  doc.text('Item', colItem, tableTop);
  doc.text('Qty', colQty, tableTop, { width: 50, align: 'right' });
  doc.text('Unit Price', colUnit, tableTop, { width: 90, align: 'right' });
  doc.text('Line Total', colLine, tableTop, { width: 90, align: 'right' });
  doc
    .moveTo(leftX, tableTop + 16)
    .lineTo(rightX, tableTop + 16)
    .strokeColor('#000')
    .stroke();

  let rowY = tableTop + 24;
  doc.font('Helvetica').fontSize(11);
  lineItems.forEach((l) => {
    doc.text(l.title, colItem, rowY, { width: colQty - colItem - 10, ellipsis: true });
    doc.text(String(l.qty), colQty, rowY, { width: 50, align: 'right' });
    doc.text(formatCurrency(l.unitPrice), colUnit, rowY, { width: 90, align: 'right' });
    doc.text(formatCurrency(l.lineTotal), colLine, rowY, { width: 90, align: 'right' });
    rowY += 22;
  });

  // Totals
  const totalsY = rowY + 10;
  doc.moveTo(colUnit, totalsY).lineTo(rightX, totalsY).strokeColor('#000').stroke();
  doc
    .font('Helvetica-Bold')
    .fontSize(14)
    .text('Total', colUnit, totalsY + 10, { width: 90, align: 'right' });
  doc.text(formatCurrency(grandTotal), colLine, totalsY + 10, { width: 90, align: 'right' });

  // Footer
  doc
    .font('Helvetica-Oblique')
    .fontSize(10)
    .fillColor('#666')
    .text('Thank you for your purchase', leftX, doc.page.height - 80, {
      width: contentWidth,
      align: 'center',
    });

  return { doc, fileName };
}

export { generateInvoicePdf };

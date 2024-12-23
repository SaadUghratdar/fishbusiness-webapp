import InvoiceItem from './InvoiceItem';
import React from 'react';

function InvoiceItemsTable({ items }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th>Pieces</th>
          <th>Kgs</th>
          <th>Grams</th>
          <th>Rate</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <InvoiceItem key={item.id} {...item} />
        ))}
      </tbody>
    </table>
  );
}

export default InvoiceItemsTable;

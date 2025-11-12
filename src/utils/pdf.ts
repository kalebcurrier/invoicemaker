import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import { BusinessProfile } from "@/store/businessStore";
import { Invoice } from "@/store/invoiceStore";

export const exportInvoicePdf = async (invoice: Invoice, business: BusinessProfile) => {
  const html = `
    <style>
      body { font-family: 'Inter', sans-serif; padding: 32px; color: #0F172A; }
      h1 { font-size: 28px; }
      table { width: 100%; border-collapse: collapse; margin-top: 24px; }
      th, td { text-align: left; padding: 8px; border-bottom: 1px solid #E2E8F0; }
      .totals { margin-top: 24px; }
      .totals div { display: flex; justify-content: space-between; margin-bottom: 4px; }
      .badge { padding: 6px 12px; border-radius: 999px; background: ${invoice.status === "paid" ? "#DCFCE7" : "#FEE2E2"}; display: inline-block; }
    </style>
    <body>
      <h1>${business.businessName} — Invoice ${invoice.number}</h1>
      <p>${business.firstName} ${business.lastName} | ${business.email} | ${business.phone}</p>
      <div class="badge">${invoice.status.toUpperCase()}</div>
      <h2>Bill to</h2>
      <p>${invoice.client.company}<br/>${invoice.client.contactName}<br/>${invoice.client.email}<br/>${invoice.client.phone}</p>
      <table>
        <thead>
          <tr><th>Item</th><th>Qty</th><th>Rate</th><th>Total</th></tr>
        </thead>
        <tbody>
          ${invoice.items
            .map(
              (item) =>
                `<tr><td>${item.name}</td><td>${item.quantity}</td><td>$${item.rate.toFixed(2)}</td><td>$${(
                  item.quantity * item.rate
                ).toFixed(2)}</td></tr>`
            )
            .join("")}
        </tbody>
      </table>
      <div class="totals">
        <div><span>Subtotal</span><strong>$${invoice.subtotal.toFixed(2)}</strong></div>
        <div><span>Discount (${invoice.discountPercent}%)</span><strong>-$${invoice.discountAmount.toFixed(2)}</strong></div>
        <div><span>Total</span><strong>$${invoice.total.toFixed(2)}</strong></div>
      </div>
    </body>
  `;
  const { uri } = await Print.printToFileAsync({ html });
  await shareAsync(uri, { mimeType: "application/pdf" });
};

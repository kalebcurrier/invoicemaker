import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { nanoid } from "nanoid";

export type InvoiceStatus = "unpaid" | "paid";

export interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  rate: number;
}

export interface ClientInfo {
  company: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
}

export interface Invoice {
  id: string;
  number: string;
  status: InvoiceStatus;
  client: ClientInfo;
  items: InvoiceItem[];
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  total: number;
  currency: string;
  dueDate: string;
  notes?: string;
  createdAt: string;
}

interface InvoiceDraft {
  client: ClientInfo;
  currency: string;
  dueDate: string;
  notes?: string;
}

interface InvoiceStore {
  invoices: Invoice[];
  draft?: InvoiceDraft;
  editingInvoiceId?: string;
  draftItems: InvoiceItem[];
  draftDiscountPercent: number;
  setDraft: (draft: InvoiceDraft) => void;
  setDraftItems: (items: InvoiceItem[]) => void;
  setDraftDiscountPercent: (percent: number) => void;
  resetCurrentFlow: () => void;
  hydrateDraftFromInvoice: (id: string) => void;
  finalizeInvoice: (payload: { items: InvoiceItem[]; discountPercent: number }) => Invoice | undefined;
  markPaid: (id: string) => void;
}

const calculateTotals = (items: InvoiceItem[], discountPercent: number) => {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  const discountAmount = subtotal * (discountPercent / 100);
  const total = subtotal - discountAmount;
  return { subtotal, discountAmount, total };
};

const createInvoiceNumber = (count: number) =>
  `INV-${new Date().getFullYear()}-${(count + 1).toString().padStart(4, "0")}`;

export const useInvoiceStore = create<InvoiceStore>()(
  persist(
    (set, get) => ({
      invoices: [],
      draft: undefined,
      editingInvoiceId: undefined,
      draftItems: [],
      draftDiscountPercent: 0,
      setDraft: (draft) => set({ draft }),
      setDraftItems: (items) => set({ draftItems: items }),
      setDraftDiscountPercent: (percent) => set({ draftDiscountPercent: percent }),
      resetCurrentFlow: () =>
        set({
          draft: undefined,
          editingInvoiceId: undefined,
          draftItems: [],
          draftDiscountPercent: 0
        }),
      hydrateDraftFromInvoice: (id) => {
        const invoice = get().invoices.find((inv) => inv.id === id);
        if (!invoice) return;
        set({
          draft: {
            client: invoice.client,
            currency: invoice.currency,
            dueDate: invoice.dueDate,
            notes: invoice.notes
          },
          editingInvoiceId: invoice.id,
          draftItems: invoice.items,
          draftDiscountPercent: invoice.discountPercent
        });
      },
      finalizeInvoice: ({ items, discountPercent }) => {
        const { draft, invoices, editingInvoiceId } = get();
        if (!draft) return;
        const { subtotal, discountAmount, total } = calculateTotals(items, discountPercent);

        if (editingInvoiceId) {
          const existing = invoices.find((inv) => inv.id === editingInvoiceId);
          if (!existing) return;
          const updated: Invoice = {
            ...existing,
            client: draft.client,
            items,
            subtotal,
            discountPercent,
            discountAmount,
            total,
            currency: draft.currency,
            dueDate: draft.dueDate,
            notes: draft.notes
          };
          set((state) => ({
            invoices: state.invoices.map((inv) =>
              inv.id === editingInvoiceId ? updated : inv
            ),
            draft: undefined,
            editingInvoiceId: undefined,
            draftItems: [],
            draftDiscountPercent: 0
          }));
          return updated;
        }

        const invoice: Invoice = {
          id: nanoid(),
          number: createInvoiceNumber(invoices.length),
          client: draft.client,
          items,
          subtotal,
          discountPercent,
          discountAmount,
          total,
          currency: draft.currency,
          dueDate: draft.dueDate,
          notes: draft.notes,
          status: "unpaid",
          createdAt: new Date().toISOString()
        };
        set((state) => ({
          invoices: [invoice, ...state.invoices],
          draft: undefined,
          draftItems: [],
          draftDiscountPercent: 0
        }));
        return invoice;
      },
      markPaid: (id) =>
        set((state) => ({
          invoices: state.invoices.map((invoice) =>
            invoice.id === id ? { ...invoice, status: "paid" } : invoice
          )
        }))
    }),
    {
      name: "invoice-store",
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);

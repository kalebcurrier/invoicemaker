import { useEffect, useMemo, useState } from "react";
import { FlatList, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { nanoid } from "nanoid";
import { useInvoiceStore, InvoiceItem } from "@/store/invoiceStore";
import { useBusinessStore } from "@/store/businessStore";
import { PrimaryButton } from "@/components/PrimaryButton";
import { exportInvoicePdf } from "@/utils/pdf";

const defaultItem = (): InvoiceItem => ({
  id: nanoid(),
  name: "",
  quantity: 1,
  rate: 0
});

export default function InvoiceItemsScreen() {
  const {
    draft,
    finalizeInvoice,
    draftItems,
    draftDiscountPercent,
    setDraftItems,
    setDraftDiscountPercent
  } = useInvoiceStore();
  const { profile } = useBusinessStore();
  const [items, setItems] = useState<InvoiceItem[]>(
    draftItems.length ? draftItems : [defaultItem()]
  );
  const [discountPercent, setDiscountPercent] = useState(draftDiscountPercent);

  useEffect(() => {
    if (draftItems.length) {
      setItems(draftItems);
    }
  }, [draftItems]);

  useEffect(() => {
    setDraftItems(items);
  }, [items, setDraftItems]);

  useEffect(() => {
    setDraftDiscountPercent(discountPercent);
  }, [discountPercent, setDraftDiscountPercent]);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity * i.rate, 0),
    [items]
  );
  const discountAmount = subtotal * (discountPercent / 100);
  const total = subtotal - discountAmount;

  const updateItem = (id: string, field: keyof InvoiceItem, value: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: field === "name" ? value : Number(value) || 0
            }
          : item
      )
    );
  };

  const addItem = () => setItems((prev) => [...prev, defaultItem()]);

  const createInvoice = async () => {
    const invoice = finalizeInvoice({ items, discountPercent });
    if (!invoice || !profile) return;
    await exportInvoicePdf(invoice, profile);
    router.replace("/invoices/statuses");
  };

  return (
    <View className="flex-1 bg-surface px-6 pt-16">
      <Text className="text-3xl font-bold text-ink mb-4">Items & Discounts</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="rounded-2xl border border-slate-200 bg-white p-4 mb-4">
            <Text className="text-sm font-semibold text-muted mb-1">Item name</Text>
            <TextInput
              value={item.name}
              onChangeText={(text) => updateItem(item.id, "name", text)}
              placeholder="Service name"
              className="rounded-xl border border-slate-100 bg-surface px-3 py-2 mb-3"
            />
            <View className="flex-row gap-x-3">
              <View className="flex-1">
                <Text className="text-sm font-semibold text-muted mb-1">Qty</Text>
                <TextInput
                  value={String(item.quantity)}
                  onChangeText={(text) => updateItem(item.id, "quantity", text)}
                  keyboardType="numeric"
                  className="rounded-xl border border-slate-100 bg-surface px-3 py-2"
                />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-muted mb-1">Rate</Text>
                <TextInput
                  value={String(item.rate)}
                  onChangeText={(text) => updateItem(item.id, "rate", text)}
                  keyboardType="numeric"
                  className="rounded-xl border border-slate-100 bg-surface px-3 py-2"
                />
              </View>
            </View>
          </View>
        )}
        ListFooterComponent={
          <>
            <PrimaryButton title="Add another item" variant="ghost" onPress={addItem} />
            <View className="mt-6 rounded-2xl bg-white p-4">
              <Text className="text-sm font-semibold text-muted mb-2">Discount (%)</Text>
              <TextInput
                value={String(discountPercent)}
                onChangeText={(text) => setDiscountPercent(Number(text) || 0)}
                keyboardType="numeric"
                className="rounded-xl border border-slate-200 bg-surface px-3 py-2"
              />
              <View className="mt-4">
                <Text className="text-sm text-muted">Subtotal</Text>
                <Text className="text-2xl font-bold text-ink">${subtotal.toFixed(2)}</Text>
              </View>
              <View className="mt-2">
                <Text className="text-sm text-muted">Discount</Text>
                <Text className="text-xl font-semibold text-warning">
                  -${discountAmount.toFixed(2)}
                </Text>
              </View>
              <View className="mt-4">
                <Text className="text-sm text-muted">Total</Text>
                <Text className="text-3xl font-extrabold text-ink">${total.toFixed(2)}</Text>
              </View>
            </View>
            <View className="mt-6">
              <PrimaryButton
                title="Create invoice & export PDF"
                onPress={createInvoice}
                disabled={!draft}
              />
            </View>
          </>
        }
      />
    </View>
  );
}

import { useMemo, useState } from "react";
import { router } from "expo-router";
import { FlatList, Text, TextInput, View, Pressable } from "react-native";
import { Filter, NotebookPen, Search, CheckCircle } from "lucide-react-native";
import { useInvoiceStore } from "@/store/invoiceStore";

export default function InvoiceStatusesScreen() {
  const invoices = useInvoiceStore((state) => state.invoices);
  const markPaid = useInvoiceStore((state) => state.markPaid);
  const hydrateDraftFromInvoice = useInvoiceStore((state) => state.hydrateDraftFromInvoice);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return invoices.filter((inv) => {
      const target = `${inv.number} ${inv.client.company} ${inv.client.contactName}`.toLowerCase();
      return target.includes(query.toLowerCase());
    });
  }, [invoices, query]);

  const handleEdit = (id: string) => {
    hydrateDraftFromInvoice(id);
    router.push({ pathname: "/invoices/create", params: { invoiceId: id } });
  };

  return (
    <View className="flex-1 bg-surface px-6 pt-16">
      <Text className="text-3xl font-bold text-ink mb-6">Invoice statuses</Text>
      <View className="flex-row items-center gap-x-3 mb-4">
        <View className="flex-1 flex-row items-center rounded-2xl bg-white px-3">
          <Search color="#94A3B8" size={20} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search invoices"
            className="flex-1 px-2 py-3"
          />
        </View>
        <Pressable className="h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
          <Filter color="#2563EB" size={20} />
        </Pressable>
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="mb-4 rounded-3xl bg-white p-4 shadow-sm">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-lg font-bold text-ink">{item.number}</Text>
              <Text
                className={`text-sm font-semibold ${
                  item.status === "paid" ? "text-success" : "text-warning"
                }`}
              >
                {item.status.toUpperCase()}
              </Text>
            </View>
            <Text className="text-base text-ink">{item.client.company}</Text>
            <Text className="text-sm text-muted mb-4">{item.client.contactName}</Text>
            <View className="flex-row justify-between items-center">
              <Text className="text-2xl font-bold text-ink">${item.total.toFixed(2)}</Text>
              <View className="flex-row gap-x-2">
                <Pressable
                  onPress={() => handleEdit(item.id)}
                  className="flex-row items-center rounded-2xl bg-primary/10 px-3 py-2"
                >
                  <NotebookPen color="#2563EB" size={18} />
                  <Text className="ml-1 text-sm font-semibold text-primary">Edit</Text>
                </Pressable>
                <Pressable
                  onPress={() => markPaid(item.id)}
                  className="flex-row items-center rounded-2xl bg-success/10 px-3 py-2"
                >
                  <CheckCircle color="#10B981" size={18} />
                  <Text className="ml-1 text-sm font-semibold text-success">Paid</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

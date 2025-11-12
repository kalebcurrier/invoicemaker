import { router } from "expo-router";
import { Text, View } from "react-native";
import { useBusinessStore } from "@/store/businessStore";
import { useInvoiceStore } from "@/store/invoiceStore";
import { PrimaryButton } from "@/components/PrimaryButton";

export default function DashboardScreen() {
  const { profile } = useBusinessStore();
  const invoices = useInvoiceStore((state) => state.invoices);
  const resetCurrentFlow = useInvoiceStore((state) => state.resetCurrentFlow);
  const paidCount = invoices.filter((inv) => inv.status === "paid").length;

  const startInvoice = () => {
    resetCurrentFlow();
    router.push("/invoices/create");
  };

  return (
    <View className="flex-1 bg-surface px-6 pt-16">
      <Text className="text-sm uppercase text-muted">Dashboard</Text>
      <Text className="text-4xl font-bold text-ink">
        {profile?.businessName ?? "Your business"}
      </Text>

      <View className="mt-10 rounded-3xl bg-white p-6 shadow-sm shadow-black/5">
        <Text className="text-sm text-muted">Invoices created</Text>
        <Text className="text-3xl font-semibold text-ink">{invoices.length}</Text>
        <Text className="text-sm text-success mt-2">
          {paidCount} paid | {invoices.length - paidCount} open
        </Text>
      </View>

      <View className="mt-10 gap-y-4">
        <PrimaryButton title="Create Invoice" onPress={startInvoice} />
        <PrimaryButton
          title="Invoice Status"
          variant="ghost"
          onPress={() => router.push("/invoices/statuses")}
        />
      </View>
    </View>
  );
}

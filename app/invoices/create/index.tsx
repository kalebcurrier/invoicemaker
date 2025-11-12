import { View, Text } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "@/components/FormField";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useInvoiceStore } from "@/store/invoiceStore";

const schema = z.object({
  company: z.string().min(2, "Company name required"),
  contactName: z.string().min(2, "Contact required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(8, "Phone required"),
  address: z.string().min(5, "Address required"),
  dueDate: z.string(),
  notes: z.string().optional()
});

type Values = z.infer<typeof schema>;

export default function InvoiceClientScreen() {
  const params = useLocalSearchParams<{ invoiceId?: string }>();
  const { draft, setDraft, hydrateDraftFromInvoice } = useInvoiceStore();

  useEffect(() => {
    if (params?.invoiceId) {
      hydrateDraftFromInvoice(params.invoiceId);
    }
  }, [params?.invoiceId, hydrateDraftFromInvoice]);

  const { control, handleSubmit, reset } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: draft
      ? {
          company: draft.client.company,
          contactName: draft.client.contactName,
          email: draft.client.email,
          phone: draft.client.phone,
          address: draft.client.address,
          dueDate: draft.dueDate,
          notes: draft.notes ?? ""
        }
      : {
          company: "",
          contactName: "",
          email: "",
          phone: "",
          address: "",
          dueDate: dayjs().add(7, "day").format("YYYY-MM-DD"),
          notes: ""
        }
  });

  useEffect(() => {
    if (draft) {
      reset({
        company: draft.client.company,
        contactName: draft.client.contactName,
        email: draft.client.email,
        phone: draft.client.phone,
        address: draft.client.address,
        dueDate: draft.dueDate,
        notes: draft.notes ?? ""
      });
    }
  }, [draft, reset]);

  const onSubmit = (values: Values) => {
    setDraft({
      client: {
        company: values.company,
        contactName: values.contactName,
        email: values.email,
        phone: values.phone,
        address: values.address
      },
      currency: "USD",
      dueDate: values.dueDate,
      notes: values.notes
    });
    router.push("/invoices/create/items");
  };

  return (
    <View className="flex-1 bg-surface px-6 pt-16">
      <Text className="text-sm text-muted uppercase">Invoice</Text>
      <Text className="text-3xl font-bold text-ink mb-8">Client details</Text>
      <FormField control={control} name="company" label="Client Company" />
      <FormField control={control} name="contactName" label="Contact Name" />
      <FormField control={control} name="email" label="Email" keyboardType="email-address" />
      <FormField control={control} name="phone" label="Phone" keyboardType="phone-pad" />
      <FormField control={control} name="address" label="Address" multiline />
      <FormField control={control} name="dueDate" label="Due Date (YYYY-MM-DD)" />
      <FormField control={control} name="notes" label="Notes" multiline />
      <PrimaryButton title="Next: Items" onPress={handleSubmit(onSubmit)} />
    </View>
  );
}

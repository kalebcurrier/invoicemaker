import { View, Text } from "react-native";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { FormField } from "@/components/FormField";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useBusinessStore } from "@/store/businessStore";

const schema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(10, "Phone number is required")
});

type FormValues = z.infer<typeof schema>;

export default function BusinessInfoScreen() {
  const { profile, setProfile } = useBusinessStore();
  const { control, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: profile ?? {
      businessName: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: ""
    }
  });

  const onSubmit = (values: FormValues) => {
    setProfile(values);
    router.push("/logo-upload");
  };

  return (
    <View className="flex-1 bg-surface px-6 pt-24">
      <Text className="text-4xl font-bold text-ink mb-2">Welcome back</Text>
      <Text className="text-base text-muted mb-8">
        Let’s gather your business information so invoices look perfect.
      </Text>
      <FormField
        control={control}
        name="businessName"
        label="Business Name"
        placeholder="Skyline Electric"
      />
      <FormField control={control} name="firstName" label="First Name" placeholder="Jordan" />
      <FormField control={control} name="lastName" label="Last Name" placeholder="Reeves" />
      <FormField
        control={control}
        name="email"
        label="Business Email"
        placeholder="billing@skyline.com"
        keyboardType="email-address"
      />
      <FormField
        control={control}
        name="phone"
        label="Business Phone"
        placeholder="+1 (222) 123-4567"
        keyboardType="phone-pad"
      />
      <PrimaryButton title="Next" onPress={handleSubmit(onSubmit)} />
    </View>
  );
}

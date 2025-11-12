import { Controller, Control } from "react-hook-form";
import { Text, TextInput, View } from "react-native";

interface Props {
  control: Control<any>;
  name: string;
  label: string;
  placeholder?: string;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  multiline?: boolean;
}

export function FormField({ control, name, label, placeholder, keyboardType, multiline }: Props) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState }) => (
        <View className="mb-4">
          <Text className="text-xs font-semibold text-muted mb-1">{label}</Text>
          <TextInput
            value={value}
            onChangeText={onChange}
            placeholder={placeholder}
            keyboardType={keyboardType}
            multiline={multiline}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-ink"
          />
          {fieldState.error && (
            <Text className="mt-1 text-xs text-warning">{fieldState.error.message}</Text>
          )}
        </View>
      )}
    />
  );
}

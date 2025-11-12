import { Pressable, Text } from "react-native";
import clsx from "clsx";

interface Props {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
}

export function PrimaryButton({ title, onPress, variant = "primary", disabled }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={clsx(
        "w-full rounded-2xl py-4",
        variant === "primary" && "bg-primary",
        variant === "secondary" && "bg-ink",
        variant === "ghost" && "border border-slate-200",
        disabled && "opacity-50"
      )}
    >
      <Text
        className={clsx(
          "text-center text-base font-semibold",
          variant === "ghost" ? "text-ink" : "text-white"
        )}
      >
        {title}
      </Text>
    </Pressable>
  );
}

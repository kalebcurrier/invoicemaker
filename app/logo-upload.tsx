import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { Image, Text, View } from "react-native";
import { useState } from "react";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useBusinessStore } from "@/store/businessStore";

export default function LogoUploadScreen() {
  const { profile, updateLogo } = useBusinessStore();
  const [preview, setPreview] = useState(profile?.logoUri);

  const pickLogo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setPreview(uri);
      updateLogo(uri);
    }
  };

  return (
    <View className="flex-1 bg-surface px-6 pt-24">
      <Text className="text-4xl font-bold text-ink mb-2">Brand it</Text>
      <Text className="text-base text-muted mb-8">
        Upload your business logo so every invoice feels professional.
      </Text>
      <View className="items-center mb-10">
        {preview ? (
          <Image source={{ uri: preview }} className="h-40 w-40 rounded-3xl" resizeMode="cover" />
        ) : (
          <View className="h-40 w-40 rounded-3xl border-2 border-dashed border-slate-300 items-center justify-center">
            <Text className="text-muted text-center px-4">Tap upload to add your logo</Text>
          </View>
        )}
      </View>
      <PrimaryButton title="Upload from Photos" onPress={pickLogo} />
      <View className="h-3" />
      <PrimaryButton
        title="Continue to dashboard"
        variant="secondary"
        onPress={() => router.replace("/dashboard")}
      />
    </View>
  );
}

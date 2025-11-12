import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface BusinessProfile {
  businessName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  logoUri?: string;
}

interface BusinessStore {
  profile?: BusinessProfile;
  setProfile: (profile: BusinessProfile) => void;
  updateLogo: (logoUri: string) => void;
}

export const useBusinessStore = create<BusinessStore>()(
  persist(
    (set, get) => ({
      profile: undefined,
      setProfile: (profile) => set({ profile }),
      updateLogo: (logoUri) => {
        const profile = get().profile;
        if (!profile) return;
        set({ profile: { ...profile, logoUri } });
      }
    }),
    {
      name: "business-store",
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);

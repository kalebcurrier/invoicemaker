# InvoiceMaker

A cross-platform (iOS / Android / Web) Expo app that helps small contractors collect business details, capture client + item information, generate invoices with discounts, track statuses, and export polished PDFs.

## Features
- Business onboarding flow with logo upload (Image Picker)
- Modern dashboard with quick actions for creating invoices or checking status
- Guided invoice creation: client details -> line items -> discounts + totals
- Zustand-powered persistence for business profile, drafts, and invoice history
- Invoice list with search, filter button placeholder, edit + mark-paid actions
- Instant PDF export via Expo Print + Sharing APIs

## Getting Started
1. Install dependencies: `npm install`
2. Start the Expo dev server: `npx expo start`
3. Press `i` for iOS simulator, `a` for Android, or `w` for web. Scan the QR code with Expo Go on a device to test on hardware.

## Tech Stack
- Expo Router + React Native 0.74
- NativeWind + TailwindCSS for 2025-ready design language
- React Hook Form + Zod validation
- Zustand (persisted via AsyncStorage) for business + invoice data
- Expo Image Picker / Print / Sharing for logo capture and PDF export
- TypeScript end-to-end

## Project Structure
```
app/
  _layout.tsx        # Router stack
  index.tsx          # Business onboarding
  logo-upload.tsx
  dashboard.tsx
  invoices/
    create/index.tsx # Client form
    create/items.tsx # Line items + discounts
    statuses.tsx     # List + search + actions
src/
  components/
  store/
  utils/
  theme/
```

## Next Steps
- Replace placeholder icons/splash art under `assets/`
- Add automated tests for stores/utilities (Jest + RNTL)
- Wire up real filtering logic and sorting on statuses screen
- Connect to cloud sync/auth (Supabase, Firebase, etc.) if multi-device access is required

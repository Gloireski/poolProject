# PoolProject (Frontend)

React Native app (Expo) using Redux Toolkit, NativeWind (Tailwind), navigation, camera/media/location, and SecureStore-based auth.

## Prerequisites
- Node 18+
- Xcode (iOS) and/or Android Studio (Android)
- Yarn or npm

## Install
```bash
# from poolProject/
yarn install
# or
npm install
```

## Environment / API base URL
`src/services/api.ts` resolves the LAN host via Expo `Constants`. Fallback is `192.168.1.31`.
- If requests fail, set your machine LAN IP in `resolveHost()`.
- Base URL: `http://<LAN-IP>:3001/api`.

Ensure your device/emulator can reach your laptop’s IP and that the backend has CORS enabled.

## Run
```bash
# Start Metro (development)
yarn start

# Run native (requires toolchains)
yarn ios

yarn android

# Web preview
yarn web
```

## Features
- Redux Toolkit + React Redux
- Axios client with `Authorization: Bearer <token>` from Expo SecureStore
- React Navigation (stack/tabs)
- Expo Camera, Image Picker, Media Library, Location
- Tailwind via NativeWind

## Structure
```
src/
  components/   # UI primitives (Button, Card, Input, ...)
  screens/      # Screens (Auth, Calendar, Photos, Profile, ...)
  navigation/   # Navigator setup
  services/     # Axios instance and domain services
  store/        # Redux store and slices
  theme/styles/ # Tailwind & theme helpers
  types/utils/  # Shared types & utilities
```

## Troubleshooting
- Can’t reach backend: verify LAN IP, firewall, and update `resolveHost()` in `src/services/api.ts`.
- iOS device: same Wi‑Fi as computer.
- Android emulator: `10.0.2.2` maps to host (consider hardcoding for debugging).

## Scripts
- `yarn start` — Expo bundler
- `yarn ios` — Run iOS
- `yarn android` — Run Android
- `yarn web` — Web preview

## License
Private student project.

require('dotenv').config();

/**
 * Dynamic Expo config to inject secrets from .env
 * Usage: define GOOGLE_MAPS_API_KEY (and optionally GOOGLE_MAPS_IOS_API_KEY) in .env
 */
module.exports = ({ config }) => {
  const androidKey = process.env.GOOGLE_MAPS_API_KEY || '';
  const iosKey = process.env.GOOGLE_MAPS_IOS_API_KEY || androidKey;

  return {
    ...config,
    android: {
      ...(config.android || {}),
      config: {
        ...((config.android && config.android.config) || {}),
        googleMaps: {
          apiKey: androidKey,
        },
      },
    },
    ios: {
      ...(config.ios || {}),
      config: {
        ...((config.ios && config.ios.config) || {}),
        googleMapsApiKey: iosKey,
      },
      infoPlist: {
        ...((config.ios && config.ios.infoPlist) || {}),
        NSCameraUsageDescription:
          'This app uses the camera to capture photos for your travel journal.',
        NSPhotoLibraryAddUsageDescription:
          'This app saves captured photos to your library and uploads them to your gallery.',
        NSPhotoLibraryUsageDescription:
          'This app needs access to your photo library to pick and save photos.',
      },
    },
  };
};

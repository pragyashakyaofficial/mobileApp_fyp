import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation, { GeolocationResponse } from '@react-native-community/geolocation';

const requestLocationPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location for live tracking.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  } else {
    // iOS permission handling is different and often managed via Info.plist
    return true;
  }
};

const watchLocation = (onLocationUpdate: (position: GeolocationResponse) => void) => {
  const watchId = Geolocation.watchPosition(
    onLocationUpdate,
    error => console.log(error),
    { enableHighAccuracy: true, distanceFilter: 10 },
  );
  return watchId;
};

const clearWatch = (watchId: number) => {
  Geolocation.clearWatch(watchId);
};

export const locationService = {
  requestLocationPermission,
  watchLocation,
  clearWatch,
};

import { useState, useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { locationService } from '@services/locationService';
import { useUpdateLocationMutation } from '@features/location/locationApiSlice';

export const useLocationTracking = (isTrackingEnabled: boolean) => {
  const [updateLocation] = useUpdateLocationMutation();
  const watchId = useRef<number | null>(null);

  useEffect(() => {
    const startTracking = async () => {
      const hasPermission = await locationService.requestLocationPermission();
      if (hasPermission) {
        watchId.current = locationService.watchLocation(position => {
          const { latitude, longitude } = position.coords;
          updateLocation({ latitude, longitude });
        });
      }
    };

    const stopTracking = () => {
      if (watchId.current !== null) {
        locationService.clearWatch(watchId.current);
        watchId.current = null;
      }
    };

    if (isTrackingEnabled) {
      startTracking();
    } else {
      stopTracking();
    }

    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState !== 'active') {
        stopTracking();
      } else if (isTrackingEnabled) {
        startTracking();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      stopTracking();
      subscription.remove();
    };
  }, [isTrackingEnabled, updateLocation]);
};

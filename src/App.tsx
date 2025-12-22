import React, { useEffect, useState } from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { store } from '@app/store';
import MainNavigator from '@navigation/MainNavigator';
import { setCredentials } from '@features/auth/authSlice';
import { User } from '@types';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const rehydrateAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const userString = await AsyncStorage.getItem('user');

        if (token && userString) {
          const user: User = JSON.parse(userString);
          store.dispatch(setCredentials({ token, user }));
        }
      } catch (e) {
        console.error('Failed to rehydrate auth state from storage', e);
      } finally {
        setIsLoading(false);
      }
    };

    rehydrateAuth();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <StoreProvider store={store}>
      <PaperProvider>
        <NavigationContainer>
          <MainNavigator />
        </NavigationContainer>
      </PaperProvider>
    </StoreProvider>
  );
};

export default App;

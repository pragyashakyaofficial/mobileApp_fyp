import React, { useEffect } from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from 'styled-components/native';
import BootSplash from 'react-native-bootsplash';
import { store } from '@app/store';
import MainNavigator from '@navigation/MainNavigator';
import { theme } from '@constants/theme';

const App = () => {
  useEffect(() => {
    const init = async () => {
      await BootSplash.hide({ fade: true });
    };
    init();
  }, []);

  return (
    <StoreProvider store={store}>
      <ThemeProvider theme={theme}>
        <PaperProvider theme={theme}>
          <NavigationContainer>
            <MainNavigator />
          </NavigationContainer>
        </PaperProvider>
      </ThemeProvider>
    </StoreProvider>
  );
};

export default App;
import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import LoginScreen from '../LoginScreen';

// Mock Redux store
const store = configureStore({
  reducer: {
    // Add mock reducers if needed
  },
});

describe('LoginScreen', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <Provider store={store}>
        <LoginScreen />
      </Provider>,
    );
    expect(getByText('Login')).toBeTruthy();
  });
});

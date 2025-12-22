import 'react-native-paper';
import { theme } from '@constants/theme';

declare global {
  namespace ReactNativePaper {
    type CustomTheme = typeof theme;
    interface Theme extends CustomTheme {}
  }
}

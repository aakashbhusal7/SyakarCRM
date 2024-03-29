import {DefaultTheme} from 'react-native-paper';
import colors from '../Colors';

const theme = {
  ...DefaultTheme,
  dark: false,
  id: 2,
  roundness: 7,
  colors: {
    ...DefaultTheme.colors,
    primary: '#e62709',
    accent: '#ffa630',
    background: '#F1F7ED',
    text: colors.panegrey,
    placeholder: colors.ashgrey,
    header: '#e0180d',
    headerTitle: colors.white,

    //react-native-paper theme colors
    surface: colors.white,
    primaryText: colors.darkgunmetal,
  },
};

export default theme;

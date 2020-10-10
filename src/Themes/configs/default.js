import {DefaultTheme} from 'react-native-paper';
import colors from '../Colors';

const theme = {
  ...DefaultTheme,
  id: 1,
  dark: false,
  roundness: 7,
  colors: {
    ...DefaultTheme.colors,
    primary: '#ED1B2E',
    accent: '#a5be00',
    qualify:'#6665DD',
    background: colors.issabeline,
    text: colors.panegrey,
    placeholder: colors.ashgrey,
    header: '#5c80bc',
    headerTitle: colors.white,

    //react-native-paper theme colors
    surface: colors.white,
    primaryText: colors.darkgunmetal,
  },
};

export default theme;

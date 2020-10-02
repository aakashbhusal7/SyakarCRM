import * as React from 'react';
import { Button, View,Text,Image } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import defaultTheme from '../../Themes';
import Fonts from '../../Themes/Fonts';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { HeaderButton } from '../../Components';
import theme from '../../Themes/configs/default';
import { ICON_TYPE } from '../../Icons';

const MainScreen=({ routes,navigation })=> {
  navigation.openDrawer();
 

  React.useEffect(() => {
    const _toggleDrawer = () => {
      navigation.toggleDrawer();
    };

    console.log('use effect home');

    navigation.setOptions({
      headerLeft: () => {
        return (
          <View style={{marginLeft: 10}}>
            <HeaderButton
              icon="menuunfold"
              color={theme.colors.headerTitle}
              iconOrigin={ICON_TYPE.ANT_ICON}
              onPress={_toggleDrawer}
            />
          </View>
        );
      },
    });
  }, [navigation, theme.colors.headerTitle]);
// function NotificationsScreen({ navigation }) {
//   return (
//     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//       <Button onPress={() => navigation.goBack()} title="Go back home" />
//     </View>
//   );
// }

const Drawer = createDrawerNavigator();


  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
   
   
     <Text>Dashboard Screen</Text>
    </View>
    
   
  );
  }

export default MainScreen;
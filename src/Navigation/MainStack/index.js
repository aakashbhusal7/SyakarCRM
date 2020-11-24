/* eslint-disable react-native/no-inline-styles */
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { useStoreState } from 'easy-peasy';
import React from 'react';
import DrawerScreen from '../../Screens/Drawer';
import metrics from '../../Themes/Metrics';
import Routes from '../Routes';
import BottomStack from './BottomStack';
import MainStack from './MainStack';


const Drawer = createDrawerNavigator();


export default props => {
  const { username, password } = useStoreState((state) => ({
    username: state.login.username,
    password: state.login.password,
  }));

  return (
    <NavigationContainer independent={true}>

      <Drawer.Navigator


        drawerPosition={'left'}
        drawerType="slide"
        edgeWidth={10}
        drawerStyle={{
          backgroundColor: '#fafafa',
          width: metrics.drawerWidth,
        }}
        drawerContent={props => <DrawerScreen {...props} />}
        drawerContentOptions={username}
      >
        <Drawer.Screen name="Home Drawer" component={BottomStack}/>
        <Drawer.Screen name={Routes.HOME_STACK} component={MainStack} />

        {/* <Drawer.Screen name={Routes.LEAD_LIST_SCREEN} component={LeadStack} />
        <Drawer.Screen name={Routes.OPPORTUNITY_SCREEN} component={OpportunityStack} /> */}
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

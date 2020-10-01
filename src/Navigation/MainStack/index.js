/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Routes from '../Routes';
import MainStack from './MainStack';
import DrawerScreen from '../../Screens/Drawer';
import metrics from '../../Themes/Metrics';
import LeadForm from '../../Screens/Lead/LeadForm';
import Login from '../../Screens/Login';
import { useStoreState } from 'easy-peasy';

const Drawer = createDrawerNavigator();



export default props => {
  const {username, password} = useStoreState((state) => ({
    username: state.login.username,
    password: state.login.password,
  }));

  return (
    <Drawer.Navigator
    
      drawerPosition={'left'}
      drawerType="slide"
      edgeWidth={10}
      data="a"
      drawerStyle={{
        backgroundColor: '#fafafa',
        width: metrics.drawerWidth,
      }}
      drawerContent={props=><DrawerScreen {...props} />}
      drawerContentOptions={username}
      >
      <Drawer.Screen name={Routes.HOME_STACK} component={MainStack} />
      <Drawer.Screen name={Routes.LEAD_SCREEN}component={LeadForm}/>
    </Drawer.Navigator>
  );
};

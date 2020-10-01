import React from 'react';
import Login from '../Screens/Login';
import {createStackNavigator} from '@react-navigation/stack';
import Routes from './Routes';
import AppIntro from '../Screens/AppIntro';
import SplashScreen from '../Screens/AppIntro';
import Signup from '../Screens/Signup';
import SetPassword from '../Screens/SetPassword';

const Stack = createStackNavigator();

export default props => {
  return (
    <Stack.Navigator headerMode="none" >
     <Stack.Screen name={Routes.APP_INTRO} component={AppIntro} />
      <Stack.Screen name={Routes.LOGIN_SCREEN} component={Login} />
      <Stack.Screen name={Routes.SIGNUP_SCREEN}component={Signup}/>
      <Stack.Screen name={Routes.PASSWORD_SETUP_SCREEN}component={SetPassword}/>
     
    </Stack.Navigator>
  );
};

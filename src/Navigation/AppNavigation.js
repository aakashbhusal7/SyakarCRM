import { NavigationContainer } from '@react-navigation/native';
import { navigationRef, isMountedRef } from './index';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Routes from './Routes';
import LaunchScreen from '../Screens/Launch';
// Screens Objects
import LoginStack from './LoginStack';
import MainStack from './MainStack';
import { useAppContext } from '../Services/Auth/AppContext';
import { APP_STATE } from '../Constants';
import LeadForm from '../Screens/Lead/LeadForm';
import BottomStack from './MainStack/BottomStack';
import { TokenContext } from '../TokenProvider'
import { TokenProvider } from '../Screens/App/TokenProvider';
import { AuthContext } from '../Components/context';
import AsyncStorage from '@react-native-community/async-storage';

export default function RootNavigation(props) {
  React.useEffect(() => {
    isMountedRef.current = true;
    return () => (isMountedRef.current = false);
  }, []);
  const tokenStore = React.useContext(TokenContext);
  //const [userToken, setUserToken] = React.useState(null);
  const [isLogin, setIsLogin] = React.useState(false);
  const { state } = useAppContext();
  console.log("token state is", tokenStore);

  const initialLoginState = {
    userName: null,
    userToken: null,
  };

  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          userToken: action.token,

        };
      case 'LOGIN':
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,

        };
      case 'LOGOUT':
        return {
          ...prevState,
          userName: null,
          userToken: null,

        };
      case 'REGISTER':
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
        };
    }
  };

  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);

  const authContext = React.useMemo(() => ({
    signIn: async (token) => {

      const userToken = token;
      try {
        await AsyncStorage.setItem('userToken', userToken);
      } catch (e) {
        console.log(e);
      }

      dispatch({ type: 'LOGIN', id: "aa", token: userToken });
    },
    signOut: async () => {
      const userToken = null;
      try {
        await AsyncStorage.removeItem('userToken');
      } catch (e) {
        console.log(e);
      }
      dispatch({ type: 'LOGOUT' });
    },

    signUp: () => {
      //setUserToken("aaa");
    }
  }), []);

  React.useEffect(() => {
    setTimeout(async () => {
      // setIsLoading(false);
      let userToken;
      userToken = null;
      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        console.log(e);
      }
      // console.log('user token: ', userToken);
      dispatch({ type: 'RETRIEVE_TOKEN', token: userToken });
    }, 1000);
  }, []);

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer ref={navigationRef}>

        <Stack.Navigator headerMode="none">

          {loginState.userToken!==null ? (
            <Stack.Screen name={Routes.MAIN_APP} component={MainStack}
              options={{
                title: 'MENU',
                headerStyle: {
                  backgroundColor: '#f4511e',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            />

          ) :

            <Stack.Screen name={Routes.LOGIN_STACK} component={LoginStack} />
          }


        </Stack.Navigator>


      </NavigationContainer >
    </AuthContext.Provider>
  );
}

const Stack = createStackNavigator();

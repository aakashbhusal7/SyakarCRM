/* eslint-disable react-native/no-inline-styles */
import React, { useRef, useState } from 'react';
import { Text, Keyboard, Image, StyleSheet } from 'react-native';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { STATUS } from '../../Constants';
import LoadingActionContainer from '../../Components/LoadingActionContainer';
import {
  Section,
  Container,
  PasswordInputX,
  InputX,
  ButtonX,
} from '../../Components';

import useAppTheme from '../../Themes/Context';
import useAuth from '../../Services/Auth';
import { showErrorToast, showInfoToast } from '../../Lib/Toast';
import BottomPanel from '../../Components/Panel';
import useTranslation from '../../i18n';
import Fonts from '../../Themes/Fonts';
import { View } from 'react-native-animatable';
import { ThemeProvider, useNavigation } from '@react-navigation/native';
import defaultTheme from '../../Themes';
import colors from '../../Themes/Colors';
import Routes from '../../Navigation/Routes';
import { BASE_URL, TOKEN_URL, CONTACTS_ENDPOINT } from 'react-native-dotenv';
import AsyncStorage from '@react-native-community/async-storage';
import { element } from 'prop-types';
import { TokenContext } from '../App/TokenProvider';
import AnimatedLoader from "react-native-animated-loader";

var dataList = [];

export default () => {
  const onChange = useStoreActions(actions => actions.login.onLoginInputChange);
  const { t } = useTranslation();
  //const {login} = useAuth();
  const { theme } = useAppTheme();
  const navigation = useNavigation();

  const inputUserName = useRef();
  const inputPassword = useRef();

  const tokenStore = React.useContext(TokenContext);

  const panelRef = useRef();
  const [data, setData] = useState();

  const onSubmit = () => {
    inputPassword.current.focus();
  };
  const { username, password, status } = useStoreState(state => ({
    username: state.login.username,
    password: state.login.password,
    status: state.login.status,
  }));
  const[load,setLoad]=React.useState(false);
  const usernameGlobal = React.createContext(username);
  const token = React.useContext(TokenContext)

  const loginUser = () => {
    Keyboard.dismiss();

    if (!username || !password) {
      showInfoToast('Username and password are mandatory, try again !');
    }
    else {

      login({
        username,
        password,
      });
    }
  };

  let details = {
    'client_id': '857ea913-8527-4604-97ef-2b315dfc2c5e',
    'Resource': 'https://syakarhonda.crm5.dynamics.com',
    'Grant_type': 'client_credentials',
    'Client_secret': 'Kx~CYNRrc_GCupCh.Q~Q-545Ym_xf4l39E'
  };
  let formBody = [];
  for (let property in details) {
    let encodedKey = encodeURIComponent(property);
    let encodedValue = encodeURIComponent(details[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");

  const login = (props) => {
    fetch(TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formBody
    }).then((response) => response.json())
      .then((responseData) => {
        { storeToken(responseData.access_token, props.username) }
        console.log("Response data is" + responseData.access_token);
        { stepToSignIn(responseData.access_token, props) }
      })
  }

  const storeToken = async (token, username) => {
    try {
      await AsyncStorage.setItem('@token_key', token);
      await AsyncStorage.setItem('@username', username);

    } catch (e) {

      showInfoToast(e)
    }
  }

  const stepToSignIn = (token, otherProps) => {
    setLoad(true);
    fetch(BASE_URL + CONTACTS_ENDPOINT, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }

    }).then((response) => response.json())
      .then((responseJson) => {
        responseJson.value.forEach(items => dataList.push(items))
        dataList.push(responseJson.value);
        console.log("Data is", dataList[0].firstname);
        { checkAuth(otherProps) }
      })
  }

  const storeContactId = async (value) => {
    try {
      await AsyncStorage.setItem('@contactId', value);
    } catch (e) {
      console.log("error", e);
    }
  }
  const checkAuth = (props) => {
    let contains = false;
    console.log("props is", props.username);
    const finalData = dataList.map(item => item.firstname + item.agile_password).find(item => item === props.username + props.password)
    dataList.filter(item => item.firstname + item.agile_password === props.username + props.password).map((value) => { storeContactId(value.contactid) });
    console.log("final data is ", finalData);


    if (finalData === props.username + props.password) {
      setLoad(false);
      navigation.navigate(Routes.MAIN_APP, { username: username })
    }
    else {
      setLoad(false);
      showErrorToast("Wrong Credentials!! Please Try Again");
    }
    console.log(finalData)


    console.log(contains);


  }
  const loading = status === STATUS.FETCHING;

  return (
    <Container bg="red">
      {load &&
      
        <AnimatedLoader
          visible={true}
          overlayColor="transparent"
          source={require("../../../loader.json")}
          animationStyle={styles.lottie}
          speed={1}
        />
        
      }
      {!load &&
        <LoadingActionContainer>
          <View style={{ marginTop: 40, justifyContent: 'center', alignSelf: 'center' }}>
            <Image
              style={{ height: 12, width: 150, padding: 16, marginTop: 36 }}
              source={require('../../../assets/app_logo.png')}
            />

          </View>
          <View style={{ marginTop: 24 }}>
            <Section>
              <InputX
                label="USER NAME"
                // mode="outlined"
                ref={inputUserName}
                style={{ backgroundColor: '#fafafa' }}
                autoCapitalize="none"
                returnKeyType={'next'}
                onSubmitEditing={onSubmit}
                onChangeText={text =>
                  onChange({
                    key: 'username',
                    value: text,
                  })
                }
                value={username}
              />
              <PasswordInputX
                ref={inputPassword}
                value={password}
                // mode="outlined"
                style={{ backgroundColor: '#fafafa' }}
                label="PASSWORD"
                returnKeyType={'go'}
                onSubmitEditing={loginUser}
                onChangeText={text =>
                  onChange({
                    key: 'password',
                    value: text,
                  })
                }
              />
            </Section>
          </View>
          <Section>
            <ButtonX
              loading={loading}
              dark={true}
              style={styles.ovalButton}
              color={loading ? "#ED1B2E" : defaultTheme.colors.primary}
              onPress={loginUser}
              label={t('login')}
            />
            <Text style={{
              justifyContent: 'center',
              alignSelf: 'center',
              marginTop: 16,
              fontFamily: Fonts.type.bold,
              color: defaultTheme.colors.primary

            }}>Or</Text>
            <View style={{ marginTop: -16 }}>

              <ButtonX
                color={colors.black}

                mode={'text'}
                onPress={() => navigation.navigate(Routes.SIGNUP_SCREEN)}
                label=" SIGN UP "
              />
            </View>
          </Section>
        </LoadingActionContainer>
      }

      <BottomPanel ref={panelRef} />
    </Container>
  );
};
const styles = StyleSheet.create({
  ovalButton: {
    borderRadius: 24
  },
  lottie: {
    
    width: 100,
    height: 100
  },
})
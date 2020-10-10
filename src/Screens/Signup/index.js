/* eslint-disable react-native/no-inline-styles */
import React, { useRef } from 'react';
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
import { showInfoToast } from '../../Lib/Toast';
import BottomPanel from '../../Components/Panel';
import useTranslation from '../../i18n';
import Fonts from '../../Themes/Fonts';
import { View } from 'react-native-animatable';
import { ThemeProvider, useNavigation } from '@react-navigation/native';
import defaultTheme from '../../Themes';
import colors from '../../Themes/Colors';
import { BASE_URL, TOKEN_URL, CONTACTS_ENDPOINT } from 'react-native-dotenv';
import AsyncStorage from '@react-native-community/async-storage';
import Routes from '../../Navigation/Routes';

export default () => {
  const onChange = useStoreActions(actions => actions.login.onLoginInputChange);
  const { t } = useTranslation();
  const { login } = useAuth();
  const { theme } = useAppTheme();
  const navigation = useNavigation();

  const inputUserName = useRef();
  const inputPhoneNumber = useRef();

  const panelRef = useRef();

  const onSubmit = () => {
    inputPhoneNumber.current.focus();
  };

  const { username, phoneNumber, status } = useStoreState(state => ({
    username: state.login.username,
    phoneNumber: state.login.phoneNumber,
    status: state.login.status,
  }));

  const signupUser = () => {
    Keyboard.dismiss();

    if (!username || !phoneNumber) {
      showInfoToast('Username and phone number are mandatory, try again !');
    } else {
      signup({
        username,
        phoneNumber,
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

  const signup = (username, phoneNumber) => {
    let credentials = [username.username, username.phoneNumber];
    console.log("credentials are ", credentials);
    fetch(TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formBody
    }).then((response) => response.json())
      .then((responseData) => {
        { storeToken(responseData.access_token) }
        console.log("Response data is" + responseData.access_token);
        { stepToSignup(responseData.access_token, credentials) }
      })
  }

  const storeToken = async (token) => {
    try {
      await AsyncStorage.setItem('@token_key', token);

    } catch (e) {

      showInfoToast(e)
    }
  }

  const stepToSignup = (token, credentials) => {
    let [username, phoneNumber] = credentials
    console.log("other props is", phoneNumber);
    fetch(BASE_URL + CONTACTS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstname: username,
        mobilephone: phoneNumber
      })
    }).then((response) => {
      if (response.status === 204) {
        console.log("response url is", response.headers.map.location);
        if (response.headers.map.location !== undefined) {
          navigation.navigate(Routes.PASSWORD_SETUP_SCREEN, { username: username, phoneNumber: phoneNumber, url: response.headers.map.location })
        }
      }
    })


  }

  const loading = status === STATUS.FETCHING;

  return (
    <Container>
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
              label="Full Name"
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
            <InputX
              ref={inputPhoneNumber}

              // mode="outlined"
              style={{ backgroundColor: '#fafafa' }}
              label="Phone Number"
              returnKeyType={'go'}
              onSubmitEditing={signupUser}
              onChangeText={text =>
                onChange({
                  key: 'phoneNumber',
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
            onPress={signupUser}
            label={t('sign up')}
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
              onPress={() =>navigation.navigate(Routes.LOGIN_SCREEN)}
              label=" SIGN IN "
            />
          </View>
        </Section>
      </LoadingActionContainer>

      <BottomPanel ref={panelRef} />
    </Container>
  );
};
const styles = StyleSheet.create({
  ovalButton: {
    borderRadius: 24
  }
})
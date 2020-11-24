/* eslint-disable react-native/no-inline-styles */
import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useStoreActions, useStoreState } from 'easy-peasy';
import React, { useRef, useState } from 'react';
import { Image, Keyboard, StyleSheet } from 'react-native';
import { View } from 'react-native-animatable';
import {
  ButtonX, Container,
  PasswordInputX, Section
} from '../../Components';
import LoadingActionContainer from '../../Components/LoadingActionContainer';
import BottomPanel from '../../Components/Panel';
import { STATUS } from '../../Constants';
import useTranslation from '../../i18n';
import { showErrorToast, showInfoToast, showSuccessToast } from '../../Lib/Toast';
import Routes from '../../Navigation/Routes';
import useAuth from '../../Services/Auth';
import defaultTheme from '../../Themes';
import useAppTheme from '../../Themes/Context';


var dataList = [];

export default () => {
  const onChange = useStoreActions(actions => actions.login.onLoginInputChange);
  const { t } = useTranslation();
  const { login } = useAuth();
  const { theme } = useAppTheme();
  const navigation = useNavigation();
  const [token, setToken] = useState();

  const inputConfirmPassword = useRef();
  const inputPassword = useRef();

  const panelRef = useRef();
  const route = useRoute();
  let username = '';
  let phoneNumber = '';

  const [passedUrl, setPassedUrl] = React.useState('');

  if (route.params !== undefined) {
    username = route.params.username;
    phoneNumber = route.params.phoneNumber;
  }

  React.useEffect(() => {
    _retrieveToken();
    storePassedUrl();
  }, [])

  const storePassedUrl = async () => {
    setPassedUrl(route.params.url);
  }

  const _retrieveToken = async () => {
    try {
      const value = await AsyncStorage.getItem('@token_key');
      if (value !== null) {
        setToken(value);
      }
    } catch (error) {
    }
  };


  const onSubmit = () => {
    inputConfirmPassword.current.focus();
  };

  const { initialPassword, confirmPassword, status } = useStoreState(state => ({
    initialPassword: state.login.initialPassword,
    confirmPassword: state.login.confirmPassword,
    status: state.login.status,
  }));

  const changePassword = () => {
    Keyboard.dismiss();

    if (!initialPassword || !confirmPassword) {
      showInfoToast('password setup is mandatory, try again !');
    }
    else if (initialPassword !== confirmPassword) {
      showInfoToast('Passwords do not match !');
    }
    else {
      modifyPassword({
        initialPassword
      });
    }
  };
  const modifyPassword = (password) => {
    fetch(passedUrl, {
      method: 'PATCH',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agile_password: password.initialPassword
      })

    }).then((response) => {
      if (response.ok) {
        showSuccessToast("Successfully setup password")
        navigation.navigate(Routes.LOGIN_SCREEN)
      }
      else {
        showErrorToast(response.body);
      }

    }).catch((error) => {
      showErrorToast(response.body);
      console.log("error is", error);
    });
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
            <PasswordInputX
              label="New Password"
              // mode="outlined"
              ref={inputPassword}
              style={{ backgroundColor: '#fafafa' }}
              returnKeyType={'next'}
              onSubmitEditing={onSubmit}
              onChangeText={text =>
                onChange({
                  key: 'initialPassword',
                  value: text,
                })
              }
              value={initialPassword}
            />
            <PasswordInputX
              ref={inputConfirmPassword}
              value={confirmPassword}
              // mode="outlined"
              style={{ backgroundColor: '#fafafa' }}
              label="Confirm Password"
              returnKeyType={'go'}
              onSubmitEditing={changePassword}
              onChangeText={text =>
                onChange({
                  key: 'confirmPassword',
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
            onPress={changePassword}
            label={t('change password')}
          />


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
/* eslint-disable react-native/no-inline-styles */
import React, {useRef,useState} from 'react';
import {Text, Keyboard,Image, StyleSheet} from 'react-native';
import {useStoreState, useStoreActions} from 'easy-peasy';
import {STATUS} from '../../Constants';
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
import {showErrorToast, showInfoToast, showSuccessToast} from '../../Lib/Toast';
import BottomPanel from '../../Components/Panel';
import useTranslation from '../../i18n';
import Fonts from '../../Themes/Fonts';
import { View } from 'react-native-animatable';
import { ThemeProvider, useNavigation,useRoute } from '@react-navigation/native';
import defaultTheme from '../../Themes';
import colors from '../../Themes/Colors';
import Routes from '../../Navigation/Routes';
import {BASE_URL,TOKEN_URL,CONTACTS_ENDPOINT} from 'react-native-dotenv';
import AsyncStorage from '@react-native-community/async-storage';
import { element } from 'prop-types';

var dataList=[];

export default () => {
  const onChange = useStoreActions(actions => actions.login.onLoginInputChange);
  const {t} = useTranslation();
  const {login} = useAuth();
  const {theme} = useAppTheme();
  const navigation=useNavigation();
  const[token,setToken]=useState();

  const inputConfirmPassword = useRef();
  const inputPassword = useRef();

  const panelRef = useRef();
  const route = useRoute();
  let username='';
  let phoneNumber='';
  
  const [passedUrl,setPassedUrl]=React.useState('');

  if(route.params!==undefined){
    username=route.params.username;
    phoneNumber=route.params.phoneNumber;
  }

  React.useEffect(()=>{
      _retrieveToken();
      storePassedUrl();
  },[])

  const storePassedUrl=async()=>{
    setPassedUrl(route.params.url);
    console.log("passed url is",passedUrl);

  }

  const _retrieveToken = async () => {
    try {
      const value = await AsyncStorage.getItem('@token_key');
      if (value !== null) {
        setToken(value);
        console.log("token is= "+value);
      }
    } catch (error) {
      console.log("error is",error);
    }
  };


  const onSubmit = () => {
    inputConfirmPassword.current.focus();
  };

  const {initialPassword, confirmPassword, status} = useStoreState(state => ({
    initialPassword: state.login.initialPassword,
    confirmPassword: state.login.confirmPassword,
    status: state.login.status,
  }));

  const changePassword = () => {
    Keyboard.dismiss();

    if (!initialPassword || !confirmPassword) {
      showInfoToast('password setup is mandatory, try again !');
    }
    else if(initialPassword!==confirmPassword){
        showInfoToast('Passwords do not match !');
    }
    else{
    modifyPassword({
      initialPassword
    });
    }
  };
  const modifyPassword=(password)=>{
    fetch(passedUrl,{
      method:'PATCH',
      headers:{
        'Authorization': 'Bearer '+token,
        'Content-Type': 'application/json',
      },
      body:JSON.stringify({
        agile_password:password.initialPassword
      })
      
    }).then((response)=>{
      if(response.ok){
        showSuccessToast("Successfully setup password")
        navigation.navigate(Routes.LOGIN_SCREEN)
      }
      else{
        showErrorToast(response.body);
        console.log('response not ok');
      }
      // responseJson.value.forEach(items=>dataList.push(items))
      // dataList.push(responseJson.value);
      // console.log("Data is",dataList[0].firstname);
      // {checkAuth(password)}
      
    }).catch((error)=>{
      showErrorToast(response.body);
      console.log("error is",error);
    });
  }

  // const checkAuth=(password)=>{
  //   console.log("passed password is",password.initialPassword);
   
  //   //const finalData=dataList.map(item=>item.firstname).filter(item=>item===username)
  //    const newfinalData=dataList.filter(item=>item.firstname==="Bryan").forEach(value=>value.agile_password=password.initialPassword);
  //    console.log("new final data is",newfinalData);


  //    fetch(BASE_URL+CONTACTS_ENDPOINT,{
  //     method:'PATCH',
  //     headers:{
  //       'Authorization': 'Bearer '+token,
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
       
  //       agile_password:password.initialPassword
  //   })
  //   }).then((response)=>{
  //     if(response.ok){
  //     console.log(response.status)
  //     if(response.status===204){
  //       showSuccessToast("Successfully setup password")
  //       navigation.navigate(Routes.LOGIN_SCREEN)
  //     }
  //   }else{
  //     showErrorToast(response.body);
  //     console.log("error")
  //   }
  //   }).catch((error)=>{
  //     showErrorToast(response.body);
  //     console.log("error is",error);
  //   });
  // }


     //newfinalData.forEach(value=>console.log("password is",value.agile_password));
    // console.log("new final data is",newfinalData);


    // console.log(Object.keys(finalData));
    // const agilePassword=finalData.forEach(value=>console.log("value is",value.firstname));

   // agilePassword.forEach(value=>console.log("value is",value.firstname));

    // console.log("agile password is",agilePassword);
    // finalData.forEach((element,index,array)=>{
      
    //   if(element.includes("agile_password")){
    //     console.log("password is= ",array[index].agile_password);
    //   }
    // })
    // if(finalData===username){
    //   console.log('hurray found!!!')
    // }
    // console.log(finalData)
  

  const loading = status === STATUS.FETCHING;

  return (
    <Container>
      <LoadingActionContainer>
        <View style={{ marginTop:40,justifyContent:'center',alignSelf:'center'}}>
        <Image
                    style={{ height: 12, width: 150, padding: 16, marginTop: 36 }}
                    source={require('../../../assets/app_logo.png')}
                />
          
        </View>
        <View style={{marginTop:24}}>
        <Section>
          <PasswordInputX
            label="New Password"
            // mode="outlined"
            ref={inputPassword}
            style={{backgroundColor: '#fafafa'}}
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
            style={{backgroundColor: '#fafafa'}}
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
 ovalButton:{
   borderRadius:24
 } 
})
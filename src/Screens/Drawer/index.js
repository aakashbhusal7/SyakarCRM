/* eslint-disable react-native/no-inline-styles */
import React,{useEffect,useState} from 'react';
import {DrawerContent, DrawerContentScrollView, DrawerItem, DrawerItemList} from '@react-navigation/drawer';
import {Section, TouchableX} from '../../Components';
import {Image, View} from 'react-native';
import {Text} from 'react-native';
import metrics from '../../Themes/Metrics';
import useAuth from '../../Services/Auth';
import Fonts from '../../Themes/Fonts';
import defaultTheme from '../../Themes';
import Routes from '../../Navigation/Routes';
import AsyncStorage from '@react-native-community/async-storage';

const Drawer = (props) => {

 

  useEffect((async)=>{
    retrieveUsername();
},[])

const[value,setValue]=useState('');
const retrieveUsername = async () => {
  try {
    const value = await AsyncStorage.getItem('@username');
    if (value !== null) {
      setValue(value);
    }
  } catch (error) {
    console.log("error is",error);
  }
};


console.log("props are",props.drawerContentOptions);

  return (
    <DrawerContentScrollView {...props}>
     
      <Section style={{paddingTop: 1, backgroundColor: '#E6E9F4'}}>
      <View style={{backgroundColor:'#E6E9F4',height:135}}>
      <View style={{ marginTop:16,justifyContent:'flex-start',alignSelf:'flex-start',marginLeft:16}}>
        <Image
       
                    style={{height:0, padding: 16, marginTop: 36,maxWidth:150 }}
                    source={require('../../../assets/app_logo.png')}
                />
          
        </View>
      <Text style={{justifyContent:'center',
          alignSelf:'flex-start',
          marginTop:24,
          marginLeft:16,
          fontFamily:Fonts.type.bold,
          color:defaultTheme.colors.primary
          
          }}>
          {value}
            </Text>
      </View>
      </Section>
     
   

      <Content navigation={props.navigation}/>
    </DrawerContentScrollView>
  );
};

const Content = (props) => {
  const {logout} = useAuth();
  const lead=()=>{
    props.navigation.navigate(Routes.LEAD_SCREEN)
  }
 
  return (
    <>
      <Item name="Lead" onPress={lead}/>
      <Item name="Booking" />
      <Item name="Follow Up" />
      <Item name="Test Ride" />
      <Item name="Notifications" />
      <View style={{height: 20}} />
      <Item name="Logout" color={'red'} onPress={logout} />
    </>
  );
};

const Item = ({name, color = 'black', onPress = () => {}}) => {
  return (
    <TouchableX border onPress={onPress}>
      <View style={{padding: 16}}>
        <Text style={{color,fontFamily:Fonts.type.bold}}>{name}</Text>
      </View>
    </TouchableX>
  );
};

export default Drawer;

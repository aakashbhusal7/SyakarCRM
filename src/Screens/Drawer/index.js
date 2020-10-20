/* eslint-disable react-native/no-inline-styles */
import AsyncStorage from '@react-native-community/async-storage';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import IconBookingActive from '../../../src/Assets/icon-booking-green.svg';
import IconBooking from '../../../src/Assets/icon-booking.svg';
import IconFollowup from '../../../src/Assets/icon-followup.svg';
import IconLeadSmall from '../../../src/Assets/icon-lead-small.svg';
import IconLead from '../../../src/Assets/icon-lead.svg';
import IconPeople from '../../../src/Assets/icon-people.svg';
import { Section, TouchableX } from '../../Components';
import Routes from '../../Navigation/Routes';
import useAuth from '../../Services/Auth';
import defaultTheme from '../../Themes';
import Fonts from '../../Themes/Fonts';


const Drawer = (props) => {


  useEffect((async) => {
    retrieveUsername();
  }, [])

  const [value, setValue] = useState('');
  const retrieveUsername = async () => {
    try {
      const value = await AsyncStorage.getItem('@username');
      if (value !== null) {
        setValue(value);
      }
    } catch (error) {
      console.log("error is", error);
    }
  };


  console.log("props are", props.drawerContentOptions);

  return (
    <DrawerContentScrollView {...props}>

      <Section style={{ paddingTop: 1, backgroundColor: '#E6E9F4' }}>
        <View style={{ backgroundColor: '#E6E9F4', height: 135 }}>
          <View style={{ marginTop: 16, justifyContent: 'flex-start', alignSelf: 'center' }}>
            <Image

              style={{ height: 20, padding: 16, marginTop: 36, maxWidth: 150, alignSelf: 'center' }}
              source={require('../../../assets/app_logo.png')}
            />


          </View>
          <Text style={{
            justifyContent: 'center',
            marginLeft: 24,
            marginTop: 24,
            fontSize: 14,
            fontFamily: Fonts.type.extraBold,
            color: defaultTheme.colors.primary

          }}>
            {value}
          </Text>

        </View>
      </Section>



      <Content navigation={props.navigation} />
    </DrawerContentScrollView>
  );
};

const Content = (props) => {
  const { logout } = useAuth();
  const lead = () => {
    props.navigation.navigate(Routes.LEAD_LIST_SCREEN);
  }
  const followUp = () => {
    props.navigation.navigate(Routes.FOLLOW_UP_LIST_SCREEN)
  }
  const testRide = () => {
    props.navigation.navigate(Routes.TEST_RIDE_LIST_SCREEN)
  }

  const booking = () => {
    props.navigation.navigate(Routes.BOOKING_LIST_SCREEN)
  }

  return (
    <>
      <Item name="Lead" logo={<IconLead />} onPress={lead} />
      <SubItem name="New Lead" logo={<IconPeople />} onPress={lead} />
      <SubItem name="Hot Leads" logo={<IconLeadSmall />} />
      <SubItem name="Cold Leads" logo={<IconLeadSmall />} />
      <SubItem name="Warms Leads" logo={<IconLeadSmall />} />
      <Item name="Booking" logo={<IconBooking />} onPress={booking} />
      <SubItem name="Active Booking" logo={<IconBookingActive />} />
      <Item name="Follow Up" logo={<IconFollowup />} onPress={followUp} />
      <Item name="Test Ride" logo={<Image style={styles.imageStyle} source={require('../../../assets/logo_car.png')} />} onPress={testRide} />
      <Item name="Notifications" logo={<Image style={styles.imageStyle} source={require('../../../assets/logo_notification.png')} />} />
      <View style={{ height: 20 }} />
      <Item name="Log out" onPress={logout} />
    </>
  );
};

const Item = ({ name, logo, color = 'black', onPress = () => { } }) => {
  return (
    <TouchableX border onPress={onPress}>
      <View style={{ padding: 16, flexDirection: 'row', backgroundColor: '#F1F1F1', alignItems: 'center' }}>
        {logo}
        <Text style={{ color, fontFamily: Fonts.type.semiBold, marginLeft: 8, fontSize: 20 }}>{name}</Text>
      </View>
    </TouchableX>
  );
};

const SubItem = ({ name, logo, color = 'black', onPress = () => { } }) => {
  return (
    <TouchableX border onPress={onPress}>
      <View style={{ paddingLeft: 16, paddingBottom: 12, paddingTop: 4, flexDirection: 'row', alignItems: 'center' }}>
        {logo}
        <Text style={{ color, fontFamily: Fonts.type.primary, marginLeft: 8, fontSize: 14 }}>{name}</Text>
      </View>
    </TouchableX>
  );
};

export default Drawer;

const styles = StyleSheet.create({
  imageStyle: {
    height: 19,
    width: 19.
  }
})
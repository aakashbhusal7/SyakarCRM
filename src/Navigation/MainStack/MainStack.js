import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import BookingList from '../../Screens/BookingList';
import FollowUpList from '../../Screens/FollowUp/FollowUpList';
import MainScreen from '../../Screens/Home';
import LeadForm from '../../Screens/Lead/LeadForm';
import Leads from '../../Screens/Lead/Leads';
import BookingForm from '../../Screens/Opportunity/BookingForm';
import OpportunityForm from '../../Screens/Opportunity/OpportunityForm';
import TestRideForm from '../../Screens/Opportunity/TestRideForm';
import TestRideList from '../../Screens/TestRide/TestRideList';
import Routes from '../Routes';
import { default as BottomStack, default as BottomTabStack } from './BottomStack';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

export default props => {
  return (
    <Stack.Navigator headerMode="screen"
    >

      <Stack.Screen
        name={Routes.HOME_TABS}
        options={{ headerShown: false }}
        component={BottomTabStack}
      />
      <Stack.Screen name={Routes.MAIN_APP} component={MainScreen}
        options={{
          title: 'Menu',
          headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}


      />

      <Drawer.Screen name="BottomStack" component={BottomStack} />


      <Drawer.Screen name={Routes.LEAD_LIST_SCREEN} component={Leads} options={{
        title: 'Menu',
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }} />

      <Drawer.Screen name={Routes.LEAD_SCREEN} component={LeadForm}
        options={{
          title: 'Menu',
          headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />

<Drawer.Screen name={Routes.BOOKING_FORM_SCREEN} component={BookingForm} options={{
        title: 'Menu',
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }} />

      <Drawer.Screen name={Routes.OPPORTUNITY_SCREEN} component={OpportunityForm}
        options={{
          title: 'Menu',
          headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}

      />

      <Drawer.Screen name={Routes.TEST_RIDE_FORM_SCREEN} component={TestRideForm}
        options={{
          title: 'Menu',
          headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}

      />
     
      <Drawer.Screen name={Routes.TEST_RIDE_LIST_SCREEN} component={TestRideList} options={{
        title: 'Menu',
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }} />
      <Drawer.Screen name={Routes.BOOKING_LIST_SCREEN} component={BookingList} options={{
        title: 'Menu',
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }} />
      <Drawer.Screen name={Routes.FOLLOW_UP_LIST_SCREEN} component={FollowUpList} options={{
        title: 'Menu',
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }} />








    </Stack.Navigator>
  );
};

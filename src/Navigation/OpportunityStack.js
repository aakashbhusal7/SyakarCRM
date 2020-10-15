import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import BookingForm from '../Screens/Opportunity/BookingForm';
import OpportunityForm from '../Screens/Opportunity/OpportunityForm';
import TestRideForm from '../Screens/Opportunity/TestRideForm';
import Routes from './Routes';

const Stack = createStackNavigator();

export default props => {
    return (
        <Stack.Navigator headerMode="screen"
        >
            <Stack.Screen name={Routes.BOOKING_FORM_SCREEN} component={BookingForm}
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

            <Stack.Screen name={Routes.OPPORTUNITY_SCREEN} component={OpportunityForm}
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

            <Stack.Screen name={Routes.TEST_RIDE_FORM_SCREEN} component={TestRideForm}
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






        </Stack.Navigator>
    );
};

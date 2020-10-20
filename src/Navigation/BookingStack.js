import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import BookingList from '../Screens/BookingList';
import BookingForm from '../Screens/Opportunity/BookingForm';
import Routes from './Routes';

const Stack = createStackNavigator();

export default props => {
    return (
        <Stack.Navigator headerMode="screen"
        >



            <Stack.Screen name={Routes.BOOKING_LIST_SCREEN} component={BookingList}
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



        </Stack.Navigator>
    );
};

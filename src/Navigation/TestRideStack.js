import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import TestRideForm from '../Screens/Opportunity/TestRideForm';
import TestRideList from '../Screens/TestRide/TestRideList';
import Routes from './Routes';

const Stack = createStackNavigator();

export default props => {
    return (
        <Stack.Navigator headerMode="screen"
        >



            <Stack.Screen name={Routes.TEST_RIDE_LIST_SCREEN} component={TestRideList}
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

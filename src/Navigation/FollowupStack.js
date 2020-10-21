import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import FollowUpList from '../Screens/FollowUp/FollowUpList';
import Routes from './Routes';

const Stack = createStackNavigator();

export default props => {
    return (
        <Stack.Navigator headerMode="screen"
        >



            <Stack.Screen name={Routes.FOLLOW_UP_LIST_SCREEN} component={FollowUpList}
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

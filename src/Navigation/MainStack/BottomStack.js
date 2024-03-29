/* eslint-disable react-native/no-inline-styles */
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import useTranslation from '../../i18n';
import { IconX, ICON_TYPE } from '../../Icons';
import App from '../../Screens/App';
import Home from '../../Screens/Home';
import Profile from '../../Screens/Profile';
import NavigationStyles from '../../Styles/NavigationStyles';
import useAppTheme from '../../Themes/Context';
import BookingStack from '../BookingStack';
import FollowupStack from '../FollowupStack';
import LeadStack from '../LeadStack';
import Routes from '../Routes/index';
import TestRideStack from '../TestRideStack';

const HomeStackScreen = () => {
  const { t } = useTranslation();
  const { theme } = useAppTheme();

  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          title: t('home'),
          headerStyle: [
            NavigationStyles.header_statusBar,
            { backgroundColor: theme.colors.header },
          ],
          headerTitleStyle: [
            NavigationStyles.headerTitle,
            { color: theme.colors.headerTitle },
          ],
        }}
        name="homestackscreen"
        component={Home}
      />
    </Stack.Navigator>
  );
};

const ProfileStackScreen = () => {
  const { t } = useTranslation();
  const { theme } = useAppTheme();

  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          title: t('profile'),
          headerStyle: [
            NavigationStyles.header_statusBar,
            { backgroundColor: theme.colors.header },
          ],
          headerTitleStyle: [
            NavigationStyles.headerTitle,
            { color: theme.colors.headerTitle },
          ],
        }}
        name="profilestackscreen"
        component={Profile}
      />
    </Stack.Navigator>
  );
};

const NotificationStackScreen = () => {
  const { t } = useTranslation();
  const { theme } = useAppTheme();

  return (
    <Stack.Navigator>
      <Stack.Screen
        options={(route, navigation) => {
          return {
            title: t('settings'),
            headerStyle: [
              NavigationStyles.header_statusBar,
              { backgroundColor: theme.colors.header },
            ],
            headerTitleStyle: [
              NavigationStyles.headerTitle,
              { color: theme.colors.headerTitle },
            ],
          };
        }}
        name="notificationsstackscreen"
        component={App}
      />
    </Stack.Navigator>
  );
};

function getHomeIcon({ focused, color }) {
  return (
    <IconX
      style={{ marginBottom: 5 }}
      origin={ICON_TYPE.MATERIAL_ICONS}
      name={'home'}
      color={color}
    />
  );
}

function getLeadIcon({ focused, color }) {
  return (
    <IconX
      style={{ marginBottom: 5 }}
      origin={ICON_TYPE.MATERIAL_ICONS}
      name={'assignment'}
      color={color}
    />
  );
}

function getBookingIcon({ focused, color }) {
  return (
    <IconX
      style={{ marginBottom: 5 }}
      origin={ICON_TYPE.ICONICONS}
      name={'book-outline'}
      color={color}
    />
  );
}

function getTestRideIcon({ focused, color }) {
  return (
    <IconX
      style={{ marginBottom: 5 }}
      origin={ICON_TYPE.ICONICONS}
      name={'bicycle-outline'}
      color={color}
    />
  );
}

function getFollowUpIcon({ focused, color }) {
  return (
    <IconX
      style={{ marginBottom: 5 }}
      origin={ICON_TYPE.MATERIAL_ICONS}
      name={'today'}
      color={color}
    />
  );
}


const Tab = createMaterialBottomTabNavigator();

const BottomTabs = () => {
  const { theme } = useAppTheme();
  return (
    <Tab.Navigator
      initialRouteName={Routes.HOME_SCREEN}
      backBehavior={'initialRoute'}
      inactiveColor="rgba(255,255,255,0.4)"
      activeColor={theme.colors.surface}
      shifting={true}
      barStyle={{ backgroundColor: theme.colors.primary }}
      labeled={false}>
      <Tab.Screen
        options={{
          tabBarIcon: getHomeIcon,
          title: 'Home',
        }}
        name={Routes.HOME_SCREEN}
        component={HomeStackScreen}
      />
      <Tab.Screen
        options={{
          tabBarIcon: getLeadIcon,
          title: 'Lead',
        }}
        name={Routes.LEAD_LIST_SCREEN}
        component={LeadStack}
      />
      <Tab.Screen
        options={{
          tabBarIcon: getBookingIcon,
          title: 'Booking',

        }}
        name={Routes.BOOKING_LIST_SCREEN}
        component={BookingStack}
      />
      <Tab.Screen
        options={{
          tabBarIcon: getTestRideIcon,
          title: 'Test Ride',
        }}
        name={Routes.TEST_RIDE_FORM_SCREEN}
        component={TestRideStack}
      />
      <Tab.Screen
        options={{
          tabBarIcon: getFollowUpIcon,
          title: 'Follow Up',
        }}
        name={Routes.FOLLOW_UP_LIST_SCREEN}
        component={FollowupStack}
      />
    </Tab.Navigator>
  );
};

const Stack = createStackNavigator();

export default () => {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name={'bottomtabs'} component={BottomTabs} />
    </Stack.Navigator>
  );
};

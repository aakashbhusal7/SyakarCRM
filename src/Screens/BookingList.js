import AsyncStorage from '@react-native-community/async-storage';
import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { BASE_URL, OPPORTUNITY_ENDPOINT } from 'react-native-dotenv';
import { Card, ListItem, Button, Icon } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler';
import AnimatedLoader from "react-native-animated-loader";
import { FAB } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import CardListComponent from '../Components/CardListComponent';
import theme from '../Themes/configs/default';
import { ICON_TYPE } from '../Icons';
import HeaderText from '../Components/HeaderText';
import { showErrorToast } from '../Lib/Toast';
import defaultTheme from '../Themes';
import Routes from '../Navigation/Routes';
import { HeaderButton } from '../Components';

const BookingList = (props) => {

    const navigation = useNavigation();

    React.useEffect(() => {
        const _toggleDrawer = () => {
            navigation.toggleDrawer();
        };

        console.log('use effect home');

        navigation.setOptions({
            headerLeft: () => {
                return (
                    <View style={{ marginLeft: 10 }}>
                        <HeaderButton
                            icon="menuunfold"
                            color={theme.colors.headerTitle}
                            iconOrigin={ICON_TYPE.ANT_ICON}
                            onPress={_toggleDrawer}
                        />
                    </View>
                );
            },
        });
    }, [navigation, theme.colors.headerTitle]);

    const [leadData, setLeadData] = React.useState();
    const [token, setToken] = React.useState();
    const [loading, setLoadindg] = React.useState(true);
    // const navigation=useNavigation();
    React.useEffect(() => {
        retrieveToken();

    }, [token])

    // React.useEffect(() => {
    //     _apiCall();
    // }, [])


    async function retrieveToken() {
        try {
            const value = await AsyncStorage.getItem('@token_key');
            if (value !== null) {
                setToken(value);
                _apiCall(value);
                console.log("token is= " + value);
            }
        } catch (error) {
            console.log("error is", error);
        }
    }

    async function _apiCall(value) {
        const result = await fetch("https://syakarhonda.api.crm5.dynamics.com/api/data/v9.1/opportunities?$filter=agile_interested eq 1", {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + value,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }

        });
        console.log("result is", result.status);
        if (result.ok) {
            const data = await result.json();
            let tempList = [];
            data.value.map((object, key) =>
                tempList.push({
                    "name": object.name,
                    "email": object.emailaddress,

                })
            );
            setLeadData(tempList);
            setLoadindg(false);
        } else {
            setLoadindg(false);
            setLeadData(undefined);
            if (result.status === 401) {
                showErrorToast("User session expired!")
                navigation.navigate(Routes.LOGIN_STACK);
            } else {
                const errorData = result.json();
                const errorJson = errorData.error.message;
                showErrorToast(errorJson);
            }

        }
    }
    console.log("lead data list is", leadData);

    return (
        <View style={{ flex: 1, marginTop: 36 }}>
            {loading &&
                <AnimatedLoader
                    visible={true}

                    source={require("../../loader.json")}
                    animationStyle={styles.lottie}
                    speed={1}
                />
            }
            {!loading &&
                <View>
                    <HeaderText>Bookings</HeaderText>
                    <ScrollView style={{ marginBottom: 24 }}>


                        {
                            leadData !== undefined && leadData.map((u, i) => {
                                if (u.name !== null) {
                                    return (

                                        <CardListComponent flag="booking" data={u} key={i} />



                                        // <View key={i} >
                                        //     <Card containerStyle={{ borderRadius:10,opacity:100,borderWidth:0}}>


                                        //     <Text>{u.fullname}</Text>
                                        //     <Text>{u.phone}</Text>

                                        //     </Card>
                                        // </View>
                                    );
                                }
                            })

                        }

                    </ScrollView>
                </View>
            }

        </View>
    )
}
const styles = StyleSheet.create({
    lottie: {
        width: 100,
        height: 100
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: defaultTheme.colors.primary
    },
})

export default BookingList;
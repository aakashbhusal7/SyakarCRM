import AsyncStorage from '@react-native-community/async-storage';
import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { BASE_URL, OPPORTUNITY_ENDPOINT } from 'react-native-dotenv';
import { Card, ListItem, Button, Icon } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler';
import AnimatedLoader from "react-native-animated-loader";
import CardListComponent from '../../Components/CardListComponent';
import { FAB } from 'react-native-paper';
import defaultTheme from '../../Themes';
import { useNavigation, useRoute } from '@react-navigation/native';
import Routes from '../../Navigation/Routes';
import theme from '../../Themes/configs/default';
import { HeaderButton } from '../../Components';
import { ICON_TYPE } from '../../Icons';
import HeaderText from '../../Components/HeaderText';

const FollowUpList = (props) => {

    const navigation=useNavigation();

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
                _apiCall();
                console.log("token is= " + value);
            }
        } catch (error) {
            console.log("error is", error);
        }
    }

    async function _apiCall() {
        const result = await fetch("https://syakarhonda.api.crm5.dynamics.com/api/data/v9.1/opportunities?$filter=agile_interested eq 1", {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }

        });
        console.log("result is", result.status);
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
    }
    console.log("lead data list is", leadData);

    return (
        <View style={{ flex: 1, marginTop: 36 }}>
            {loading &&
                <AnimatedLoader
                    visible={true}

                    source={require("../../../loader.json")}
                    animationStyle={styles.lottie}
                    speed={1}
                />
            }
            {!loading &&
                <View>
                    <HeaderText>Follow Ups</HeaderText>
                    <ScrollView style={{ marginBottom: 24 }}>


                        {
                            leadData.map((u, i) => {
                                if (u.name !== null) {
                                    return (

                                        <CardListComponent flag="followUp" data={u} key={i} />



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

export default FollowUpList;
import AsyncStorage from '@react-native-community/async-storage';
import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { BASE_URL, LEADS_ENDPOINT } from 'react-native-dotenv';
import { Card, ListItem, Button, Icon, SearchBar } from 'react-native-elements'
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
import { showErrorToast } from '../../Lib/Toast';
import { AuthContext } from '../../Components/context';
import { l } from 'i18n-js';
import Fonts from '../../Themes/Fonts';

const Leads = ({ routes, navigation }) => {

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
    const { signOut } = React.useContext(AuthContext);
    const [leadData, setLeadData] = React.useState([]);
    const [token, setToken] = React.useState(undefined);
    const [contactKey, setContactKey] = React.useState();
    const [loading, setLoadindg] = React.useState(true);
    const [search, setSearch] = React.useState({
        allData: leadData,
        filteredData: leadData
    });
    // const navigation=useNavigation();

    React.useEffect(() => {
        retrieveToken();

    }, [token])

    // React.useEffect(() => {
    //     _apiCall();
    // }, [])
    React.useEffect(() => {
        retrieveContactId();
    }, [contactKey])

    async function retrieveToken() {
        try {
            const value = await AsyncStorage.getItem('@token_key');
            if (value !== null) {
                setToken(value);

                console.log("token is= " + value);
            }
        } catch (error) {
            console.log("error is", error);
        }
    }

    async function retrieveContactId() {
        try {
            const contactId = await AsyncStorage.getItem('@contactId');
            if (contactId !== null) {
                setContactKey(contactId);
                _apiCall();
            }
        } catch (error) {
            console.log("error is", error);
        }
    }

    async function _apiCall() {
        if (token !== undefined) {
            const result = await fetch(
                "https://syakarhonda.api.crm5.dynamics.com/api/data/v9.1/leads?$filter=_agile_saleperson_value eq " + contactKey
                , {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }

                });
            console.log("result is", result.status);
            if (result.ok) {
                const data = await result.json();
                let tempList = [];
                data.value.filter(value=>value.yomifullname!==null).map((object, key) =>
                    tempList.push({
                        "fullname": object.yomifullname,
                        "phone": object.mobilephone,
                        "email": object.emailaddress1,
                        "leadNature": object.new_leadnature,
                        "leadId": object.leadid,
                    })
                );
                setLeadData(tempList);
                setSearch({
                    filteredData: tempList
                })
                setLoadindg(false);
            }
            else {
                setLoadindg(false);
                setLeadData(undefined);
                if (result.status == 401) {
                    showErrorToast("User session expired!")
                    signOut();
                    // navigation.reset({
                    //     index: 0,
                    //     routes: [{ name: ' LOGIN_SCREEN' }],
                    // });
                } else {
                    const errorData = result.json();
                    const errorJson = errorData.error.message;
                    showErrorToast(errorJson);
                }

            }
        }
    }
    console.log("lead data list filtered is", search.filteredData);

    const updateSearch = (text) => {
        console.log("data of search is", leadData);
        setSearch({
            filteredData: leadData.filter(value =>
                value.fullname.toLowerCase().includes(text.toLowerCase()),
            ),
        })
    }

    return (
        <View style={{ flex: 1, marginTop: 36, marginBottom: 24, paddingBottom: 24 }}>
            {loading &&
                <AnimatedLoader
                    visible={true}
                    overlayColor="rgba(0,0,0,0)"
                    source={require("../../../loader.json")}
                    animationStyle={styles.lottie}
                    speed={1}
                />
            }
            {!loading &&
                <View style={{ flex: 1 }}>
                    <HeaderText>Leads</HeaderText>
                    <SearchBar
                        underlineColorAndroid="white"
                        lightTheme={true}
                        containerStyle={{ backgroundColor: 'white', color: 'white', borderWidth: 0, marginTop: 8, marginBottom: 8, marginLeft: 16, marginRight: 16 }}
                        inputContainerStyle={{ backgroundColor: 'white', height: 32, borderWidth: 0, borderColor: 'white' }}
                        inputStyle={{ fontFamily: Fonts.type.primary, fontSize: 16 }}
                        placeholder="Search"
                        onChangeText={text => updateSearch(text)}
                        value={search}
                    />
                    <ScrollView >


                        {

                            leadData !== undefined &&
                            search.filteredData.map((u, i) => {
                                if (u.fullname !== null) {
                                    return (

                                        <CardListComponent flag="lead" token={token} data={u} key={i} />



                                        // <View key={i} >
                                        //     <Card containerStyle={{ borderRadius: 10, opacity: 100, borderWidth: 0 }}>


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
            <FAB
                style={styles.fab}
                small
                icon="plus"
                onPress={() =>
                    navigation.navigate(Routes.LEAD_SCREEN)}
            />
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

export default Leads;
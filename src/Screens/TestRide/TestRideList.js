import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import AnimatedLoader from "react-native-animated-loader";
import { ScrollView } from 'react-native-gesture-handler';
import { HeaderButton } from '../../Components';
import CardListComponent from '../../Components/CardListComponent';
import HeaderText from '../../Components/HeaderText';
import { ICON_TYPE } from '../../Icons';
import { showErrorToast } from '../../Lib/Toast';
import defaultTheme from '../../Themes';
import theme from '../../Themes/configs/default';
import { AuthContext } from '../../Components/context';
import { SearchBar } from 'react-native-elements';
import Fonts from '../../Themes/Fonts';

const TestRideList = (props) => {
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
    const { signOut } = React.useContext(AuthContext);
    const [leadData, setLeadData] = React.useState([]);
    const [token, setToken] = React.useState();
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
        if (token !== undefined) {
            const result = await fetch("https://syakarhonda.api.crm5.dynamics.com/api/data/v9.1/opportunities?$filter=agile_interested eq 2", {
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
                data.value.filter(value => value.name !== null).map((object, key) =>
                    tempList.push({
                        "name": object.name,
                        "email": object.emailaddress,
                        "feedback": object.agile_testridefeedback,
                        "licenseNumber": object.agile_testridelicense,
                        "bookingId": object.opportunityid,

                    })
                );
                setLeadData(tempList);
                setSearch({
                    filteredData: tempList
                })
                setLoadindg(false);
            } else {
                setLoadindg(false);
                setLeadData(undefined);
                if (result.status == 401) {
                    showErrorToast("User session expired!")
                    signOut();
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

                value.name.toLowerCase().includes(text.toLowerCase()),
            ),

        })


    }


    return (
        <View style={{ flex: 1, marginTop: 36, marginBottom: 24, paddingBottom: 24 }}>
            {loading &&
                <AnimatedLoader
                    visible={true}
                    source={require("../../../loader.json")}
                    animationStyle={styles.lottie}
                    speed={1}
                />
            }
            {!loading &&
                <View style={{ flex: 1 }}>
                    <HeaderText>Test Rides</HeaderText>

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
                                if (u.name !== null) {
                                    return (

                                        <CardListComponent flag="testRide" token={token} data={u} key={i} />



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

export default TestRideList;
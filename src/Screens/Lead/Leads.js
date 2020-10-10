import AsyncStorage from '@react-native-community/async-storage';
import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { BASE_URL, LEADS_ENDPOINT } from 'react-native-dotenv';
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

const Leads = ({routes,navigation}) => {

    React.useEffect(() => {
        const _toggleDrawer = () => {
          navigation.toggleDrawer();
        };
    
        console.log('use effect home');
    
        navigation.setOptions({
          headerLeft: () => {
            return (
              <View style={{marginLeft: 10}}>
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
        const result = await fetch(BASE_URL + LEADS_ENDPOINT, {
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
                "fullname": object.yomifullname,
                "phone": object.mobilephone,
                "email": object.emailaddress1,
                "leadNature": object.new_leadnature,
            })
        );
        setLeadData(tempList);
        setLoadindg(false);
    }
    console.log("lead data list is", leadData);

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
            <View style={{flex:1}}>
             <HeaderText>Leads</HeaderText>
                <ScrollView >
                   

                    {
                        leadData.map((u, i) => {
                            if (u.fullname !== null) {
                                return (

                                    <CardListComponent data={u} key={i} />



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
        backgroundColor:defaultTheme.colors.primary
      },
})

export default Leads;
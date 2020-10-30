import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from 'react-native-elements';
import { TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native';
import IconPhone from '../../src/Assets/icon-phone.svg';
import defaultTheme from '../Themes';
import Fonts from '../Themes/Fonts';
import Routes from '../Navigation/Routes';
import Swipeable from 'react-native-swipeable';
import Animated, { Easing } from 'react-native-reanimated';
import { IconX, ICON_TYPE } from '../Icons';
import { BASE_URL, LEADS_ENDPOINT, PRODUCTS_ENDPOINT, QUALIFY_ENDPOINT, OPPORTUNITY_ENDPOINT } from 'react-native-dotenv';
import Toast from 'react-native-tiny-toast';
import { AuthContext } from '../Components/context';
import { showErrorToast, showSuccessToast } from '../Lib/Toast';

const CardListComponent = (props) => {
    const navigation = useNavigation();
    const { signOut } = React.useContext(AuthContext);

    Animated.timing(new Animated.Value(0),
        {
            toValue: 1,
            duration: 500,
            easing: Easing.linear,
            useNativeDriver: false //make it as false
        }).start();

    let url = '';

    if (props.flag === "booking") {
        url = BASE_URL + OPPORTUNITY_ENDPOINT + '(' + props.data.bookingId + ')';
    }
    if (props.flag === "testRide") {
        url = BASE_URL + OPPORTUNITY_ENDPOINT + '(' + props.data.bookingId + ')';
    }
    if (props.flag === "lead") {
        url = BASE_URL + LEADS_ENDPOINT + '(' + props.data.leadId + ')';
    }
    if(props.flag==="followUp"){
        url = BASE_URL + OPPORTUNITY_ENDPOINT + '(' + props.data.bookingId + ')';
    }
    const rightButtons = [
        <TouchableOpacity onPress={() => {
            fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + props.token,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then((result) => {
                if (result.ok) {
                    if (props.flag === "lead") {
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'LIST_LEAD' }]
                        })
                        showSuccessToast("Successfully deleted lead item")
                    } else if (props.flag === "booking") {
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'BOOKING_LIST' }]
                        })
                        showSuccessToast("Successfully deleted booking item")
                    } else if (props.flag === "testRide") {
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'TEST_RIDE_LIST' }]
                        })
                        showSuccessToast("Successfully deleted test ride item")
                    } else {
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'FOLLOW_UP_LIST' }]
                        })
                        showSuccessToast("Successfully deleted follow up item")
                    }

                } else {
                    if (result.status == 401) {
                        signOut();
                    }
                    result.json().then((body) => {
                        showErrorToast(body.error.message)

                    });
                }
            })
        }}>
            <View style={{ flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', height: 90, marginTop: 20 }}>
                <Text style={{ fontFamily: Fonts.type.primary, fontSize: 16 }}>Delete</Text>
                <IconX
                    style={{ marginRight: 8, marginLeft: 16 }}
                    origin={ICON_TYPE.ICONICONS}
                    name={'trash-outline'}
                    color="black"
                />
            </View>
        </TouchableOpacity>


    ];


    let element;
    if (props.flag === "booking") {
        element = (
            <View >
                <Swipeable rightButtons={rightButtons} >
                    <Card containerStyle={{ borderRadius: 10, opacity: 100, borderWidth: 0 }}>
                        <TouchableOpacity onPress={() => {
                            navigation.navigate(Routes.BOOKING_FORM_SCREEN, {
                                flag: 'edit',
                                bookingId: props.data.bookingId

                            })
                        }}>

                            <Text style={styles.nameStyle}>{props.data.name}</Text>
                            <Text style={[styles.subHeaderStyle, { marginTop: 4 }]}>{props.data.email}</Text>

                        </TouchableOpacity>
                    </Card>
                </Swipeable>
            </View>);
    }
    else if (props.flag === "testRide") {
        element = (
            <View >
                <Swipeable rightButtons={rightButtons} >
                    <Card containerStyle={{ borderRadius: 10, opacity: 100, borderWidth: 0 }}>
                        <TouchableOpacity onPress={() => {
                            navigation.navigate(Routes.TEST_RIDE_FORM_SCREEN, {
                                flag: 'edit',
                                bookingId: props.data.bookingId

                            })
                        }}>

                            <Text style={styles.nameStyle}>{props.data.name}</Text>
                            <Text style={[styles.subHeaderStyle, { marginTop: 4 }]}>{props.data.email}</Text>
                            <Text style={[styles.subHeaderStyle, { marginTop: 4 }]}>{props.data.feedback}</Text>

                            <Text style={[styles.subHeaderStyle, { marginTop: 4 }]}>{props.data.licenseNumber}</Text>

                        </TouchableOpacity>
                    </Card>
                </Swipeable>
            </View>);
    }
    else if (props.flag === "followUp") {
        element = (
            <View >
                <Swipeable rightButtons={rightButtons} >
                    <Card containerStyle={{ borderRadius: 10, opacity: 100, borderWidth: 0 }}>
                        <TouchableOpacity onPress={() => {
                            navigation.navigate(Routes.FOLLOW_UP_FORM_SCREEN, {
                                flag: 'edit',
                                bookingId: props.data.bookingId

                            })
                        }}>

                            <Text style={styles.nameStyle}>{props.data.name}</Text>
                            <Text style={[styles.subHeaderStyle, { marginTop: 4 }]}>{props.data.email}</Text>

                        </TouchableOpacity>
                    </Card>
                </Swipeable>
            </View>);
    }
    else {
        element = (
            <View >
                <Swipeable rightButtons={rightButtons} >
                    <Card containerStyle={{ borderRadius: 10, opacity: 100, borderWidth: 0 }}>
                        <TouchableOpacity onPress={() => {
                            navigation.navigate(Routes.LEAD_SCREEN, {
                                flag: 'edit',

                                leadId: props.data.leadId

                            })
                        }}>

                            <Text style={styles.nameStyle}>{props.data.fullname}</Text>
                            <Text style={[styles.subHeaderStyle, { marginTop: 4 }]}>{props.data.email}</Text>
                            <View style={{ flexDirection: 'row', marginTop: 8, alignItems: 'center' }}>
                                <IconPhone />
                                <Text style={[styles.subHeaderStyle, { marginLeft: 8 }]}>{props.data.phone}</Text>
                            </View>


                        </TouchableOpacity>

                    </Card>
                </Swipeable>
            </View>
        );
    }
    return element;
}
const styles = StyleSheet.create({
    nameStyle: {
        color: defaultTheme.colors.primary,
        fontFamily: Fonts.type.semiBold,
        fontSize: 14,

    },
    subHeaderStyle: {
        color: defaultTheme.colors.primary,
        fontFamily: Fonts.type.primary,
        fontSize: 12,


    },
    rightSwipeItem: {
        flex: 1,
        justifyContent: 'center',
        paddingLeft: 20
    },

})

export default CardListComponent;
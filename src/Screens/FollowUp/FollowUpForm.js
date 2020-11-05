import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { Dimensions, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import AnimatedLoader from "react-native-animated-loader";
import { BASE_URL, LEADS_ENDPOINT, OPPORTUNITY_ENDPOINT } from 'react-native-dotenv';
import { ButtonGroup } from 'react-native-elements';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { ButtonX, HeaderButton } from '../../Components';
import { AuthContext } from '../../Components/context';
import DateComponent from '../../Components/DateComponent';
import HeaderText from '../../Components/HeaderText';
import TimeComponent from '../../Components/TimeComponent';
import useTranslation from '../../i18n';
import { IconX, ICON_TYPE } from '../../Icons';
import { showErrorToast, showInfoToast, showSuccessToast } from '../../Lib/Toast';
import Routes from '../../Navigation/Routes';
import defaultTheme from '../../Themes';
import theme from '../../Themes/configs/default';
import Fonts from '../../Themes/Fonts';

var width = Dimensions.get('window').width;

const dropDownStyleFull = {
    height: 45,
    width: width / 1.115,
    fontSize: 14,
    lineHeight: 16,

    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#EDEDED',
    borderRadius: 3,
    marginRight: 8,
    marginTop: 20,
    marginBottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
}
const StyledInput = ({ label, formikProps, uneditable, passedValue, formikKey, ...rest }) => {

    const inputStyles = {
        height: 45,
        width: width / 1.115,
        fontSize: 14,
        fontFamily: Fonts.type.primary,
        lineHeight: 16,
        color: !uneditable ? "#333333" : "#333333",
        alignSelf: 'stretch',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#EDEDED',
        borderRadius: 3,
        marginRight: 8,
        paddingLeft: 16,
        marginBottom: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
    };
    const errorStyles = {
        color: '#E41717',
        fontSize: 12,
        marginLeft: 0,
        lineHeight: 12,
        marginBottom: 0,
        fontFamily: "WorkSans-Regular",
        alignItems: 'center'
    };
    const errorStylesLastName = {
        color: '#E41717',
        fontSize: 12,
        lineHeight: 12,
        marginLeft: 4,
        fontFamily: "WorkSans-Regular",
        alignItems: 'center'
    };
    let lastName = false;

    if (formikProps.touched[formikKey] && formikProps.errors[formikKey]) {
        inputStyles.marginBottom = 5;
        errorStyles.marginBottom = 12;
    }
    if (formikKey == 'firstName') {
        inputStyles.width = width / 2.25
    }
    if (formikKey == 'street') {
        inputStyles.width = width / 2.25
    }
    if (formikKey == 'lastName') {
        lastName = true;
        inputStyles.width = width / 2.25
        inputStyles.marginLeft = 4
    }
    if (formikKey == 'countryCode') {
        inputStyles.width = width / 3
    }

    if (formikKey == 'dob') {
        inputStyles.width = width / 1.25
    }
    if (formikKey == 'icon') {
        inputStyles.marginLeft = -9
        inputStyles.width = width / 8
        inputStyles.marginRight = -60
    }
    return (
        <React.Fragment>

            <View style={{ backgroundColor: '#ffffff' }}>

                <Text style={styles.textLabelStyle}>{label}</Text>
                <View >
                    <TextInput
                        defaultValue={passedValue != "null" ? passedValue : ''}
                        editable={uneditable ? false : true}
                        style={inputStyles}
                        underlineColorAndroid="transparent"
                        onChangeText={
                            formikProps.handleChange(formikKey)
                        }
                        onBlur={formikProps.handleBlur(formikKey)}
                        {...rest}
                    />
                </View>
                <Text style={lastName ? errorStylesLastName : errorStyles}>
                    {formikProps.touched[formikKey] && formikProps.errors[formikKey]}
                </Text>
            </View>
        </React.Fragment>
    );
};

const FollowUpForm = (props) => {
    const { signOut } = React.useContext(AuthContext);
    const navigation = useNavigation();
    const route = useRoute();
    const { t } = useTranslation();
    const [editMode, setEditMode] = React.useState(false);
    const [dataOptionSet, setDataOptionSet] = React.useState({
        followUpDate: undefined
    })
    const [opportunityStatus, setOpportunityStatus] = React.useState();
    const [token, setToken] = useState(undefined);
    const [productName, setProductName] = useState();
    const [colorName, setColorName] = useState(undefined);
    const [colorsListData, setColorsListData] = useState([

    ]);
    const [reload, setReload] = React.useState(false);
    const [modelReload, setModelReload] = React.useState(false);
    const [patchMode, setPatchMode] = React.useState(false);
    const [postUrl, setPostUrl] = React.useState(BASE_URL + LEADS_ENDPOINT);
    const [loading, setLoading] = useState(false);

    //const [time, setTime] = useState(new Date());

    const [dateShow, setDateShow] = useState(false);
    const [leadParentData, setLeadParentData] = React.useState({
        firstName: undefined,
        lastName: undefined,
        phone: undefined,
        email: undefined,
    })

    let productId = '';
    let opportunityId = '';
    let interest = '';
    let email = '';
    let subject = '';
    if (route.params !== undefined) {
        console.log("passed params are", route.params.passingProp);
        if (route.params.passingProp !== undefined) {
            email = route.params.passingProp.email;
            subject = route.params.passingProp.subject;
            productId = route.params.passingProp.modelId;
            opportunityId = route.params.passingProp.opportunityId;
        } else {
            opportunityId = route.params.bookingId;
        }

    } else {
        console.log("here");
    }

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

    let bookingId = '';
    if (route.params !== undefined) {
        if (route.params.flag == "edit") {
            bookingId = route.params.bookingId;
            console.log("passed opportunity id is", route.params.bookingId);
        }
    }

    // let opportunityId = '';
    // if (route.params !== undefined) {
    //     if (route.params.flag == "edit") {
    //         opportunityId = route.params.opportunityId;
    //         console.log("passed lead id is", route.params.opportunityId);
    //     }
    // }

    React.useEffect((async) => {
        retrieveToken();

    }, [])


    async function retrieveToken() {
        try {
            const value = await AsyncStorage.getItem('@token_key');
            if (value !== null) {
                setToken(value);
                fetchOpportunityStatus(value);
                // if (modelReload == false) {
                //     fetchExistingFollowUp(value)
                // }
                //fetchProducts(value);
                console.log("token is= " + value);

            }
        } catch (error) {
            console.log("error is", error);
        }
    }

    async function fetchOpportunityStatus(token) {
        setLoading(true);
        console.log("OPPORTUNITY ID IS", opportunityId);
        const res = await fetch(BASE_URL + OPPORTUNITY_ENDPOINT + '(' + opportunityId + ')', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
        if (res.ok) {
            const data = await res.json();
            setOpportunityStatus(data.agile_interested);
            if (reload == false) {

                console.log('opportunity status is', opportunityStatus);
                fetchExistingFollowUp(token)

                if (data.agile_followuprequired == 1) {
                    console.log("here inside");
                    //setLoading(true);
                    // setDate(new Date());
                    //setLoading(false);
                    //fetchExistingFollowUp(token)
                } else {
                    setLoading(false);
                    setDate(new Date());
                    console.log("agile interested is", data.agile_followuprequired);
                    console.log("entered here");

                }

            }
        } else {
            setLoading(false);
            if (res.status == 401) {
                signOut();
            }
            showErrorToast("Error loading the data")
        }
        return opportunityStatus;
    }

    function fetchExistingFollowUp(token) {
        console.log("bboking id is", opportunityId);
        let errorMessage = '';
        if (bookingId !== '' || opportunityId !== '') {
            fetch("https://syakarhonda.api.crm5.dynamics.com/api/data/v9.1/opportunities(" + opportunityId + ")", {
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then((res) => {
                console.log("res code is", res.status);
                if (res.ok) {
                    res.json().then(
                        (resJson) => {
                            fetchParentLeadData(resJson._originatingleadid_value, token);
                            if (resJson.agile_followuprequired == 1) {
                                setDataOptionSet({
                                    followUpDate: "" + resJson.agile_followup

                                })

                                setEditMode(true);
                                setLoading(false);
                            } else {
                                console.log("reached here")
                                setDataOptionSet({
                                    followUpDate: "" + new Date()

                                })

                            }
                        })
                } else {
                    setLoading(false);
                    if (res.status == 401) {
                        signOut();
                    }

                    res.json().then((body) => {
                        errorMessage = body.error.message;
                        console.log("error message is", errorMessage);
                    });
                    console.log("error in edit followup form");
                }



            }
            )
        } else {
            setLoading(false);
        }
    }

    function fetchParentLeadData(leadId, token) {
        let errorMessage = '';
        fetch("https://syakarhonda.api.crm5.dynamics.com/api/data/v9.1/leads(" + leadId + ")", {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then((res) => {
            if (res.ok) {
                res.json().then(
                    (resJson) => {
                        setLeadParentData({
                            firstName: "" + resJson.firstname,
                            lastName: "" + resJson.lastname,
                            phone: "" + resJson.mobilephone,
                            email: "" + resJson.emailaddress1
                        })
                        setLoading(false);
                    }
                )
            } else {
                if (res.status == 401) {
                    setLoading(false);
                    signOut();
                }
                res.json().then((body) => {
                    errorMessage = body.error.message;
                    showErrorToast(errorMessage)
                    setLoading(false);
                    console.log("error message is", errorMessage);
                });

            }
        })
    }

    const [date, setDate] = useState(dataOptionSet.followUpDate);
    const [time, setTime] = useState(dataOptionSet.followUpDate);

    const onFormSubmit = (values) => {
        let requestBody;
        let errorMessage = '';
        requestBody = JSON.stringify({
            agile_followup: time,
            agile_followuprequired: "1"
        });
        console.log("request body is", requestBody);
        fetch(BASE_URL + OPPORTUNITY_ENDPOINT + "(" + opportunityId + ")", {
            method: 'PATCH',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: requestBody
        }).then((response) => {
            if (response.ok) {
                setLoading(false);
                !patchMode ? showSuccessToast("Successfully setup followup form") : showSuccessToast("Successfully updated followup form");
                navigation.navigate(Routes.FOLLOW_UP_LIST_SCREEN)
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'FOLLOW_UP_LIST' }]
                })
            }
            else {
                if (response.status == 401) {
                    showErrorToast("User session expired!")
                    signOut();
                }
                response.json().then((body) => {
                    errorMessage = body.error.message;
                    showErrorToast(errorMessage);
                });
            }
        }).catch(error => {
            showErrorToast("Error while submitting the form. Please try again!");
        })
    }

    const component1 = () =>
        <View style={{ flexDirection: 'row' }}>
            <IconX
                style={{ marginRight: 8 }}
                origin={ICON_TYPE.ICONICONS}
                name={'book-outline'}
                color="black"
            />
            <Text style={{ fontFamily: Fonts.type.semiBold, fontSize: 16 }}>Booking</Text>
        </View>
    const component2 = () =>
        <View style={{ flexDirection: 'row' }}>
            <IconX
                style={{ marginRight: 8 }}
                origin={ICON_TYPE.ICONICONS}
                name={'bicycle-outline'}
                color="black"
            />
            <Text style={{ fontFamily: Fonts.type.semiBold, fontSize: 16 }}>Test Ride</Text>
        </View>
    const component3 = () =>
        <View style={{ flexDirection: 'row' }}>
            <IconX
                style={{ marginRight: 8 }}
                origin={ICON_TYPE.MATERIAL_ICONS}
                name={'assignment'}
                color="black"
            />
            <Text style={{ fontFamily: Fonts.type.semiBold, fontSize: 16 }}>Assign</Text>
        </View>
    const [index, setIndex] = React.useState(1);
    const buttons = [{ element: component1 }, { element: component2 }, { element: component3 }]

    const updateIndex = (selectedIndex) => {
        console.log("selected index is", selectedIndex);
        setIndex(selectedIndex);
        if (selectedIndex == 0) {
            if (dataOptionSet.opportunityId !== null) {
                navigation.navigate(Routes.BOOKING_FORM_SCREEN, route.params = {
                    passingProp: passingProp
                })
            } else {
                showInfoToast("Lead not qualified. Please qualify to proceed to booking")
            }
        }
        if (selectedIndex == 1) {
            if (dataOptionSet.opportunityId !== null) {
                navigation.navigate(Routes.TEST_RIDE_FORM_SCREEN, route.params = {
                    passingProp: passingProp,
                    flag: 2
                })
            } else {
                showInfoToast("Lead not qualified. Please qualify to proceed for test ride")
            }
        }
    }
    const { selectedIndex } = index;


    console.log("passed date is", date);
    console.log("passed time is", time);
    return (
        <SafeAreaView style={{ width: '100%', flex: 1, backgroundColor: "#ffffff" }}>

            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
            {loading &&
                <AnimatedLoader
                    visible={true}
                    overlayColor="rgba(255,255,255,0.95)"
                    source={require("../../../loader.json")}
                    animationStyle={styles.lottie}
                    speed={1}
                />
            }
            {!loading &&

                <View style={{ backgroundColor: '#ffffff', marginTop: 24, flex: 1 }}>

                    <View style={styles.body}>
                        <HeaderText>Follow Up</HeaderText>
                        {editMode ?
                            <TouchableOpacity onPress={() => {
                                setEditMode(false);
                                setReload(true);
                                setPatchMode(true);
                                setPostUrl(BASE_URL + OPPORTUNITY_ENDPOINT + '(' + bookingId + ')');
                            }}>
                                <IconX
                                    style={{ marginRight: 8, alignSelf: "flex-end" }}
                                    origin={ICON_TYPE.ICONICONS}
                                    name={'create-outline'}
                                    color="black"
                                />
                            </TouchableOpacity>
                            : null}
                    </View>
                    <View style={{ marginBottom: 42, paddingBottom: 16, flex: 1 }}>

                        <ButtonGroup
                            onPress={updateIndex}
                            selectedIndex={selectedIndex}
                            buttons={buttons}
                            containerStyle={{ height: 32 }} />



                    </View>
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

                        <Formik
                            initialValues={{
                                nextButton: false,

                            }}
                            onSubmit={onFormSubmit}


                        >

                            {formikProps => (
                                <SafeAreaView style={{ marginLeft: 16, marginTop: 13, flex: 1 }}>
                                    <View style={{ flexDirection: 'row', marginTop: 8 }}>
                                        <StyledInput
                                            uneditable={true}
                                            label="First Name"
                                            formikProps={formikProps}
                                            formikKey="firstName"
                                            passedValue={leadParentData.firstName}
                                        />

                                        <StyledInput
                                            uneditable={true}
                                            label="Last Name"
                                            formikProps={formikProps}
                                            formikKey="lastName"
                                            passedValue={leadParentData.lastName}
                                        />
                                    </View>
                                    <StyledInput
                                        uneditable={true}
                                        label="Mobile Number"
                                        formikProps={formikProps}
                                        formikKey="phoneNumber"
                                        passedValue={leadParentData.phone}
                                    />

                                    <StyledInput
                                        uneditable={true}
                                        label="Email Address"
                                        formikProps={formikProps}
                                        formikKey="emailAddress"
                                        passedValue={leadParentData.email}
                                    />

                                    <Text style={styles.textLabelStyle}>Follow Up Date</Text>

                                    <View style={{ marginTop: -16,marginBottom:8 }}>
                                        <DateComponent
                                            edit={!editMode ? true : false}
                                            date={dataOptionSet.followUpDate !== null ? dataOptionSet.followUpDate : new Date()}
                                            getData={(data) => {
                                                setDate(data)
                                            }} />
                                    </View>


                                    <Text style={styles.textLabelStyle}>Follow Up Time</Text>

                                    <View style={{ marginTop: -16 }}>
                                        <TimeComponent
                                            edit={!editMode ? true : false}
                                            date={dataOptionSet.followUpDate !== null ? dataOptionSet.followUpDate : new Date()}
                                            getTime={(data) => {
                                                setTime(data)
                                            }} />
                                    </View>

                                    <View style={{
                                        marginTop: 8,
                                        marginBottom: 16,
                                        marginLeft: 16,

                                    }}>

                                        <ButtonX
                                            loading={editMode ? true : false}
                                            dark={true}
                                            style={styles.ovalButton}
                                            color={defaultTheme.colors.primary}
                                            onPress={formikProps.handleSubmit}
                                            label={t('Save')}
                                        />
                                    </View>
                                </SafeAreaView>

                            )}
                        </Formik>
                    </ScrollView>
                </View>
            }
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    textLabelStyle: {
        fontSize: 14,
        fontFamily: Fonts.type.primary,
        lineHeight: 16,
        marginTop: 2,
        marginBottom: 4,
        marginLeft: 4,
        color: '#333333',
    },
    ovalButton: {
        borderRadius: 24,
        width: "90%",
        marginRight: 16,
    },
    ovalButtonQualify: {
        borderRadius: 24,
        width: "40%",
        marginLeft: 8
    },

    body: {
        color: '#3D213B',
        marginTop: 8,
        paddingLeft: 4,
        paddingBottom: 8,
    },
    head: {
        flexDirection: 'row',
        height: 50,
        marginTop: 8,
        marginLeft: 16,
        marginTop: 13,
        marginBottom: 13,
    },
    centerStyle: {
        width: 246,
        height: 24,
        marginBottom: 24,
        fontSize: 18,
        flexDirection: 'column',
        lineHeight: 21,
        textAlign: 'center',
        fontWeight: '600',
        alignSelf: 'center',
        justifyContent: 'center',
        alignContent: 'center'
    },
    countryCodeStyle: {
        height: 45,
        fontSize: 14,
        lineHeight: 16,
        width: 105,
        alignItems: 'center',
        marginLeft: 24,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#EDEDED',
        borderRadius: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
    },
    phoneNumberStyle: {
        height: 45,
        fontSize: 14,
        lineHeight: 16,
        width: 100,
        fontWeight: '500',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#EDEDED',
        borderRadius: 3,
        marginRight: 13,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
    },
    searchSection: {
        flexDirection: 'row',
    },
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    radio: {
        marginTop: 4,
        marginRight: 12,
        color: 'red'
    },
    lottie: {
        width: 100,
        height: 100
    },
    dropDownStyle: {
        height: 45,

        fontSize: 14,
        lineHeight: 16,
        alignSelf: 'stretch',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#EDEDED',
        borderRadius: 3,
        marginRight: 8,
        marginTop: 20,
        marginBottom: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
    },
})

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 12,
        lineHeight: 14,
        marginTop: 2,
        marginBottom: 4,
        marginLeft: 4,
        color: '#333333',
        paddingRight: 10, // to ensure the text is never behind the icon
    },
    inputAndroid: {
        fontSize: 14,
        paddingVertical: 8,
        marginLeft: 8,
        fontFamily: Fonts.type.primary,
        borderRadius: 8,
        color: '#333333',
        // to ensure the text is never behind the icon
    },
});

export default FollowUpForm;
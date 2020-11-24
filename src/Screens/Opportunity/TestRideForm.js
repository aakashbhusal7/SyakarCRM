import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { Dimensions, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import AnimatedLoader from 'react-native-animated-loader';
import { BASE_URL, OPPORTUNITY_ENDPOINT } from 'react-native-dotenv';
import { ButtonGroup } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as yup from 'yup';
import { ButtonX, HeaderButton } from '../../Components';
import { AuthContext } from '../../Components/context';
import HeaderText from '../../Components/HeaderText';
import useTranslation from '../../i18n';
import { IconX, ICON_TYPE } from '../../Icons';
import { showErrorToast, showSuccessToast } from '../../Lib/Toast';
import Routes from '../../Navigation/Routes';
import defaultTheme from '../../Themes';
import theme from '../../Themes/configs/default';
import Fonts from '../../Themes/Fonts';

var width = Dimensions.get('window').width;

const StyledInput = ({ label, formikProps, uneditable, passedValue, formikKey, ...rest }) => {
    const inputStyles = {
        height: 45,
        width: width / 1.115,
        fontSize: 14,
        fontFamily: Fonts.type.primary,
        color: !uneditable ? "#333333" : "#333333",
        lineHeight: 16,
        alignSelf: 'stretch',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#EDEDED',
        borderRadius: 3,
        marginRight: 8,
        paddingLeft: 16,
        marginBottom: formikKey == "feedback" ? 92 : 0,
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
        fontFamily: Fonts.type.primary,
        alignItems: 'center'
    };
    const errorStylesLastName = {
        color: '#E41717',
        fontSize: 12,
        lineHeight: 12,
        marginLeft: 4,
        fontFamily: Fonts.type.primary,
        alignItems: 'center'
    };
    let lastName = false;

    if (formikProps.touched[formikKey] && formikProps.errors[formikKey]) {
        inputStyles.marginBottom = 5;
        errorStyles.marginBottom = 12;
    }

    return (
        <React.Fragment>

            <View style={{ backgroundColor: '#ffffff' }}>

                <Text style={styles.textLabelStyle}>{label}</Text>
                <View >
                    <TextInput
                        style={inputStyles}
                        defaultValue={passedValue != "null" ? passedValue : ''}
                        editable={uneditable ? false : true}
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

const TestRideForm = (props) => {
    const { signOut } = React.useContext(AuthContext);
    const [editMode, setEditMode] = React.useState(false);
    const [postUrl, setPostUrl] = React.useState(BASE_URL + OPPORTUNITY_ENDPOINT);
    const [token, setToken] = useState();
    const { t } = useTranslation();
    const route = useRoute();
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const [opportunityStatus, setOpportunityStatus] = React.useState();
    const [complete, setComplete] = useState(false);
    const [dataOptionSet, setDataOptionSet] = React.useState({
        licenseNumber: undefined,
        existingVehicle: undefined,
        feedback: undefined,
        name: undefined,
        emailAddress: undefined,
    });
    const [leadParentData, setLeadParentData] = React.useState({
        firstName: undefined,
        lastName: undefined,
        email: undefined,
        subject: undefined,
    })
    const [reload, setReload] = React.useState(false);
    const [patchMode, setPatchMode] = React.useState(false);

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

    } 

    React.useEffect(() => {
        const _toggleDrawer = () => {
            navigation.toggleDrawer();
        };


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
        }
    }
    React.useEffect((async) => {
        retrieveToken();

    }, [])

    async function retrieveToken() {
        try {
            const value = await AsyncStorage.getItem('@token_key');
            if (value !== null) {
                setToken(value);
                fetchOpportunityStatus(value)
            }
        } catch (error) {
            console.log("error is", error);
        }
    }

    async function fetchOpportunityStatus(token) {
        setLoading(true);
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

                if (data.agile_interested == 2) {
                    //setLoading(true);
                    fetchExistingTestRide(token)
                } else {
                    setLoading(false);
                }

            }
        } else {
            if (res.status == 401) {
                signOut();
            }
            showErrorToast("Error loading the data")
        }
        return opportunityStatus;
    }


    function fetchExistingTestRide(token) {
        let errorMessage = '';
        if (bookingId !== '' || opportunityId !== '') {
            fetch("https://syakarhonda.api.crm5.dynamics.com/api/data/v9.1/opportunities(" + opportunityId + ")", {
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then((res) => {
                if (res.ok) {
                    res.json().then(
                        (resJson) => {
                            fetchParentLeadData(resJson._originatingleadid_value, token);
                            setDataOptionSet({
                                licenseNumber: "" + resJson.agile_testridelicense,
                                existingVehicle: "" + resJson.agile_testrideexistingvechile,
                                feedback: "" + resJson.agile_testridefeedback,
                                name: "" + resJson.name,
                                email: "" + resJson.emailaddress,

                            })
                            setEditMode(true);
                            setLoading(false);

                        })
                } else {
                    setLoading(false);
                    if (res.status == 401) {
                        signOut();
                    }
                    res.json().then((body) => {
                        errorMessage = body.error.message;
                        showErrorToast(errorMessage)
                        console.log("error message is", errorMessage);
                    });
                }
            })
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
                            subject: "" + resJson.subject,
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
                });

            }
        })
    }

    console.log("data option sets are", dataOptionSet);

    const onFormSubmit = (values) => {
        postForm(values.licenseNumber, values.existingVehicle, values.feedback, subject)
    }

    const postForm = (licenseNumber, vehicle, feedback, subject) => {
        let requestBody;
        let errorMessage = '';
        requestBody = JSON.stringify({
            agile_testridelicense: licenseNumber,
            agile_testrideexistingvechile: vehicle,
            agile_testridefeedback: feedback,
            agile_interested: "2",
            name: subject !== '' ? subject : dataOptionSet.name
        });
        if (opportunityId !== undefined) {
            fetch(BASE_URL + OPPORTUNITY_ENDPOINT + "(" + opportunityId + ")", {
                method: 'PATCH',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: requestBody
            }).then((response) => {
                if (response.ok) {
                    setComplete(true);
                    setLoading(false);
                    !patchMode ? showSuccessToast("Successfully setup test ride form") : 
                    showSuccessToast("Successfully updated test ride form");
                    navigation.navigate(Routes.TEST_RIDE_LIST_SCREEN)
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'TEST_RIDE_LIST' }]
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

    }

    const component1 = () =>
        <View style={{ flexDirection: 'row' }}>
            <IconX
                style={{ marginRight: 8 }}
                origin={ICON_TYPE.MATERIAL_ICONS}
                name={'assignment'}
                color="black"
            />
            <Text style={{ fontFamily: Fonts.type.semiBold, fontSize: 16 }}>
                Lead
            </Text>
        </View>
    const component2 = () =>
        <View style={{ flexDirection: 'row' }}>
            <IconX
                style={{ marginRight: 8 }}
                origin={ICON_TYPE.ICONICONS}
                name={'book-outline'}
                color="black"
            />
            <Text style={{ fontFamily: Fonts.type.semiBold, fontSize: 16 }}>Booking
            </Text>
        </View>
    const component3 = () =>
        <View style={{ flexDirection: 'row' }}>
            <IconX
                style={{ marginRight: 8 }}
                origin={ICON_TYPE.ICONICONS}
                name={'call-outline'}
                color="black"
            />
            <Text style={{ fontFamily: Fonts.type.semiBold, fontSize: 16 }}>
                Follow Up
            </Text>
        </View>
    const [index, setIndex] = React.useState(1);
    const buttons = [{ element: component1 }, { element: component2 }, { element: component3 }]

    const updateIndex = (selectedIndex) => {
        console.log("selected index is", selectedIndex);
        setIndex(selectedIndex);
        if (selectedIndex == 0) {
            navigation.navigate(Routes.LEAD_SCREEN)
        }
        if (selectedIndex == 1) {
            navigation.navigate(Routes.BOOKING_FORM_SCREEN)
        }
    }
    const { selectedIndex } = index;

    function displayLeadInfo(formikProps) {
        let element;
        if (editMode) {
            element = (
                <View>
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
                    <StyledInput
                        uneditable={true}
                        label="Email"
                        formikProps={formikProps}
                        formikKey="email"
                        passedValue={leadParentData.email}
                    />
                </View>

            );
        } else {
            element = null;
        }
        return element;
    }


    return (
        <SafeAreaView style={{ width: '100%', flex: 1, backgroundColor: '#ffffff' }}>
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
                        <HeaderText>Test Ride</HeaderText>
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

                    <View style={{ paddingBottom: 16 }}>
                        <ButtonGroup
                            onPress={updateIndex}
                            selectedIndex={selectedIndex}
                            buttons={buttons}
                            containerStyle={{ height: 32 }} />

                    </View>

                    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

                        <Formik

                            onSubmit={onFormSubmit}
                            initialValues={{
                                licenseNumber: dataOptionSet.licenseNumber,
                                existingVehicle: dataOptionSet.existingVehicle,
                                feedback: dataOptionSet.feedback,

                            }}

                        >
                            {formikProps => (

                                <SafeAreaView style={{ marginLeft: 16, marginTop: 13, flex: 1 }}>


                                    {displayLeadInfo(formikProps)}

                                    <StyledInput
                                        uneditable={editMode ? true : false}
                                        label="License No."
                                        formikProps={formikProps}
                                        formikKey="licenseNumber"
                                        passedValue={dataOptionSet.licenseNumber}
                                    />

                                    <StyledInput
                                        uneditable={editMode ? true : false}
                                        label="Existing Vehicle"
                                        formikProps={formikProps}
                                        formikKey="existingVehicle"
                                        passedValue={dataOptionSet.existingVehicle}
                                    />

                                    <StyledInput
                                        uneditable={editMode ? true : false}
                                        label="Feedback"
                                        formikProps={formikProps}
                                        formikKey="feedback"
                                        passedValue={dataOptionSet.feedback}
                                    />

                                    <View style={{
                                        position: 'absolute',
                                        bottom: 16,
                                        left: 0,
                                        right: 0,
                                        flex: 1,
                                        justifyContent: 'space-around',
                                        flexDirection: 'row',

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
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    textLabelStyle: {
        fontSize: 15,
        fontFamily: Fonts.type.primary,
        lineHeight: 14,
        marginTop: 2,
        marginBottom: 4,
        marginLeft: 4,
        color: '#333333',
    },
    ovalButton: {
        borderRadius: 24,
        width: "90%",
        marginRight: 16,
        marginBottom: 16,
    },
    ovalButtonQualify: {
        borderRadius: 24,
        width: "40%",
        marginRight: 16,
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
    lottie: {
        width: 100,
        height: 100
    },
    radio: {
        marginTop: 4,
        marginRight: 12,
        color: 'red'
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

export default TestRideForm;
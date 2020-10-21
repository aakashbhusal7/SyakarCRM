import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { Dimensions, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { BASE_URL, OPPORTUNITY_ENDPOINT } from 'react-native-dotenv';
import * as yup from 'yup';
import { ButtonX, HeaderButton } from '../../Components';
import HeaderText from '../../Components/HeaderText';
import useTranslation from '../../i18n';
import { IconX, ICON_TYPE } from '../../Icons';
import { showErrorToast, showSuccessToast } from '../../Lib/Toast';
import defaultTheme from '../../Themes';
import theme from '../../Themes/configs/default';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import Routes from '../../Navigation/Routes';
import Fonts from '../../Themes/Fonts';
import { ButtonGroup } from 'react-native-elements';
import { AuthContext } from '../../Components/context';
import { TouchableOpacity } from 'react-native-gesture-handler';

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
                        defaultValue={passedValue}
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



const validationSchema = yup.object().shape({
    firstName: yup
        .string()
        .label('FirstName')
        .min(2)
        .required('* First name is required'),
    lastName: yup
        .string()
        .label('Last Name')
        .min(2)
        .required('* Last name is required'),
    phoneNumber: yup
        .number()
        .label('Phone')
        .min(2)
        .required('* Phone no is required'),

});
const TestRideForm = (props) => {
    const { signOut } = React.useContext(AuthContext);
    const [editMode, setEditMode] = React.useState(false);
    const [postUrl, setPostUrl] = React.useState(BASE_URL + OPPORTUNITY_ENDPOINT);
    const [token, setToken] = useState();
    const { t } = useTranslation();
    const route = useRoute();
    const navigation = useNavigation();
    const [complete, setComplete] = useState(false);
    const [dataOptionSet, setDataOptionSet] = React.useState({
        licenseNumber: undefined,
        existingVehicle: undefined,
        feedback: undefined,
        name: undefined,
        emailAddress: undefined,
    });
    const [reload, setReload] = React.useState(false);
    const [patchMode, setPatchMode] = React.useState(false);

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
    React.useEffect((async) => {
        retrieveToken();

    }, [])

    let interest = '';
    let email = '';
    let subject = '';
    if (route.params !== undefined) {
        //console.log("passed props is", route.params.flag);
        if (route.params.passingProp != undefined) {
            interest = route.params.passingProp.flag;
            email = route.params.passingProp.email;
            subject = "Interested in " + route.params.passingProp.modelName;
        }
    }

    else {
        console.log("undefined props");
    }

    async function retrieveToken() {
        try {
            const value = await AsyncStorage.getItem('@token_key');
            if (value !== null) {
                setToken(value);
                if (reload == false) {
                    fetchExistingTestRide(value)
                }
                console.log("token is= " + value);
            }
        } catch (error) {
            console.log("error is", error);
        }
    }

    function fetchExistingTestRide(token) {
        let errorMessage = '';
        if (bookingId !== '') {
            fetch("https://syakarhonda.api.crm5.dynamics.com/api/data/v9.1/opportunities(" + bookingId + ")", {
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then((res) => {
                if (res.ok) {
                    res.json().then(
                        (resJson) => {
                            setDataOptionSet({
                                licenseNumber: resJson.agile_testridelicense,
                                existingVehicle: resJson.agile_testrideexistingvechile,
                                feedback: resJson.agile_testrideexistingvechile,
                                name: "Interested in" + resJson.name,
                                email: resJson.emailaddress,

                            })
                            setEditMode(true);
                            //setLoading(false);

                        })
                } else {
                    if (res.status == 401) {
                        signOut();
                    }
                    res.json().then((body) => {
                        errorMessage = body.error.message;
                        showErrorToast(errorMessage)
                        console.log("error message is", errorMessage);
                    });
                    console.log("error in edit lead form");
                }
            })
        }
    }

    const onFormSubmit = (values) => {

        postForm(values.licenseNumber, values.existingVehicle, values.feedback, interest, subject, email)
    }

    const postForm = (licenseNumber, vehicle, feedback, interest) => {
        let requestBody;
        let errorMessage = '';
        requestBody = JSON.stringify({
            agile_testridelicense: licenseNumber,
            agile_testrideexistingvechile: vehicle,
            agile_testridefeedback: feedback,
            agile_interested: interest,
            name: subject,
            emailaddress: email
        })
        if (patchMode) {
            requestBody = JSON.stringify({
                agile_testridelicense: licenseNumber,
                agile_testrideexistingvechile: vehicle,
                agile_testridefeedback: feedback
            })
            fetch(postUrl, {
                method: !patchMode ? 'POST' : 'PATCH',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: requestBody
            }).then((response) => {
                if (response.ok) {
                    setComplete(true);
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
        fetch(postUrl, {
            method: !patchMode ? 'POST' : 'PATCH',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: requestBody
        }).then((response) => {
            if (response.ok) {
                setComplete(true);
                !patchMode ? showSuccessToast("Successfully setup test ride form") : showSuccessToast("Successfully updated test ride form");
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


    return (
        <SafeAreaView style={{ width: '100%', flex: 1, backgroundColor: '#ffffff' }}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

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
                            <Text style={{ alignSelf: "flex-end", fontSize: 20, fontFamily: Fonts.type.primary, paddingEnd: 16 }}>Edit</Text>
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
                            firstName: '',
                            lastName: '',

                        }}

                    >
                        {formikProps => (

                            <SafeAreaView style={{ marginLeft: 16, marginTop: 13, flex: 1 }}>

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

                                        dark={true}
                                        style={styles.ovalButton}
                                        color={defaultTheme.colors.primary}
                                        onPress={formikProps.handleSubmit}
                                        label={t('Save')}
                                    />

                                    <ButtonX

                                        dark={true}
                                        style={styles.ovalButtonQualify}
                                        color={defaultTheme.colors.qualify}
                                        onPress={formikProps.handleSubmit}
                                        label={t('Next')}
                                    />

                                </View>

                            </SafeAreaView>


                        )}
                    </Formik>

                </ScrollView>
            </View>
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
        width: "40%",
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
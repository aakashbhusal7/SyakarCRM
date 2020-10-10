import AsyncStorage from '@react-native-community/async-storage';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { Dimensions, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import * as yup from 'yup';
import { ButtonX, HeaderButton } from '../../Components';
import HeaderText from '../../Components/HeaderText';
import useTranslation from '../../i18n';
import defaultTheme from '../../Themes';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BASE_URL, OPPORTUNITY_ENDPOINT } from 'react-native-dotenv';
import { showErrorToast, showSuccessToast } from '../../Lib/Toast';
import { sub } from 'react-native-reanimated';
import theme from '../../Themes/configs/default';
import { ICON_TYPE } from '../../Icons';

var width = Dimensions.get('window').width;

const StyledInput = ({ label, formikProps, formikKey, ...rest }) => {
    const inputStyles = {
        height: 45,
        width: width / 1.115,
        fontSize: 14,
        fontFamily: "WorkSans-Medium",
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

    return (
        <React.Fragment>

            <View style={{ backgroundColor: '#ffffff' }}>

                <Text style={styles.textLabelStyle}>{label}</Text>
                <View >
                    <TextInput
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
    const [token, setToken] = useState();
    const { t } = useTranslation();
    const route = useRoute();
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
    React.useEffect((async) => {
        retrieveToken();

    }, [])

    let interest = '';
    let email = '';
    let subject = '';
    if (route.params !== undefined) {
        console.log("passed props is", route.params.flag);
        interest = route.params.flag;
        email = route.params.email;
        subject = "Interested in " + route.params.subject;
    }

    else {
        console.log("undefined props");
    }

    async function retrieveToken() {
        try {
            const value = await AsyncStorage.getItem('@token_key');
            if (value !== null) {
                setToken(value);
                fetchProducts(value);
                console.log("token is= " + value);
            }
        } catch (error) {
            console.log("error is", error);
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
        fetch(BASE_URL + OPPORTUNITY_ENDPOINT, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: requestBody
        }).then((response) => {
            if (response.ok) {
                showSuccessToast("Successfully setup test ride form")
            }
            else {
                response.json().then((body) => {
                    errorMessage = body.error.message;
                    showErrorToast(errorMessage);
                });
            }
        }).catch(error => {
            showErrorToast("Error while submitting the form. Please try again!");
        })
    }


    return (
        <SafeAreaView style={{ width: '100%', flex: 1, backgroundColor: '#ffffff' }}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

            <View style={{ backgroundColor: '#ffffff', marginTop: 24, flex: 1 }}>

                <View style={styles.body}>
                    <HeaderText>Test Ride</HeaderText>
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
                                    label="License No."
                                    formikProps={formikProps}
                                    formikKey="licenseNumber" />

                                <StyledInput
                                    label="Existing Vehicle"
                                    formikProps={formikProps}
                                    formikKey="existingVehicle" />

                                <StyledInput
                                    label="Feedback"
                                    formikProps={formikProps}
                                    formikKey="feedback" />




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
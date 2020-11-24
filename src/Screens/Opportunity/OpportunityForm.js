import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { Dimensions, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { ProgressStep, ProgressSteps } from 'react-native-progress-steps';
import * as yup from 'yup';
import { ButtonX, HeaderButton } from '../../Components';
import HeaderText from '../../Components/HeaderText';
import useTranslation from '../../i18n';
import { ICON_TYPE } from '../../Icons';
import Routes from '../../Navigation/Routes';
import defaultTheme from '../../Themes';
import theme from '../../Themes/configs/default';
import Fonts from '../../Themes/Fonts';
import { FollowUpConstants } from '../../Utils/OpportunityConstants/FollowUpConstants';
import { InterestConstants } from '../../Utils/OpportunityConstants/InterestConstants';

var width = Dimensions.get('window').width;

const StyledInput = ({ label, formikProps, uneditable, passedValue, formikKey, ...rest }) => {
    const inputStyles = {
        height: 45,
        width: width / 1.115,
        color: !uneditable ? "black" : "#979797",
        fontSize: 14,
        fontFamily: Fonts.type.primary,
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
    if (formikKey == 'firstName') {
        inputStyles.width = width / 2.25
    }
    if (formikKey == 'modelName') {
        inputStyles.width = width / 2.25
    }
    if (formikKey == 'colorName') {
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
                        style={inputStyles}
                        value={passedValue}
                        editable={passedValue !== undefined ? false : true}
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


const OpportunityForm = (props) => {

    const navigation = useNavigation();
    const [token, setToken] = useState();
    const [checked, setChecked] = useState(FollowUpConstants[1].value);
    const [interest, setInterest] = useState(InterestConstants[0].value);
    const { t } = useTranslation();
    const route = useRoute();
    const [startDate, setStartDate] = useState(new Date().toString().substring(4, 16));


    let firstName = '';
    let lastName = '';
    let modelName = '';
    let colorName = '';
    let email = '';
    let productId='';``
    let opportunityId='';

    if (route.params !== undefined) {
        console.log("first name is", route.params.firstName);
        firstName = route.params.firstName;
        lastName = route.params.lastName;
        modelName = route.params.model;
        colorName = route.params.color;
        email = route.params.email;
        productId=route.params.productId;
        opportunityId=route.params.opportunityId;
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
    React.useEffect((async) => {
        retrieveToken();

    }, [])

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

    const displayFollowUpFields = (props) => {
        let element;
        if (checked == 1) {
            element = (
                <View>
                   
                    <StyledInput
                        label="Follow Up Date"
                        formikProps={props}
                        formikKey="followUpDate"
                    />
                    <StyledInput
                        label="Follow Up Time"
                        formikProps={props}
                        formikKey="followUpTime"
                    />


                </View>
            )
        }
        else {
            element = null;
        }
        return element;
    }

    const onFormSubmit = (values) => {

        if (interest == 2) {
            navigation.navigate(Routes.TEST_RIDE_FORM_SCREEN, { "flag": 2, email: email, subject: modelName });
        } else if (interest == 1) {
            navigation.navigate(Routes.BOOKING_FORM_SCREEN,{"flag":1,productId:productId,opportunityId:opportunityId,productName:modelName});
        }

    }

    return (
        <SafeAreaView style={{ width: '100%', flex: 1, backgroundColor: '#ffffff' }}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        
            <View style={{ backgroundColor: '#ffffff', marginTop: 24, flex: 1 }}>

                <View style={styles.body}>
                    <HeaderText>Opportunity</HeaderText>
                </View>
                <View style={{marginBottom:82,paddingBottom:16}}>
                <ProgressSteps 
                        style={{flex:1}}
                      topOffset={10}
                       activeStepIconBorderColor="red" 
                       completedProgressBarColor="red"
                       activeLabelColor="red" 
                       activeStep={1}>
                           <ProgressStep label="Lead Info" nextBtnText="" previousBtnText="" removeBtnRow={true}>
                               
                           </ProgressStep>
                           <ProgressStep label="Opportunity" nextBtnText="" previousBtnText=""removeBtnRow={true}>
                              
                           </ProgressStep>
                           <ProgressStep label="Confirm" nextBtnText="" previousBtnText="" finishBtnText=""removeBtnRow={true}>
                               
                           </ProgressStep>
                       </ProgressSteps>
                       </View>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

                    <Formik
                        initialValues={{
                            firstName: { firstName },
                            lastName: { lastName },

                        }}
                        onSubmit={onFormSubmit}


                    >
                        {formikProps => (

                            <SafeAreaView style={{ marginLeft: 16, marginTop: 13, flex: 1 }}>

                                <View style={{ flexDirection: 'row' }}>
                                    <StyledInput
                                        label="Model"
                                        formikProps={formikProps}
                                        passedValue={modelName}
                                        uneditable
                                        formikKey="modelName"
                                    />

                                    <StyledInput
                                        label="Color"
                                        formikProps={formikProps}
                                        passedValue={colorName}
                                        uneditable
                                        formikKey="colorName" />
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <StyledInput
                                        label="First Name"
                                        formikProps={formikProps}
                                        passedValue={firstName}
                                        uneditable
                                        formikKey="firstName"
                                    />

                                    <StyledInput
                                        label="Last Name"
                                        formikProps={formikProps}
                                        passedValue={lastName}
                                        uneditable
                                        formikKey="lastName" />
                                </View>

                                <Text
                                    style={styles.textLabelStyle} >
                                    Follow Up Required
                                        </Text>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 8, marginBottom: 8 }}>
                                    <View style={{ flexDirection: 'row' }}>

                                        <RadioButton
                                            color="black"
                                            uncheckedColor="black"
                                            value={FollowUpConstants[0].value}
                                            status={checked === FollowUpConstants[0].value ? 'checked' : 'unchecked'}
                                            onPress={() => setChecked(FollowUpConstants[0].value)}
                                        />
                                        <Text style={{ color: '#979797', alignSelf: 'center' }}>{FollowUpConstants[0].label}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignSelf: 'center', alignContent: 'space-around' }}>

                                        <RadioButton
                                            color="black"
                                            uncheckedColor="black"
                                            value={FollowUpConstants[1].value}
                                            status={checked === FollowUpConstants[1].value ? 'checked' : 'unchecked'}
                                            onPress={() => setChecked(FollowUpConstants[1].value)}
                                        />
                                        <Text style={{ color: '#979797', alignSelf: 'center' }}>{FollowUpConstants[1].label}</Text>
                                    </View>
                                </View>

                                <View>
                                    {displayFollowUpFields(formikProps)}
                                </View>


                                <Text
                                    style={styles.textLabelStyle} >
                                    Interested In
                                        </Text>



                                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 8, marginBottom: 24, paddingBottom: 48 }}>
                                    <View style={{ flexDirection: 'row', paddingBottom: 24 }}>

                                        <RadioButton
                                            color="black"
                                            uncheckedColor="black"
                                            value={InterestConstants[0].value}
                                            status={interest === InterestConstants[0].value ? 'checked' : 'unchecked'}
                                            onPress={() => setInterest(InterestConstants[0].value)}
                                        />
                                        <Text style={{ color: '#979797', alignSelf: 'center' }}>{InterestConstants[0].label}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', paddingBottom: 24 }}>

                                        <RadioButton
                                            color="black"
                                            uncheckedColor="black"
                                            value={InterestConstants[1].value}
                                            status={interest === InterestConstants[1].value ? 'checked' : 'unchecked'}
                                            onPress={() => setInterest(InterestConstants[1].value)}
                                        />
                                        <Text style={{ color: '#979797', alignSelf: 'center' }}>{InterestConstants[1].label}</Text>
                                    </View>
                                </View>



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
    )
}

export default OpportunityForm

const styles = StyleSheet.create({
    textLabelStyle: {
        fontSize: 15,
        lineHeight: 14,
        marginTop: 2,
        marginBottom: 4,
        marginLeft: 4,
        fontFamily:Fonts.type.primary,
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


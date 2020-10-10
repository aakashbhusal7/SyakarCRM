import React, { useState } from 'react';
import { Dimensions, TextInput, StatusBar, SafeAreaView, View, Text, StyleSheet, ScrollView } from 'react-native';
import { ButtonX, HeaderButton } from '../../Components';
import HeaderText from '../../Components/HeaderText';
import { RadioButton } from 'react-native-paper';
import * as yup from 'yup';
import useTranslation from '../../i18n';
import Routes from '../../Navigation/Routes';
import defaultTheme from '../../Themes';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import { Formik } from 'formik';
import { FollowUpConstants } from '../../Utils/OpportunityConstants/FollowUpConstants';
import { InterestConstants } from '../../Utils/OpportunityConstants/InterestConstants';
import RNPickerSelect from 'react-native-picker-select';
import { PurchaseTimeConstants } from '../../Utils/BookingFormConstants/PurchaseTimeConstants';
import { PaymentModeConstants } from '../../Utils/BookingFormConstants/PaymentModeConstants';
import { FinanceChoiceConstants } from '../../Utils/BookingFormConstants/FinanceChoiceConstants';
import { RevenueConstants } from '../../Utils/BookingFormConstants/RevenueConstants';
import { BASE_URL, CURRENCY_ENDPOINT, PRICE_ENDPOINT } from 'react-native-dotenv';
import theme from '../../Themes/configs/default';
import { ICON_TYPE } from '../../Icons';

var width = Dimensions.get('window').width;
var currencyList = [];
var currencyDataItems = [];
var priceList = [];
var priceListDataItems = [];

const dropDownStyle = {
    height: 45,
    width: width / 2.25,
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
const dropDownStyleModel = {
    height: 45,
    width: '100%',
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


const BookingForm = (props) => {

    const navigation=useNavigation();
    const [token, setToken] = useState();
    const [checked, setChecked] = useState(FollowUpConstants[0].value);
    const [interest, setInterest] = useState(InterestConstants[0].value);
    const { t } = useTranslation();
    const [dataOptionSet, setDataOptionSet] = React.useState({
        timeFrame: undefined,
        paymentMode: undefined,
        financeChoice: undefined,
        revenue: undefined,
    });
    const [currencyListData, setCurrencyListData] = useState([]);
    const [priceListData, setPriceListData] = useState([]);

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
    React.useEffect((async) => {
        retrieveToken();

    }, [])

    async function retrieveToken() {
        try {
            const value = await AsyncStorage.getItem('@token_key');
            if (value !== null) {
                setToken(value);
                fetchCurrencies(value);
                fetchPriceList(value);
                console.log("token is= " + value);
            }
        } catch (error) {
            console.log("error is", error);
        }
    }

    async function fetchCurrencies(token) {
        console.log("token is", token);
        const res = await fetch(BASE_URL + CURRENCY_ENDPOINT, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }

        })
        const data = await res.json();
        data.value.map((object, key) => currencyList.push(object));
        currencyDataItems = currencyList.map(object => ({
            label: object.isocurrencycode,
            value: object.transactioncurrencyid,
        }));


        console.log("currency list is", currencyDataItems);
    }

    async function fetchPriceList(token) {
        console.log("token is", token);
        const res = await fetch(BASE_URL + PRICE_ENDPOINT, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }

        })
        const data = await res.json();
        data.value.map((object, key) => priceList.push(object));
        priceListDataItems = priceList.map(object => ({
            label: object.name,
            value: object.pricelevelid,
        }));


        console.log("price list is", priceListDataItems);
    }



    const onFormSubmit = (values) => {

        console.log("next button value is", values);

    }

    const displayOtherFinanceOption = (props) => {
        let element;
        if (dataOptionSet.financeChoice == 2) {
            element = (
                <StyledInput
                    label="Finance Others"
                    formikProps={props}
                    formikKey="otherFinance"
                />
            )
        }
        else {
            element = null;
        }
        return element;
    }

    return (
        <SafeAreaView style={{ width: '100%', flex: 1, backgroundColor: '#ffffff' }}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

            <View style={{ backgroundColor: '#ffffff', marginTop: 24, flex: 1 }}>

                <View style={styles.body}>
                    <HeaderText>Booking</HeaderText>
                </View>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

                    <Formik
                        initialValues={{
                            firstName: '',
                            lastName: '',

                        }}
                        onSubmit={onFormSubmit}


                      >
                        {formikProps => (

                            <SafeAreaView style={{ marginLeft: 16, marginTop: 13, flex: 1 }}>

                                <View style={{ flexDirection: 'column', marginTop: 8,marginBottom:16 }}>
                                    <Text style={{ marginBottom: -16 }}>Purchase Time Frame</Text>
                                    <View style={dropDownStyleFull}>

                                        <RNPickerSelect
                                            items={PurchaseTimeConstants}
                                            onValueChange={value => {
                                                setDataOptionSet({
                                                    ...dataOptionSet, timeFrame: value,
                                                });
                                            }}
                                            style={pickerSelectStyles}
                                            value={dataOptionSet.timeFrame}
                                            useNativeAndroidPickerStyle={false}

                                        />
                                    </View>
                                </View>

                                <StyledInput
                                    label="Advance Amount"
                                    formikProps={formikProps}
                                    formikKey="advanceAmount" />

                                <View style={{ flexDirection: 'column', marginTop: 4 }}>
                                    <Text style={{ marginBottom: -16 }}>Mode Of Payment</Text>
                                    <View style={dropDownStyleFull}>

                                        <RNPickerSelect
                                            items={PaymentModeConstants}
                                            onValueChange={value => {
                                                setDataOptionSet({
                                                    ...dataOptionSet, paymentMode: value,
                                                });
                                            }}
                                            style={pickerSelectStyles}
                                            value={dataOptionSet.paymentMode}
                                            useNativeAndroidPickerStyle={false}

                                        />
                                    </View>
                                </View>

                                <View style={{ flexDirection: 'column', marginTop: 16 }}>
                                    <Text style={{ marginBottom: -16 }}>Finance Choices</Text>
                                    <View style={dropDownStyleFull}>

                                        <RNPickerSelect
                                            items={FinanceChoiceConstants}
                                            onValueChange={value => {
                                                setDataOptionSet({
                                                    ...dataOptionSet, financeChoice: value,
                                                });
                                            }}
                                            style={pickerSelectStyles}
                                            value={dataOptionSet.financeChoice}
                                            useNativeAndroidPickerStyle={false}

                                        />
                                    </View>
                                </View>

                                <View style={{marginTop:16,marginBottom:-8}}>
                                    {displayOtherFinanceOption(formikProps)}
                                </View>

                                <View style={{ flexDirection: 'column' }}>
                                    <Text style={{ marginBottom: -16,marginTop:12 }}>Currency</Text>
                                    <View style={dropDownStyle}>
                                        <RNPickerSelect
                                            items={currencyDataItems}
                                            onValueChange={(value) =>
                                                setCurrencyListData(value)
                                            }
                                            style={pickerSelectStyles}
                                            value={currencyListData}
                                            useNativeAndroidPickerStyle={false}

                                        />
                                    </View>
                                </View>

                                <View style={{ flexDirection: 'column', marginTop: 16,marginBottom:16 }}>
                                    <Text style={{ marginBottom: -16 }}>Revenue</Text>
                                    <View style={dropDownStyleFull}>

                                        <RNPickerSelect
                                            items={RevenueConstants}
                                            onValueChange={value => {
                                                setDataOptionSet({
                                                    ...dataOptionSet, revenue: value,
                                                });
                                            }}
                                            style={pickerSelectStyles}
                                            value={dataOptionSet.revenue}
                                            useNativeAndroidPickerStyle={false}

                                        />
                                    </View>
                                </View>

                                <View style={{ flexDirection: 'column',marginBottom:48,paddingBottom:48 }}>
                                    <Text style={{ marginBottom: -16 }}>Price</Text>
                                    <View style={dropDownStyle}>
                                        <RNPickerSelect
                                            items={priceListDataItems}
                                            onValueChange={(value) =>
                                                setPriceListData(value)
                                            }
                                            style={pickerSelectStyles}
                                            value={priceListDataItems}
                                            useNativeAndroidPickerStyle={false}

                                        />
                                    </View>
                                </View>

                                {/* <View style={{ flexDirection: 'column' }}>
                                    <Text style={{ marginBottom: -16 }}>Total Amount</Text>
                                    <View style={dropDownStyle}>
                                        <RNPickerSelect
                                            items={colorDataItems}
                                            onValueChange={(value) =>
                                                setColorsListData(value)
                                            }
                                            style={pickerSelectStyles}
                                            value={colorsListData}
                                            useNativeAndroidPickerStyle={false}

                                        />
                                    </View>
                                </View> */}





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

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 12,

        fontFamily: "WorkSans-Regular",
        lineHeight: 14,
        marginTop: 2,
        marginBottom: 4,
        marginLeft: 4,
        color: '#333333',
        paddingRight: 10, // to ensure the text is never behind the icon
    },
    inputAndroid: {
        fontSize: 16,
        paddingVertical: 8,


        borderRadius: 8,
        color: 'black',
        // to ensure the text is never behind the icon
    },
});
export default BookingForm

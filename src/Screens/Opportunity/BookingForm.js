import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { Dimensions, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { BASE_URL, CURRENCY_ENDPOINT, OPPORTUNITYPRODUCT_ENDPOINT, OPPORTUNITY_ENDPOINT, PRICE_ENDPOINT, PRODUCTS_ENDPOINT } from 'react-native-dotenv';
import { Overlay } from 'react-native-elements';
import RNPickerSelect from 'react-native-picker-select';
import { ProgressStep, ProgressSteps } from 'react-native-progress-steps';
import * as yup from 'yup';
import { ButtonX, HeaderButton } from '../../Components';
import HeaderText from '../../Components/HeaderText';
import useTranslation from '../../i18n';
import { ICON_TYPE } from '../../Icons';
import { showErrorToast, showSuccessToast } from '../../Lib/Toast';
import Routes from '../../Navigation/Routes';
import defaultTheme from '../../Themes';
import theme from '../../Themes/configs/default';
import Fonts from '../../Themes/Fonts';
import { FinanceChoiceConstants } from '../../Utils/BookingFormConstants/FinanceChoiceConstants';
import { PaymentModeConstants } from '../../Utils/BookingFormConstants/PaymentModeConstants';
import { PurchaseTimeConstants } from '../../Utils/BookingFormConstants/PurchaseTimeConstants';
import { RevenueConstants } from '../../Utils/BookingFormConstants/RevenueConstants';
import { FollowUpConstants } from '../../Utils/OpportunityConstants/FollowUpConstants';
import { InterestConstants } from '../../Utils/OpportunityConstants/InterestConstants';
import { OverrideenConstants } from '../../Utils/ProductConstants./OverriddenConstants';
import { PriceOverrideConstants } from '../../Utils/ProductConstants./PriceOverrideConstants';
import AnimatedLoader from "react-native-animated-loader";

var width = Dimensions.get('window').width;
var currencyList = [];
var currencyDataItems = [];
var priceList = [];
var priceListDataItems = [];
var unitList = [];
var unitDataItems = [];
var productList = [];
var productDataItems = [];
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
const dropDownStyleFullModal = {
    height: 45,
    width: width / 1.30,
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
const StyledInput = ({ label, formikProps, uneditable, passedValue, formikKey, type, ...rest }) => {
    const inputStyles = {
        height: 45,
        width: type == 'modal' ? width / 1.30 : width / 1.115,
        color: !uneditable ? "black" : "#979797",
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

    const navigation = useNavigation();
    const [token, setToken] = useState();
    const [checked, setChecked] = useState(FollowUpConstants[0].value);
    const [interest, setInterest] = useState(InterestConstants[0].value);
    const { t } = useTranslation();
    const [dataOptionSet, setDataOptionSet] = React.useState({
        timeFrame: undefined,
        paymentMode: undefined,
        financeChoice: undefined,
        revenue: undefined,
        productOverride: undefined,
        priceOverride: undefined
    });
    const [currencyListData, setCurrencyListData] = useState([]);
    const [priceListData, setPriceListData] = useState([]);
    const [unitListData, setUnitListData] = useState([]);
    const [uomId, setUomId] = useState();
    const route = useRoute();
    const [loading, setLoading] = useState(false);
    const [productsListData, setProductsListData] = useState(undefined);
    const [visible, setVisible] = useState(false);
    const [priceAmountValue, setPriceAmountValue] = useState("0");
    const toggleOverlay = () => {
        setVisible(!visible);
    };
    let productId = '';
    let opportunityId = '';
    let modelName = '';
    if (route.params !== undefined) {
        productId = route.params.productId;
        opportunityId = route.params.opportunityId;
        modelName = route.params.productName;
        console.log("passed product value is", route.params.productId);
        console.log("passed opportunity value is", route.params.opportunityId);
        console.log("passed model value is", route.params.productName);


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
    React.useEffect((async) => {
        retrieveToken();

    }, [])
    React.useEffect((async) => {
        fetchUnit();

    }, [uomId])

    async function retrieveToken() {
        try {
            const value = await AsyncStorage.getItem('@token_key');
            if (value !== null) {
                setToken(value);
                fetchCurrencies(value);
                fetchPriceList(value);
                fetchProducts(value);
                if (productId !== '') {
                    fetchUomId(value, productId);
                    fetchUnit(value, productId);
                }
                console.log("token is= " + value);
            }
        } catch (error) {
            console.log("error is", error);
        }
    }

    async function fetchProducts(token) {
        console.log("token is", token);
        const res = await fetch(BASE_URL + PRODUCTS_ENDPOINT, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }

        })
        const data = await res.json();
        data.value.map((object, key) => productList.push(object));
        productDataItems = productList.map(object => ({
            label: object.name,
            value: object.productid
        }));


        console.log("product list is", productDataItems);
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

    async function fetchUomId(token, productId) {
        console.log("token is", token);
        console.log("prodcut id value in the functions is", productId);
        const res = await fetch("https://syakarhonda.api.crm5.dynamics.com/api/data/v9.1/products(" + productId + ")", {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }

        })
        const data = await res.json();
        console.log("result is", res.status);
        setUomId(data._defaultuomscheduleid_value);

    }


    async function fetchUnit() {
        console.log("token is", token);
        console.log("prodcut id value in the functions is", productId);
        const res = await fetch("https://syakarhonda.api.crm5.dynamics.com/api/data/v9.1/uoms?$filter=_uomscheduleid_value eq " + uomId, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }

        })
        const data = await res.json();
        console.log("result is", res.status);
        data.value.map((object, key) => unitList.push(object));
        unitDataItems = unitList.map(object => ({
            label: object.name,
            value: object.uomid,
        }));


        console.log("unit list is", unitDataItems);
    }



    const onFormSubmit = (values) => {
        setLoading(true);
        let requestBody;
        let errorMessage = '';
        requestBody = JSON.stringify({
            'transactioncurrencyid@odata.bind': "/transactioncurrencies(" + currencyListData + ")",
            'pricelevelid@odata.bind': "/pricelevels(" + priceListData + ")",
            purchasetimeframe: dataOptionSet.timeFrame,
            new_advanceamt: values.advanceAmount,
            new_modeofpayment: dataOptionSet.paymentMode,
            agile_financechoices: dataOptionSet.financeChoice,
            agile_financeothers: values.otherFinance,
            isrevenuesystemcalculated: dataOptionSet.revenue,
            quantity: props.quantity,
            totalamount: parseInt(priceAmountValue),

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
                currencyListData.length = 0
                priceListData.length = 0
                setLoading(false);
                showSuccessToast('Booking form submitted successfully')

                navigation.navigate(Routes.HOME_SCREEN)
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'HOME' }]
                })
            } else {
                if (response.status == 401) {
                    setLoading(false);
                    showErrorToast("User session expired!")
                    navigation.navigate(Routes.LOGIN_STACK);
                }
                response.json().then((body) => {
                    setLoading(false);
                    errorMessage = body.error.message;
                    showErrorToast(errorMessage);
                });



            }
        })

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

    const showOptionalFields = (props) => {
        let element;
        if (dataOptionSet.productOverride == 1) {
            element = (
                <View>
                    <StyledInput
                        type="modal"
                        label="Existing Product"
                        passedValue={modelName}
                        uneditable
                        formikProps={props}
                        formikKey="exisitingProduct" />


                </View>
            )
        }
        else {
            element =
                (

                    <View style={{ flexDirection: 'column' }}>
                        <Text style={{ marginBottom: -16, fontSize: 14, lineHeight: 16, color: '#333333' }}>Model</Text>
                        <View style={dropDownStyleFullModal}>
                            <RNPickerSelect
                                items={productDataItems}
                                onValueChange={(value, key) => {
                                    setProductsListData(value);
                                }
                                }
                                style={pickerSelectStyles}
                                value={productsListData}
                                useNativeAndroidPickerStyle={false}

                            />
                        </View>
                    </View>
                )
        }
        return element;
    }

    const preBookingPost = (value,props) => {
        console.log("price level value is",value);
        console.log("other props are",props);
        let errorMessage='';
        let requestBody = JSON.stringify({
            'transactioncurrencyid@odata.bind': "/transactioncurrencies(" + currencyListData + ")",
            'pricelevelid@odata.bind': "/pricelevels(" + value + ")",
            purchasetimeframe: dataOptionSet.timeFrame,
            new_advanceamt: props.advanceAmount,
            new_modeofpayment: dataOptionSet.paymentMode,
            agile_financechoices: dataOptionSet.financeChoice,
            agile_financeothers: props.otherFinance,
            isrevenuesystemcalculated: dataOptionSet.revenue,
            quantity: props.quantity,

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
                fetch("https://syakarhonda.api.crm5.dynamics.com/api/data/v9.1/opportunities("+opportunityId+")", {
                    method: 'PATCH',
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        'pricelevelid@odata.bind': "/pricelevels(" + value + ")"
                    })
                }).then((response) => {
                    if (response.ok) {
                        console.log("price level successfully added");
                        setVisible(true);
                    } else {
                        if (response.status == 401) {
                            showErrorToast("User session expired!")
                            navigation.navigate(Routes.LOGIN_STACK);
                        }
                        response.json().then((body) => {
                            errorMessage = body.error.message;
                            showErrorToast(errorMessage);
                        });



                    }
                })
            } else {
                if (response.status == 401) {
                    showErrorToast("User session expired!")
                    navigation.navigate(Routes.LOGIN_STACK);
                }
                response.json().then((body) => {
                    errorMessage = body.error.message;
                    showErrorToast(errorMessage);
                });



            }
        })
    }

    const submitOpportunityProduct = (props) => {
        let requestBody;
        let errorMessage = '';
        console.log("passed props in product form is",props);
        if (productsListData == undefined) {
            requestBody = JSON.stringify({
                'opportunityid@odata.bind': "/opportunities(" + opportunityId + ")",
                'productid@odata.bind': "/products(" + productId + ")",
                'uomid@odata.bind': "/uoms(" + unitListData + ")",
                isproductoverridden: "true",
                ispriceoverridden: dataOptionSet.priceOverride,
                priceperunit: parseInt(props.values.pricePerUnit),
                quantity: parseInt(props.values.quantity),
                volumediscountamount: parseInt(props.values.volumeDiscount),
                baseamount: parseInt(props.values.amount)

            })
        } else {
            requestBody = JSON.stringify({
                'opportunityid@odata.bind': "/opportunities(" + opportunityId + ")",
                'productid@odata.bind': "/products(" + productsListData + ")",
                'uomid@odata.bind': "/uoms(" + unitListData + ")",
                isproductoverridden: "true",
                ispriceoverridden: dataOptionSet.priceOverride,
                priceperunit: parseInt(props.values.pricePerUnit),
                quantity: parseInt(props.values.quantity),
                volumediscountamount: parseInt(props.values.volumeDiscount),
                baseamount: parseInt(props.values.amount)
            })
        }
        console.log("final request body is",requestBody);

        fetch(BASE_URL + OPPORTUNITYPRODUCT_ENDPOINT, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: requestBody
        }).then((response) => {
            if (response.ok) {
                unitListData.length = 0;
                productList.length = 0;
                fetch("https://syakarhonda.api.crm5.dynamics.com/api/data/v9.1/opportunities("+opportunityId+")", {
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        'Content-Type': 'application/json'
                    }
                }).then((response) => {
                    if (response.ok) {
                        response.json().then((responseJson) => {
                            console.log("total amount is",responseJson.totalamount);
                            setPriceAmountValue(responseJson.totalamount+'');
                        })
                    } else {
                        showErrorToast("Total amount fetching unsuccessful");
                    }
                })
                showSuccessToast('Product detail form submitted successfully')
                toggleOverlay()
            } else {
                if (response.status == 401) {
                    showErrorToast("User session expired!")
                    navigation.navigate(Routes.LOGIN_STACK);
                }
                response.json().then((body) => {
                    errorMessage = body.error.message;
                    showErrorToast(errorMessage);
                });



            }
        })
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
                        <HeaderText>Booking</HeaderText>
                    </View>

                    <View style={{ marginBottom: 82, paddingBottom: 16 }}>
                        <ProgressSteps
                            style={{ flex: 1 }}
                            topOffset={10}
                            activeStepIconBorderColor="red"
                            completedProgressBarColor="red"
                            activeLabelColor="red"
                            activeStep={2}>
                            <ProgressStep label="Lead Info" nextBtnText="" previousBtnText="" removeBtnRow={true}>

                            </ProgressStep>
                            <ProgressStep label="Opportunity" nextBtnText="" previousBtnText="" removeBtnRow={true}>

                            </ProgressStep>
                            <ProgressStep label="Confirm" nextBtnText="" previousBtnText="" finishBtnText="" removeBtnRow={true}>

                            </ProgressStep>
                        </ProgressSteps>
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

                                    <View style={{ flexDirection: 'column', marginTop: 8, marginBottom: 16 }}>
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

                                    <View style={{ marginTop: 16, marginBottom: -8 }}>
                                        {displayOtherFinanceOption(formikProps)}
                                    </View>

                                    <View style={{ flexDirection: 'column' }}>
                                        <Text style={{ marginBottom: -16, marginTop: 12 }}>Currency</Text>
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

                                    <View style={{ flexDirection: 'column', marginTop: 16, marginBottom: 16 }}>
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

                                    <View style={{ flexDirection: 'column', marginBottom: 48, paddingBottom: 48 }}>
                                        <Text style={{ marginBottom: -16 }}>Price</Text>
                                        <View style={dropDownStyleFull}>
                                            <RNPickerSelect
                                                items={priceListDataItems}
                                                onValueChange={(value) => {
                                                    setPriceListData(value)
                                                    preBookingPost(value,formikProps)
                                                }
                                                }
                                                style={pickerSelectStyles}
                                                value={priceListData}
                                                useNativeAndroidPickerStyle={false}

                                            />
                                        </View>
                                    </View>

                                    <View style={{marginTop:-96,marginBottom:84}}>
                                  
                                        <StyledInput
                                            label="Total Amount"
                                            passedValue={priceAmountValue}
                                            uneditable
                                            formikProps={formikProps}
                                            formikKey="totalAmount" />


                                    </View>

                                    <Overlay
                                        isVisible={visible}
                                        style={{ height: 200 }}
                                        overlayStyle={{ color: 'red', height: "75%", width: "85%" }}
                                        backdropStyle={{ color: "red" }}
                                        onBackdropPress={toggleOverlay}>
                                        <Text style={{ alignSelf: 'center', fontSize: 16, fontFamily: Fonts.type.bold }}>Product Details</Text>
                                        <ScrollView>
                                            <View style={{ flexDirection: 'column', marginTop: 16 }}>
                                                <Text style={{ marginBottom: -16 }}>Select Product</Text>
                                                <View style={dropDownStyleFullModal}>

                                                    <RNPickerSelect
                                                        items={OverrideenConstants}
                                                        onValueChange={value => {
                                                            setDataOptionSet({
                                                                ...dataOptionSet, productOverride: value,
                                                            });
                                                        }}
                                                        style={pickerSelectStyles}
                                                        value={dataOptionSet.productOverride}
                                                        useNativeAndroidPickerStyle={false}

                                                    />
                                                </View>


                                            </View>
                                            <View style={{ marginTop: 16 }}>
                                                {showOptionalFields(formikProps)}
                                            </View>

                                            <View style={{ flexDirection: 'column' }}>
                                                <Text style={{ marginBottom: -16 }}>Unit</Text>
                                                <View style={dropDownStyleFullModal}>

                                                    <RNPickerSelect
                                                        items={unitDataItems}
                                                        onValueChange={(value) => {
                                                            setUnitListData(value)
                                                        }
                                                        }
                                                        style={pickerSelectStyles}
                                                        value={unitListData}
                                                        useNativeAndroidPickerStyle={false}

                                                    />
                                                </View>
                                            </View>

                                            <View style={{ flexDirection: 'column', marginTop: 16 }}>
                                                <Text style={{ marginBottom: -16 }}>Price Overridden</Text>
                                                <View style={dropDownStyleFullModal}>

                                                    <RNPickerSelect
                                                        items={PriceOverrideConstants}
                                                        onValueChange={value => {
                                                            setDataOptionSet({
                                                                ...dataOptionSet, priceOverride: value,
                                                            });
                                                        }}
                                                        style={pickerSelectStyles}
                                                        value={dataOptionSet.priceOverride}
                                                        useNativeAndroidPickerStyle={false}

                                                    />
                                                </View>
                                            </View>
                                            <View style={{ marginTop: 16 }}>

                                                <StyledInput
                                                    type="modal"
                                                    label="Price Per Unit"
                                                    formikProps={formikProps}
                                                    formikKey="pricePerUnit" />
                                            </View>

                                            <StyledInput
                                                type="modal"
                                                label="Volume Discount"
                                                formikProps={formikProps}
                                                formikKey="volumeDiscount" />
                                            <StyledInput
                                                type="modal"
                                                label="Quantity"
                                                formikProps={formikProps}
                                                formikKey="quantity" />

                                            <StyledInput
                                                type="modal"
                                                label="Amount"
                                                formikProps={formikProps}
                                                formikKey="amount" />


                                        </ScrollView>

                                        <ButtonX
                                            dark={true}
                                            style={styles.centerButton}
                                            color={defaultTheme.colors.primary}
                                            onPress={() => { submitOpportunityProduct(formikProps) }}
                                            label={t('Submit')} />

                                    </Overlay>

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
            }
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
    centerButton: {
        alignSelf: 'center',
        width: "40%",
        borderRadius: 24,
        marginBottom: 16
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

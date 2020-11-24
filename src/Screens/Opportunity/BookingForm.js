import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { Dimensions, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import AnimatedLoader from "react-native-animated-loader";
import { BASE_URL, CURRENCY_ENDPOINT, OPPORTUNITYPRODUCT_ENDPOINT, OPPORTUNITY_ENDPOINT, PRICE_ENDPOINT, PRODUCTS_ENDPOINT } from 'react-native-dotenv';
import { ButtonGroup, Overlay } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import RNPickerSelect from 'react-native-picker-select';
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
import { FinanceChoiceConstants } from '../../Utils/BookingFormConstants/FinanceChoiceConstants';
import { PaymentModeConstants } from '../../Utils/BookingFormConstants/PaymentModeConstants';
import { PurchaseTimeConstants } from '../../Utils/BookingFormConstants/PurchaseTimeConstants';
import { RevenueConstants } from '../../Utils/BookingFormConstants/RevenueConstants';

var width = Dimensions.get('window').width;


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
        color: !uneditable ? "#333333" : "#333333",
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


const BookingForm = (props) => {

    const { signOut } = React.useContext(AuthContext);
    const navigation = useNavigation();
    const [token, setToken] = useState();
    const { t } = useTranslation();
    const [editMode, setEditMode] = React.useState(false);
    const [postUrl, setPostUrl] = React.useState(BASE_URL + OPPORTUNITY_ENDPOINT);
    const [uomName, setUomName] = React.useState("");
    const [dataOptionSet, setDataOptionSet] = React.useState({
        timeFrame: undefined,
        paymentMode: undefined,
        financeChoice: undefined,
        revenue: undefined,
        productOverride: undefined,
        priceOverride: undefined,
        pricePerUnit: undefined,
        productName: undefined,
        unitId: undefined,
        volumeDiscountAmount: undefined,
        quantity: undefined,
        amount: undefined,
        advanceAmount: undefined,
        currency: undefined,
        priceList: undefined,
        unit: undefined,
        model: undefined,
        otherFinance: undefined,
        opportunityId: undefined,
    });
    const [opportunityProductValue, setOpportunityProductValue] = React.useState({
        isProductOverride: undefined,
        productName: undefined,
        productId: undefined,
        newProductName: undefined,
        unitid: undefined,
        isPriceOverride: undefined,
        pricePerUnit: undefined,
        volumeDiscountAmount: undefined,
        quantity: undefined,
        amount: undefined,
        uomName: undefined,

    });
    const [currencyData, setCurrencyData] = React.useState([]);
    const [priceData, setPriceData] = React.useState([]);
    const [unitData, setUnitData] = React.useState([]);
    const [modelData, setModelData] = React.useState([]);
    const [reload, setReload] = React.useState(false);
    const [patchMode, setPatchMode] = React.useState(false);
    const [modelName, setModelName] = React.useState();
    const [opportunityStatus, setOpportunityStatus] = React.useState();
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
    if (route.params !== undefined) {
        console.log("passed params are", route.params.passingProp);
        if (route.params.passingProp !== undefined) {
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
            console.log("passed opportunity id is", route.params.bookingId);
        }
    }

    React.useEffect((async) => {
        retrieveToken();

    }, [])
    // React.useEffect((async) => {
    //     fetchUnit();

    // }, [uomId])

    async function retrieveToken() {
        try {
            const value = await AsyncStorage.getItem('@token_key');
            if (value !== null) {
                setToken(value);
                fetchOpportunityStataus(value)
                fetchCurrencies(value);
                fetchPriceList(value);
                fetchProducts(value);
                fetchProductName(value, productId)
                if (productId !== '') {
                    fetchUomId(value, productId);
                    fetchUnit(value, productId);
                }
            }
        } catch (error) {
        }
    }


    async function fetchOpportunityStataus(token) {
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
                if (data.agile_interested == 1) {
                    //setLoading(true);
                    fetchExistingBooking(token)
                } else {
                    setLoading(false);

                }

            }
        } else {
            showErrorToast("Error loading the data")
        }
        return opportunityStatus;
    }

    async function fetchProducts(token) {
        const res = await fetch(BASE_URL + PRODUCTS_ENDPOINT, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }

        })
        if (res.ok) {
            const data = await res.json();
            data.value.map((object, key) => setModelData(modelData => [
                ...modelData,
                {
                    label: object.name,
                    value: object.productid
                },
            ]));
        } else {
            if (res.status == 401) {
                signOut();
            }
            else {
                let resJson = res.json()
                let errorMessage = resJson.body.error.message
                showErrorToast(errorMessage);
            }
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
        if (res.ok) {
            data.value.map((object, key) => setCurrencyData(currencyData => [
                ...currencyData,
                {
                    label: object.isocurrencycode,
                    value: object.transactioncurrencyid
                },
            ]));
        } else {
            if (res.status == 401) {
                signOut();
            }
            else {
                let resJson = res.json()
                let errorMessage = resJson.body.error.message
                showErrorToast(errorMessage);
            }
        }

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
        if (res.ok) {
            const data = await res.json();
            data.value.map((object, key) => setPriceData(priceData => [
                ...priceData,
                {
                    label: object.name,
                    value: object.pricelevelid
                },
            ]));
        } else {
            if (res.status == 401) {
                signOut();
            }
            else {
                let resJson = res.json()
                let errorMessage = resJson.body.error.message
                showErrorToast(errorMessage);
            }
        }

    }

    async function fetchProductName(token, value) {
        const res = await fetch(BASE_URL + PRODUCTS_ENDPOINT + "(" + value + ")", {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }

        })
        if (res.ok) {
            const data = await res.json()
            setModelName(data.name);
        } else {
            setModelName("");
            if (res.status == 401) {
                signOut();
            }
            else {
                let resJson = res.json()
                let errorMessage = resJson.body.error.message
                showErrorToast(errorMessage);
            }
        }
    }

    function fetchExistingBooking(token) {
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
                            setDataOptionSet({
                                timeFrame: "" + resJson.purchasetimeframe,
                                advanceAmount: resJson.new_advanceamt,
                                paymentMode: "" + resJson.new_modeofpayment,
                                financeChoice: "" + resJson.agile_financechoices,
                                currency: "" + resJson._transactioncurrencyid_value,
                                revenue: "" + resJson.isrevenuesystemcalculated,
                                otherFinance: resJson.agile_financeothers,
                                priceList: "" + resJson._pricelevelid_value,
                                amount: "" + resJson.totalamount,


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
                    });
                }
            })
        } else {
            setLoading(false);
        }
    }



    async function fetchUomId(token, productId) {
        const res = await fetch("https://syakarhonda.api.crm5.dynamics.com/api/data/v9.1/products(" + productId + ")", {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }

        })
        if (res.ok) {
            const data = await res.json();
            setUomId(data._defaultuomscheduleid_value);
        } else {
            if (res.status == 401) {
                signOut();
            }
            else {
                let resJson = res.json()
                let errorMessage = resJson.body.error.message
                showErrorToast(errorMessage);
            }
        }

    }


    async function fetchUnit(token) {
        const res = await fetch("https://syakarhonda.api.crm5.dynamics.com/api/data/v9.1/uoms?$filter=_uomscheduleid_value eq " + uomId, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }

        })
        if (res.ok) {
            const data = await res.json();
            data.value.map((object, key) => setUnitData(unitData => [
                ...unitData,
                {
                    label: object.name,
                    value: object.uomid
                },
            ]));
        } else {
            if (res.status == 401) {
                signOut();
            }
        }
    }



    const onFormSubmit = (values) => {
        setLoading(true);
        let requestBody;
        let errorMessage = '';
        requestBody = JSON.stringify({
            'transactioncurrencyid@odata.bind': "/transactioncurrencies(d8837250-8deb-ea11-a815-000d3a091a37)",
            'pricelevelid@odata.bind': "/pricelevels(" + dataOptionSet.priceList + ")",
            purchasetimeframe: dataOptionSet.timeFrame,
            new_advanceamt: values.advanceAmount,
            new_modeofpayment: dataOptionSet.paymentMode,
            agile_financechoices: dataOptionSet.financeChoice,
            agile_financeothers: values.otherFinance,
            isrevenuesystemcalculated: RevenueConstants[0].value,
            quantity: props.quantity,
            agile_interested: "1",
            totalamount: parseInt(priceAmountValue),

        })
        fetch(BASE_URL + OPPORTUNITY_ENDPOINT + '(' + opportunityId + ')', {
            method: 'PATCH',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: requestBody
        }).then((response) => {
            if (response.ok) {
                setLoading(false);
                !patchMode ? showSuccessToast("Successfully setup booking form") :
                    showSuccessToast("Successfully updated booking form");
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'BOOKING_LIST' }]
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
                    uneditable={editMode ? true : false}
                    label="Finance Others"
                    formikProps={props}
                    formikKey="otherFinance"
                    passedValue={dataOptionSet.otherFinance}
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
        if (opportunityProductValue.isProductOverride == "true") {
            console.log("here");
            element = (
                <View>
                    <StyledInput
                        uneditable={editMode ? true : false}
                        type="modal"
                        label="Existing Product"
                        //passedValue={modelName}
                        uneditable
                        formikProps={props}
                        formikKey="exisitingProduct"
                        passedValue={opportunityProductValue.productName !== undefined ? opportunityProductValue.productName : modelName}
                    />


                </View>
            )
        }
        else {
            element =
                (

                    <View style={{ flexDirection: 'column' }}>
                        <Text style={{ marginBottom: -16, fontSize: 14, lineHeight: 16, color: '#333333', fontFamily: Fonts.type.primary }}>Model</Text>
                        <View style={dropDownStyleFullModal}>
                            <RNPickerSelect
                                disabled={editMode ? true : false}
                                items={modelData}
                                onValueChange={(value, key) => {
                                    setOpportunityProductValue({
                                        ...opportunityProductValue, newProductName: value
                                    })
                                }
                                }
                                style={pickerSelectStyles}
                                value={opportunityProductValue.newProductName}
                                useNativeAndroidPickerStyle={false}

                            />
                        </View>
                    </View>
                )
        }
        return element;
    }

    const preBookingPost = (value, props) => {
        let errorMessage = '';
        let requestBody = JSON.stringify({
            'transactioncurrencyid@odata.bind': "/transactioncurrencies(d8837250-8deb-ea11-a815-000d3a091a37)",
            'pricelevelid@odata.bind': "/pricelevels(" + value + ")",
            purchasetimeframe: dataOptionSet.timeFrame,
            new_advanceamt: props.advanceAmount,
            new_modeofpayment: dataOptionSet.paymentMode,
            agile_financechoices: dataOptionSet.financeChoice,
            agile_financeothers: props.otherFinance,
            isrevenuesystemcalculated: RevenueConstants[0].value,
            agile_interested: "1",
            quantity: props.quantity,

        })
        if (patchMode) {
            if (bookingId !== undefined) {
                fetch(BASE_URL + OPPORTUNITY_ENDPOINT + "(" + bookingId + ")", {
                    method: 'PATCH',
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        'Content-Type': 'application/json'
                    },
                    body: requestBody
                }).then((response) => {
                    if (response.ok) {
                        fetch("https://syakarhonda.api.crm5.dynamics.com/api/data/v9.1/opportunities(" + bookingId + ")", {
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
        } else {
            fetch(BASE_URL + OPPORTUNITY_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: requestBody
            }).then((response) => {
                if (response.ok) {
                    fetch("https://syakarhonda.api.crm5.dynamics.com/api/data/v9.1/opportunities(" + opportunityId + ")", {
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
    }

    const submitOpportunityProduct = (props) => {
        let requestBody;
        let errorMessage = '';
        if (opportunityProductValue.productId == undefined) {
            requestBody = JSON.stringify({
                'opportunityid@odata.bind': "/opportunities(" + opportunityId + ")",
                'productid@odata.bind': "/products(" + productId + ")",
                'uomid@odata.bind': "/uoms(49370858-8eeb-ea11-a815-000d3a091a37)",
                isproductoverridden: "true",
                ispriceoverridden: "true",
                priceperunit: parseInt(props.values.pricePerUnit),
                quantity: parseInt(props.values.quantity),
                volumediscountamount: parseInt(props.values.volumeDiscount),
                baseamount: parseInt(props.values.amount)

            })
        } else {
            requestBody = JSON.stringify({
                'opportunityid@odata.bind': "/opportunities(" + opportunityId + ")",
                'productid@odata.bind': "/products(" + opportunityProductValue.productId + ")",
                'uomid@odata.bind': "/uoms(49370858-8eeb-ea11-a815-000d3a091a37)",
                isproductoverridden: "true",
                ispriceoverridden: "true",
                priceperunit: parseInt(props.values.pricePerUnit),
                quantity: parseInt(props.values.quantity),
                volumediscountamount: parseInt(props.values.volumeDiscount),
                baseamount: parseInt(props.values.amount)
            })
        }

        fetch(BASE_URL + OPPORTUNITYPRODUCT_ENDPOINT, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: requestBody
        }).then((response) => {
            if (response.ok) {
                fetch("https://syakarhonda.api.crm5.dynamics.com/api/data/v9.1/opportunities(" + opportunityId + ")", {
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        'Content-Type': 'application/json'
                    }
                }).then((response) => {
                    if (response.ok) {
                        response.json().then((responseJson) => {
                            setPriceAmountValue(responseJson.totalamount + '');
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

    const component1 = () =>
        <View style={{ flexDirection: 'row' }}>
            <IconX
                style={{ marginRight: 8 }}
                origin={ICON_TYPE.MATERIAL_ICONS}
                name={'assignment'}
                color="black"
            />
            <Text style={{ fontFamily: Fonts.type.semiBold, fontSize: 16 }}>Lead
    </Text>
        </View>
    const component2 = () =>
        <View style={{ flexDirection: 'row' }}>
            <IconX
                style={{ marginRight: 8 }}
                origin={ICON_TYPE.ICONICONS}
                name={'bicycle-outline'}
                color="black"
            />
            <Text style={{ fontFamily: Fonts.type.semiBold, fontSize: 16 }}>Test Ride
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
            navigation.navigate(Routes.TEST_RIDE_FORM_SCREEN)
        }
    }
    const { selectedIndex } = index;

    function renderProductButton() {
        let element;
        if (opportunityStatus == 1) {
            element = (
                <ButtonX

                    dark={true}
                    style={styles.productButton}
                    color={defaultTheme.colors.primary}
                    onPress={() => {
                        fetchOpportunityProduct()
                        //setVisible(true);


                    }}
                    label={t('Show Product')}
                />

            )
        }
        else {
            element = null;
        }
        return element;
    }

    async function fetchOpportunityProduct() {
        setLoading(true);
        const res = await fetch("https://syakarhonda.api.crm5.dynamics.com/api/data/v9.1/opportunityproducts?$filter=_opportunityid_value eq " + opportunityId, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }

        })
        const data = await res.json();
        console.log("data is", data);
        console.log("edit mode is", editMode)
        data.value.map((value, key) => {

            setOpportunityProductValue({

                ...opportunityProductValue,
                isProductOverride: "" + value.isproductoverridden,
                productName: "" + value.productname,
                productId: value._productid_value,
                newProductName: "" + value.productname,
                unitid: "" + value._uomid_value,
                isPriceOverride: "" + value.ispriceoverridden,
                pricePerUnit: "" + value.priceperunit,
                volumeDiscountAmount: "" + value.volumediscountamount,
                quantity: "" + value.quantity,
                amount: "" + value.baseamount,
            })
            fetchUomName(value._uomid_value);

        })

        setLoading(false);
        setVisible(true)
    }

    async function fetchUomName(id) {
        console.log("uomid is", id);
        const res = await fetch("https://syakarhonda.api.crm5.dynamics.com/api/data/v9.1/uoms(" + id + ")", {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }

        })
        if (res.ok) {
            const data = await res.json();
            setUomName(data.name)
        } else {
            setUomName(undefined);
        }
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
                                advanceAmount: dataOptionSet.advanceAmount,
                                otherFinance: dataOptionSet.otherFinance,
                                pricePerUnit: opportunityProductValue.pricePerUnit,
                                volumeDiscount: opportunityProductValue.volumeDiscountAmount,
                                quantity: opportunityProductValue.quantity,
                                amount: opportunityProductValue.amount,
                                exisitingProduct: opportunityProductValue.productName,
                                totalAmount: dataOptionSet.amount


                            }}
                            onSubmit={onFormSubmit} >
                            {formikProps => (

                                <SafeAreaView style={{ marginLeft: 16, marginTop: 13, flex: 1 }}>

                                    <View style={{ flexDirection: 'column', marginTop: 8, marginBottom: 16 }}>
                                        <Text style={{ marginBottom: -16, fontFamily: Fonts.type.primary, fontSize: 14, lineHeight: 16 }}>Purchase Time Frame</Text>
                                        <View style={dropDownStyleFull}>

                                            <RNPickerSelect
                                                disabled={editMode ? true : false}
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
                                        uneditable={editMode ? true : false}
                                        label="Advance Amount"
                                        formikProps={formikProps}
                                        formikKey="advanceAmount"
                                        passedValue={dataOptionSet.advanceAmount}
                                    />

                                    <View style={{ flexDirection: 'column', marginTop: 4 }}>
                                        <Text style={{ marginBottom: -16, fontFamily: Fonts.type.primary, fontSize: 14, lineHeight: 16 }}>Mode Of Payment</Text>
                                        <View style={dropDownStyleFull}>

                                            <RNPickerSelect
                                                disabled={editMode ? true : false}
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
                                        <Text style={{ marginBottom: -16, fontFamily: Fonts.type.primary, fontSize: 14, lineHeight: 16 }}>Finance Choices</Text>
                                        <View style={dropDownStyleFull}>

                                            <RNPickerSelect
                                                disabled={editMode ? true : false}
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

                                    <View style={{ flexDirection: 'column', marginBottom: 16 }}>
                                        <Text style={{ marginBottom: -16, fontFamily: Fonts.type.primary, fontSize: 14, lineHeight: 16 }}>Price</Text>
                                        <View style={dropDownStyleFull}>
                                            <RNPickerSelect
                                                disabled={editMode ? true : false}
                                                items={priceData}
                                                onValueChange={(value, key) => {
                                                    setDataOptionSet({
                                                        ...dataOptionSet, priceList: value
                                                    })
                                                    preBookingPost(value, formikProps)
                                                }


                                                }
                                                style={pickerSelectStyles}
                                                value={dataOptionSet.priceList}
                                                useNativeAndroidPickerStyle={false}

                                            />
                                        </View>
                                    </View>

                                    <View style={{ marginBottom: 84 }}>

                                        <StyledInput
                                            uneditable={true}
                                            label="Total Amount"
                                            passedValue={dataOptionSet.amount}

                                            formikProps={formikProps}
                                            formikKey="totalAmount" />

                                        <View style={{ alignItems: 'flex-start' }}>

                                            {renderProductButton()}

                                        </View>

                                    </View>

                                    <Overlay
                                        isVisible={visible}
                                        style={{ height: 200 }}
                                        overlayStyle={{ color: 'red', height: "75%", width: "85%" }}
                                        backdropStyle={{ color: "red" }}
                                        onBackdropPress={toggleOverlay}>
                                        <Text style={{ alignSelf: 'center', fontSize: 16, fontFamily: Fonts.type.bold, paddingBottom: 16 }}>Product Details</Text>
                                        <ScrollView>

                                            <View style={{ marginTop: 16 }}>
                                                {showOptionalFields(formikProps)}
                                            </View>

                                            <View style={{ marginTop: 0 }}>

                                                <StyledInput
                                                    uneditable={editMode ? true : false}
                                                    type="modal"
                                                    label="Price Per Unit"
                                                    formikProps={formikProps}
                                                    formikKey="pricePerUnit"
                                                    passedValue={opportunityProductValue.pricePerUnit}
                                                />
                                            </View>


                                            <StyledInput
                                                uneditable={editMode ? true : false}
                                                type="modal"
                                                label="Volume Discount"
                                                formikProps={formikProps}
                                                formikKey="volumeDiscount"
                                                passedValue={opportunityProductValue.volumeDiscountAmount}
                                            />



                                            <StyledInput
                                                uneditable={editMode ? true : false}
                                                type="modal"
                                                label="Quantity"
                                                formikProps={formikProps}
                                                formikKey="quantity"
                                                passedValue={opportunityProductValue.quantity}
                                            />


                                            <StyledInput
                                                uneditable={editMode ? true : false}
                                                type="modal"
                                                label="Amount"
                                                formikProps={formikProps}
                                                formikKey="amount"
                                                passedValue={opportunityProductValue.amount}
                                            />


                                        </ScrollView>

                                        <ButtonX
                                            dark={true}
                                            style={styles.centerButton}
                                            color={defaultTheme.colors.primary}
                                            onPress={() => { submitOpportunityProduct(formikProps) }}
                                            label={t('Submit')} />

                                    </Overlay>


                                    <View style={{
                                        position: 'absolute',
                                        bottom: 16,
                                        left: 0,
                                        right: 0,
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
    )
}


const styles = StyleSheet.create({
    textLabelStyle: {
        fontSize: 15,
        lineHeight: 14,
        marginTop: 2,
        marginBottom: 4,
        marginLeft: 4,
        fontFamily: Fonts.type.primary,
        color: '#333333',
    },
    ovalButton: {
        borderRadius: 24,
        width: "90%",
        marginRight: 16,
        marginBottom: 16,
    },
    productButton: {
        borderRadius: 24,
        marginBottom: 16,
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
        marginRight: 16
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
        marginLeft: 8,
        fontFamily: Fonts.type.primary,
        borderRadius: 8,
        color: '#333333',
        // to ensure the text is never behind the icon
    },
});
export default BookingForm

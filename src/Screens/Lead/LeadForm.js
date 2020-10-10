import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { Dimensions, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { BASE_URL, LEADS_ENDPOINT, PRODUCTS_ENDPOINT, QUALIFY_ENDPOINT } from 'react-native-dotenv';
import { ScrollView } from 'react-native-gesture-handler';
import { RadioButton } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
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
import { GenderConstants } from '../../Utils/GenderConstants';
import { AgileCategoryConstants } from '../../Utils/LeadFormConstants/AgileCategoryConstants';
import { ChooseReasonConstants } from '../../Utils/LeadFormConstants/ChooseReasonConstants';
import { CityConstants } from '../../Utils/LeadFormConstants/CityConstants';
import { CurrentVehicleConstants } from '../../Utils/LeadFormConstants/CurrentVehicleConstants';
import { LeadNatureConstants } from '../../Utils/LeadFormConstants/LeadNatureConstants';
import { LeadSourceConstants } from '../../Utils/LeadFormConstants/LeadSourceConstants';
import { RejectReasonConstants } from '../../Utils/LeadFormConstants/RejectReasonConstants';
import { OccupationConstants } from '../../Utils/OccupationConstants';
import { RidingConstants } from '../../Utils/RidingConstants';

var productList = [];
var colorList = [];
var productDataItems = [];
var colorDataItems = [];


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

const dropDownStyleColor = {
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
    marginLeft: 24,
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
        .number("Value must be number")
        .label('Phone')
        .min(2)
        .required('* Phone no is required')
        .typeError('numeric value is required'),
    emailAddress: yup
        .string()
        .trim()
        .email('* Invalid Email')

});


const LeadForm = (props) => {


    const navigation = useNavigation();
    const route = useRoute();
    const { t } = useTranslation();
    var firstName, lastName, countryCode, phoneNumber;
    const [flag, setFlag] = React.useState(false);
    const [dataOptionSet, setDataOptionSet] = React.useState({
        products: [],
        leadNature: undefined,
        currentVehicle: undefined,
        ridingFor: undefined,
        occupation: undefined,
        city: undefined,
        agileCategory: undefined,
        leadSource: undefined,
        firstName: undefined,
        lastName: undefined,
        phoneNumber: undefined,
        emailAddress: undefined,
        street: undefined,
        previousModel: undefined,
        reasonToChoose: undefined,
        reasonToReject: undefined,
    });
    const [token, setToken] = useState();
    const [productsListData, setProductsListData] = useState([

    ]);
    const [productName, setProductName] = useState();
    const [colorName, setColorName] = useState();
    const [colorsListData, setColorsListData] = useState([

    ]);
    const [checked, setChecked] = useState(GenderConstants[0].value);
    const [formSuccess, setFormSuccess] = useState(false);
    const [qualify, setQualify] = useState(false);

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
    React.useEffect(() => {

    }, [flag]);

    React.useEffect((async) => {
        retrieveToken();

    }, [])

    React.useEffect(() => {
        fetchColorData(token);

    }, [productsListData])

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

    async function fetchColorData() {
        console.log("product list before fetch", productsListData);

        const res = await fetch("https://syakarhonda.api.crm5.dynamics.com/api/data/v9.1/agile_colorses?$filter=_agile_producmodelname_value eq " + productsListData

            , {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }

            })
        const data = await res.json();
        console.log("data is", data);
        data.value.map((object, key) => colorList.push(object));
        colorDataItems = colorList.map(object => ({
            label: object.agile_name,
            value: object.agile_colorsid
        }));


        console.log("color list is", colorDataItems);
        console.log("lenght of color data items is", colorDataItems.length);
        if (colorDataItems.length != 0) {
            console.log("value of color data items", colorDataItems.values.length);
            setFlag(true);
        }
        else {
            setFlag(false);
        }
        colorList = [];
    }

    console.log("name of producst is", productsListData);


    const onFormSubmit = (values) => {

        console.log("next button value is", values.nextButton);
        if (productsListData == undefined) {
            showErrorToast("Product not selected")
        }
        else if (dataOptionSet.leadSource == undefined) {
            showErrorToast("Lead source not selected")
        } else if (dataOptionSet.leadNature == undefined) {
            showErrorToast("Lead Nature not selected")
        } else if (dataOptionSet.agileCategory == undefined) {
            showErrorToast("Categories not selected")
        } else {
            postForm(dataOptionSet.leadNature,
                dataOptionSet.leadSource,
                dataOptionSet.agileCategory,
                values.companyName,
                values.requiredQuantity,
                values.jobTitle,
                values.businessContact,
                checked,
                values.campaign,
                values.firstName,
                values.lastName,
                values.phoneNumber,
                values.emailAddress,
                dataOptionSet.occupation,
                values.street,
                dataOptionSet.city,
                dataOptionSet.currentVehicle,
                dataOptionSet.ridingFor,
                values.otherModel,
                values.previousModel,
                dataOptionSet.reasonToChoose,
                dataOptionSet.reasonToReject
            );
        }
    }

    const postForm = (leadNature, leadSource, agileCategory, companyName, requiredQuantity, jobTitle, businessContact, gender, campaign, firstName, lastName, phonenumber, email, occupation, street, city, currentVehicle, ridingFor, otherModel, previousModel, chooseReason, rejectReason) => {
        let requestBody;
        if (colorDataItems.length != 0) {
            requestBody = JSON.stringify({
                subject: 'Interested in ' + AgileCategoryConstants[agileCategory - 1].label,
                new_leadnature: leadNature,
                leadsourcecode: leadSource,
                agile_campaign: campaign,
                agile_catogeries: agileCategory,
                companyname: companyName,
                new_requiredquantity: requiredQuantity,
                jobtitle: jobTitle,
                new_businesscontact: businessContact,
                agile_gender: gender,
                agile_currentothers: otherModel,
                firstname: firstName,
                lastname: lastName,
                fullname: firstName + ' ' + lastName,
                mobilephone: phonenumber,
                emailaddress1: email,
                agile_occupation: occupation,
                address1_name: street,
                address1_addresstypecode: city,
                new_currentbikescoote: currentVehicle,
                agile_ridingfor: ridingFor,
                new_previousbikemodel: previousModel,
                agile_reasontochoose: chooseReason,
                agile_reasonforleaving: rejectReason,
                'agile_InterestedModel@odata.bind': "/products(" + productsListData + ")",
                'agile_Colors@odata.bind': "/agile_colorses(" + colorsListData + ")"
            })
        }

        else {
            requestBody = JSON.stringify({
                subject: 'Interested in ' + AgileCategoryConstants[agileCategory - 1].label,
                new_leadnature: leadNature,
                leadsourcecode: leadSource,
                agile_campaign: campaign,
                agile_catogeries: agileCategory,
                companyname: companyName,
                new_requiredquantity: requiredQuantity,
                jobtitle: jobTitle,
                new_businesscontact: businessContact,
                agile_gender: gender,
                agile_currentothers: otherModel,
                firstname: firstName,
                lastname: lastName,
                fullname: firstName + ' ' + lastName,
                mobilephone: phonenumber,
                emailaddress1: email,
                agile_occupation: occupation,
                address1_name: street,
                address1_addresstypecode: city,
                new_currentbikescoote: currentVehicle,
                agile_ridingfor: ridingFor,
                new_previousbikemodel: previousModel,
                agile_reasontochoose: chooseReason,
                agile_reasonforleaving: rejectReason,
                'agile_InterestedModel@odata.bind': "/products(" + productsListData + ")"
            })
        }
        fetch(BASE_URL + LEADS_ENDPOINT, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: requestBody
        }).then((response) => {
            if (response.ok) {
                showSuccessToast("Successfully setup lead form")
                if (qualify) {
                    goToQualifyProcess(response.headers.map.location, firstName, lastName, email, productName, colorName);
                } else {
                    console.log("reset")
                    setFormSuccess(true);
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'LEAD' }]
                    })
                    productList.length = 0;
                    navigation.navigate(Routes.HOME_STACK);
                }
            }
            else {
                console.log('response not ok');
                console.log(response.status);
                showErrorToast("Error while submitting lead form");
                response.json().then(value => {
                    console.log("error is", value);
                })
                console.log(response.json());
            }
        }
        ).catch(error => {
            showErrorToast("Error while submitting lead form");
            console.log("error is", error);
        })
    }

    // console.log("selected product is",productsListData)

    // console.log("data option set is",dataOptionSet.leadNature);

    function goToQualifyProcess(url, firstName, lastName, email, product, color) {
        let errorMessage = '';
        console.log("passed props is", url + firstName + lastName + product + color);
        fetch(url + QUALIFY_ENDPOINT, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }, body: JSON.stringify({
                "CreateAccount": true,
                "CreateContact": true,
                "CreateOpportunity": true,
                "Status": 3
            })
        }).then((response) => {
            if (response.ok) {
                showSuccessToast("Lead qualified success");
                productList.length = 0;
                props.navigation.navigate(Routes.OPPORTUNITY_SCREEN, route.params = {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    model: product,
                    color: color != undefined ? color : ''
                });
            }
            else {

                response.json().then((body) => {
                    errorMessage = body.error.message;
                    showErrorToast(errorMessage);
                });



            }
        }).catch(error => {
            showErrorToast("Error while qualifying the leads");
            console.log("error is", error);
        })
    }

    function renderColorView(flag) {
        let container;
        if (flag) {
            container = (
                <View style={{ flexDirection: 'column' }}>
                    <Text style={{ marginBottom: -16, marginLeft: 24, marginTop: 8,fontSize:14,lineHeight:16,color: '#333333' }}>Color</Text>
                    <View style={dropDownStyleColor}>
                        <RNPickerSelect
                            items={colorDataItems}
                            onValueChange={(value, key) => {
                                setColorsListData(value)
                                setColorName(colorDataItems[key - 1].label);
                                console.log("final list of colors is", colorDataItems);
                                console.log("key is", key);
                            }
                            }
                            style={pickerSelectStyles}
                            value={colorsListData}
                            useNativeAndroidPickerStyle={false}

                        />
                    </View>
                </View>
            );
        }
        else {
            container = null;
        }
        return container;
    }

    const displayCampaignFields = (props) => {
        let element;
        console.log("value of lead soruce is", dataOptionSet.leadSource);
        if (dataOptionSet.leadSource === 11) {
            element = (
                <StyledInput
                    label="Campaigns"
                    formikProps={props}
                    formikKey="campaign"
                />
            )
        } else {
            element = null;
        }
        return element;
    }

    const displayOtherModel = (props) => {
        let element;
        console.log("value of model is", dataOptionSet.currentVehicle);
        if (dataOptionSet.currentVehicle == 8) {
            element = (
                <StyledInput
                    label="Other Model"
                    formikProps={props}
                    formikKey="otherModel"
                />
            )
        }
        else {
            element = null;
        }
        return element;
    }

    const displayFieldsForOldCustomers = (props) => {
        let element;
        if (dataOptionSet.currentVehicle != 1) {
            element = (
                <View >
                    <View style={{ flexDirection: 'column', marginTop: 8 }}>
                        <Text style={{ marginBottom: -16,fontSize:14,lineHeight:16,color: '#333333' }}>Riding For</Text>
                        <View style={dropDownStyleFull}>

                            <RNPickerSelect
                                items={RidingConstants}
                                onValueChange={value => {
                                    setDataOptionSet({
                                        ...dataOptionSet, ridingFor: value,
                                    });
                                }}
                                style={pickerSelectStyles}
                                value={dataOptionSet.ridingFor}
                                useNativeAndroidPickerStyle={false}

                            />
                        </View>
                    </View>
                    <View style={{ marginTop: 10 }}>

                        <StyledInput
                            label="Previous Model"
                            formikProps={props}
                            formikKey="previousModel"
                        />
                    </View>
                </View>
            )
        }
        else {
            element = null;
        }
        return element;
    }

    const displayFieldsForCorporate = (props) => {
        let element;
        if (dataOptionSet.leadNature == 2) {
            element = (
                <View>
                    <StyledInput
                        label="Company Name"
                        formikProps={props}
                        formikKey="companyName"
                    />
                    <StyledInput
                        label="Required Quantity"
                        formikProps={props}
                        formikKey="requiredQuantity"
                    />
                    <StyledInput
                        label="Business Contact No."
                        formikProps={props}
                        formikKey="businessContact"
                    />
                    <StyledInput
                        label="Job Title"
                        formikProps={props}
                        formikKey="jobTitle"
                    />
                </View>
            )
        }
        else {
            element = null;
        }
        return element;
    }

    const qualifyLead = async (props) => {
        console.log('here');
        setQualify(true);
        await props.handleSubmit();


    }

    return (
        <SafeAreaView style={{ width: '100%', flex: 1, backgroundColor: '#ffffff' }}>

            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ backgroundColor: '#ffffff', marginTop: 24 }}>
                    <ScrollView>
                        <View style={styles.body}>
                            <HeaderText>New Lead</HeaderText>
                        </View>


                        <Formik
                            initialValues={{
                                firstName: '',
                                lastName: '',
                                phoneNumber: '',
                                emailAddress: '',
                                nextButton: false,

                            }}
                            onSubmit={onFormSubmit}


                            validationSchema={validationSchema}>

                            {formikProps => (
                                <SafeAreaView style={{ marginLeft: 16, marginTop: 13 }}>

                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ flexDirection: 'column' }}>
                                            <Text style={{ marginBottom: -16,fontSize:14,lineHeight:16,color: '#333333' }}>Lead Nature</Text>
                                            <View style={dropDownStyle}>
                                                <RNPickerSelect

                                                    items={LeadNatureConstants}
                                                    onValueChange={value => {
                                                        setDataOptionSet({
                                                            ...dataOptionSet, leadNature: value,
                                                        });
                                                    }}
                                                    style={pickerSelectStyles}
                                                    value={dataOptionSet.leadNature}
                                                    useNativeAndroidPickerStyle={false}

                                                />
                                            </View>
                                        </View>

                                        <View style={{ flexDirection: 'column' }}>
                                            <Text style={{ marginBottom: -16,fontSize:14,lineHeight:16,color: '#333333' }}>Lead Source</Text>
                                            <View style={dropDownStyle}>
                                                <RNPickerSelect

                                                    items={LeadSourceConstants}
                                                    onValueChange={value => {
                                                        setDataOptionSet({
                                                            ...dataOptionSet, leadSource: value,
                                                        });
                                                    }}
                                                    style={pickerSelectStyles}
                                                    value={dataOptionSet.leadSource}
                                                    useNativeAndroidPickerStyle={false}

                                                />
                                            </View>
                                        </View>
                                    </View>

                                    <View style={{ marginTop: 12 }}>
                                        {displayFieldsForCorporate(formikProps)}
                                    </View>

                                    <View style={{ flexDirection: 'column' }}>
                                        <Text style={{ marginBottom: -16, marginTop: 8,fontSize:14,lineHeight:16,color: '#333333' }}>Categories</Text>
                                        <View style={dropDownStyleFull}>

                                            <RNPickerSelect
                                                items={AgileCategoryConstants}
                                                onValueChange={(value, label) => {
                                                    setDataOptionSet({
                                                        ...dataOptionSet, agileCategory: value,
                                                    });
                                                }}
                                                style={pickerSelectStyles}
                                                value={dataOptionSet.agileCategory}
                                                useNativeAndroidPickerStyle={false}

                                            />
                                        </View>
                                    </View>


                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ flexDirection: 'column' }}>
                                            <Text style={{ marginBottom: -16, marginTop: 16 ,fontSize:14,lineHeight:16,color: '#333333'}}>Model</Text>
                                            <View style={dropDownStyleModel}>
                                                <RNPickerSelect
                                                    items={productDataItems}
                                                    onValueChange={(value, key) => {
                                                        setProductsListData(value);
                                                        setProductName(productDataItems[key - 1].label);
                                                    }
                                                    }
                                                    style={pickerSelectStyles}
                                                    value={productsListData}
                                                    useNativeAndroidPickerStyle={false}

                                                />
                                            </View>
                                        </View>
                                        {renderColorView(flag)}
                                    </View>

                                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 8 }}>
                                        <View style={{ flexDirection: 'row' }}>

                                            <RadioButton
                                                color="black"
                                                uncheckedColor="black"
                                                value={GenderConstants[0].value}
                                                status={checked === GenderConstants[0].value ? 'checked' : 'unchecked'}
                                                onPress={() => setChecked(GenderConstants[0].value)}
                                            />
                                            <Text style={{ color: '#979797', alignSelf: 'center' }}>Mr</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignSelf: 'center', alignContent: 'space-around' }}>

                                            <RadioButton
                                                color="black"
                                                uncheckedColor="black"
                                                value={GenderConstants[1].value}
                                                status={checked === GenderConstants[1].value ? 'checked' : 'unchecked'}
                                                onPress={() => setChecked(GenderConstants[1].value)}
                                            />
                                            <Text style={{ color: '#979797', alignSelf: 'center' }}>Mrs</Text>
                                        </View>
                                    </View>


                                    <View style={{ flexDirection: 'row',marginTop:8 }}>
                                        <StyledInput
                                            label="First Name"
                                            formikProps={formikProps}
                                            formikKey="firstName"
                                        />

                                        <StyledInput
                                            label="Last Name"
                                            formikProps={formikProps}
                                            formikKey="lastName" />
                                    </View>
                                    <StyledInput
                                        label="Mobile Number"
                                        formikProps={formikProps}
                                        formikKey="phoneNumber"
                                    />

                                    <StyledInput
                                        label="Email Address"
                                        formikProps={formikProps}
                                        formikKey="emailAddress"
                                    />

                                    <View style={{ flexDirection: 'column', marginBottom: 16 }}>
                                        <Text style={{ marginBottom: -16,fontSize:14,lineHeight:16,color: '#333333' }}>Occupation</Text>
                                        <View style={dropDownStyleFull}>

                                            <RNPickerSelect
                                                items={OccupationConstants}
                                                onValueChange={value => {
                                                    setDataOptionSet({
                                                        ...dataOptionSet, occupation: value,
                                                    });
                                                }}
                                                style={pickerSelectStyles}
                                                value={dataOptionSet.occupation}
                                                useNativeAndroidPickerStyle={false}

                                            />
                                        </View>
                                    </View>

                                    <StyledInput
                                        label="Address"
                                        formikProps={formikProps}
                                        formikKey="addeess"
                                    />
                                    <View style={{ flexDirection: 'row' }}>
                                        <StyledInput
                                            label="Street"
                                            formikProps={formikProps}
                                            formikKey="street"
                                        />

                                        <View style={{ flexDirection: 'column' }}>
                                            <Text style={{ marginBottom: -16,fontSize:14,lineHeight:16,color: '#333333' }}>City</Text>
                                            <View style={dropDownStyle}>

                                                <RNPickerSelect
                                                    items={CityConstants}
                                                    onValueChange={value => {
                                                        setDataOptionSet({
                                                            ...dataOptionSet, city: value,
                                                        });
                                                    }}
                                                    style={pickerSelectStyles}
                                                    value={dataOptionSet.city}
                                                    useNativeAndroidPickerStyle={false}

                                                />
                                            </View>
                                        </View>

                                    </View>

                                    {displayCampaignFields(formikProps)}

                                    <Text style={{
                                        fontSize: 24,
                                        marginTop: 8,
                                        fontFamily: Fonts.type.bold

                                    }}>Current Vehicle Information</Text>

                                    <View style={{ flexDirection: 'column', marginTop: 24 }}>
                                        <Text style={{ marginBottom: -16,fontSize:14,lineHeight:16,color: '#333333' }}>Current Bike/Scooter</Text>
                                        <View style={dropDownStyleFull}>

                                            <RNPickerSelect
                                                items={CurrentVehicleConstants}
                                                onValueChange={value => {
                                                    setDataOptionSet({
                                                        ...dataOptionSet, currentVehicle: value,
                                                    });
                                                }}
                                                style={pickerSelectStyles}
                                                value={dataOptionSet.currentVehicle}
                                                useNativeAndroidPickerStyle={false}

                                            />
                                        </View>
                                    </View>
                                    <View style={{ marginTop: 8, marginBottom: -8 }}>

                                        {displayOtherModel(formikProps)}
                                    </View>

                                    <View style={{ marginBottom: 0 }}>
                                        {displayFieldsForOldCustomers(formikProps)}
                                    </View>

                                    <View style={{ flexDirection: 'column' }}>
                                        <Text style={{ marginBottom: -16,fontSize:14,lineHeight:16,color: '#333333' }}>Reason To Choose</Text>
                                        <View style={dropDownStyleFull}>

                                            <RNPickerSelect
                                                items={ChooseReasonConstants}
                                                onValueChange={value => {
                                                    setDataOptionSet({
                                                        ...dataOptionSet, reasonToChoose: value,
                                                    });
                                                }}
                                                style={pickerSelectStyles}
                                                value={dataOptionSet.reasonToChoose}
                                                useNativeAndroidPickerStyle={false}

                                            />
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'column', marginTop: 8 }}>
                                        <Text style={{ marginBottom: -16,fontSize:14,lineHeight:16,color: '#333333' }}>Reason To Leave</Text>
                                        <View style={dropDownStyleFull}>

                                            <RNPickerSelect
                                                items={RejectReasonConstants}
                                                onValueChange={value => {
                                                    setDataOptionSet({
                                                        ...dataOptionSet, reasonToReject: value,
                                                    });
                                                }}
                                                style={pickerSelectStyles}
                                                value={dataOptionSet.reasonToReject}
                                                useNativeAndroidPickerStyle={false}

                                            />
                                        </View>
                                    </View>


                                    <View style={{
                                        marginTop: 8,
                                        marginBottom: 16,
                                        marginLeft: 16,
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
                                            onPress={() => qualifyLead(formikProps)}
                                            label={t('Next')}
                                        />

                                    </View>
                                </SafeAreaView>


                            )}
                        </Formik>
                    </ScrollView>
                </View>
            </ScrollView>

        </SafeAreaView >
    )

}


const styles = StyleSheet.create({
    textLabelStyle: {
        fontSize: 14,
        lineHeight: 16,
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


        borderRadius: 8,
        color: 'black',
        // to ensure the text is never behind the icon
    },
});

export default LeadForm
import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { Dimensions, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { BASE_URL, LEADS_ENDPOINT, PRODUCTS_ENDPOINT, QUALIFY_ENDPOINT } from 'react-native-dotenv';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { RadioButton } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import * as yup from 'yup';
import { ButtonX, HeaderButton } from '../../Components';
import HeaderText from '../../Components/HeaderText';
import useTranslation from '../../i18n';
import { IconX, ICON_TYPE } from '../../Icons';
import { showErrorToast, showInfoToast, showSuccessToast } from '../../Lib/Toast';
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
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import AnimatedLoader from "react-native-animated-loader";
import { AuthContext } from '../../Components/context';
import { set } from 'lodash';
import { ButtonGroup } from 'react-native-elements';

var productList = [];
var colorList = [];
var productDataItems = [];
var colorDataItems = [];

var dataList = [];

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

const StyledInput = ({ label, formikProps, uneditable, passedValue, formikKey, ...rest }) => {

    const inputStyles = {
        height: 45,
        width: width / 1.115,
        fontSize: 14,
        fontFamily: "WorkSans-Medium",
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
                        defaultValue={passedValue}
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

    const { signOut } = React.useContext(AuthContext);
    const navigation = useNavigation();
    const route = useRoute();
    const { t } = useTranslation();
    var firstName, lastName, countryCode, phoneNumber;
    const [flag, setFlag] = React.useState(false);
    const [editMode, setEditMode] = React.useState(false);
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
        gender: undefined,
        model: undefined,
        color: undefined,
        companyName: undefined,
        requiredQuantity: undefined,
        businessContact: undefined,
        jobTitle: undefined,
        campaign: undefined,
        otherModel: undefined,
        opportunityId: undefined,
    });

    const [token, setToken] = useState(undefined);
    const [contactKey, setContactKey] = useState();
    const [productsListData, setProductsListData] = useState([

    ]);
    const [productName, setProductName] = useState();
    const [colorName, setColorName] = useState(undefined);
    const [colorsListData, setColorsListData] = useState([

    ]);
    const [modelReload, setModelReload] = React.useState(false);
    const [patchMode, setPatchMode] = React.useState(false);
    const [postUrl, setPostUrl] = React.useState(BASE_URL + LEADS_ENDPOINT);
    const [checked, setChecked] = useState(GenderConstants[0].value);
    const [formSuccess, setFormSuccess] = useState(false);
    const [qualify, setQualify] = useState(false);
    const [loading, setLoading] = useState(false);

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



    let leadId = '';
    if (route.params !== undefined) {
        if (route.params.flag == "edit") {
            leadId = route.params.leadId;
            console.log("passed lead id is", route.params.leadId);
        }
    }



    React.useEffect(() => {

    }, [flag]);

    React.useEffect((async) => {
        retrieveToken();

    }, [modelReload])



    React.useEffect((async) => {
        retrieveContactId();

    }, [])



    React.useEffect(() => {

        fetchColorData(token);


    }, [productsListData])

    async function retrieveToken() {
        try {
            const value = await AsyncStorage.getItem('@token_key');
            if (value !== null) {
                setToken(value);
                if (modelReload == false) {
                    fetchExistingLead(value)
                }
                fetchProducts(value);
                console.log("token is= " + value);

            }
        } catch (error) {
            console.log("error is", error);
        }
    }

    async function retrieveContactId() {
        try {
            const contactId = await AsyncStorage.getItem('@contactId');
            if (contactId !== null) {
                setContactKey(contactId);
            }
        } catch (error) {
            console.log("error is", error);
        }
    }

    function fetchExistingLead(token) {
        console.log("lead id is", leadId);
        let errorMessage = '';
        if (leadId !== '') {
            setLoading(true);
            fetch("https://syakarhonda.api.crm5.dynamics.com/api/data/v9.1/leads(" + leadId + ")", {
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
                            setDataOptionSet({
                                leadNature: "" + resJson.new_leadnature,
                                currentVehicle: "" + resJson.new_currentbikescoote,
                                ridingFor: "" + resJson.agile_ridingfor,
                                occupation: "" + resJson.agile_occupation,
                                city: "" + resJson.address1_addresstypecode,
                                agileCategory: "" + resJson.agile_catogeries,
                                leadSource: "" + resJson.leadsourcecode,
                                firstName: resJson.firstname,
                                lastName: resJson.lastname,
                                phoneNumber: resJson.mobilephone,
                                emailAddress: resJson.emailaddress1,
                                previousModel: resJson.new_previousbikemodel,
                                reasonToChoose: resJson.agile_reasontochoose,
                                reasonToReject: resJson.agile_reasonforleaving,
                                companyName: resJson.companyname,
                                requiredQuantity: resJson.new_requiredquantity,
                                businessContact: resJson.new_businesscontact,
                                jobTitle: resJson.jobtitle,
                                model: "" + resJson._agile_interestedmodel_value,
                                campaign: resJson.agile_campaign,
                                otherModel: resJson.agile_currentothers,
                                color: resJson._agile_colors_value,
                                gender: "" + resJson.agile_gender,
                                opportunityId: resJson._qualifyingopportunityid_value,

                            })
                            setPassingProp({
                                firstName: resJson.firstname,
                                lastName: resJson.lastname,
                                email: resJson.emailaddress1,
                                modelId: resJson._agile_interestedmodel_value,
                                modelColor: colorName !== undefined ? colorName : '',
                                modelName: productName,
                                opportunityId: resJson._qualifyingopportunityid_value

                            })
                            setEditMode(true);
                            setLoading(false);
                        })
                } else {
                    if (res.status == 401) {
                        signOut();
                    }

                    res.json().then((body) => {
                        errorMessage = body.error.message;
                        console.log("error message is", errorMessage);
                    });
                    console.log("error in edit lead form");
                }



            }
            )
        }
    }

    async function fetchProducts(token) {
        setLoading(true);
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
        productList.length = 0;


        console.log("product list is", productDataItems);
        setLoading(false);
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

    const [passingProp, setPassingProp] = React.useState({
        "firstName": dataOptionSet.firstName,
        "lastName": dataOptionSet.lastName,
        "email": dataOptionSet.emailAddress,
        "modelId": dataOptionSet.model,
        "modelColor": dataOptionSet.color,
        "modelName": productName,
        "opportunityId": dataOptionSet.opportunityId
    });


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
            setLoading(true);
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
                'agile_Colors@odata.bind': "/agile_colorses(" + colorsListData + ")",
                'agile_SalePerson@odata.bind': "/contacts(" + contactKey + ")",
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
                'agile_InterestedModel@odata.bind': "/products(" + productsListData + ")",
                'agile_SalePerson@odata.bind': "/contacts(" + contactKey + ")",
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
                setLoading(false);
                !patchMode ? showSuccessToast("Successfully setup lead form") : showSuccessToast("Successfully updated lead form");
                if (qualify) {
                    setLoading(true);
                    goToQualifyProcess(response.headers.map.location, firstName, lastName, email, productName, colorName, productsListData);
                } else {
                    setLoading(false);
                    console.log("reset")
                    setFormSuccess(true);
                    navigation.navigate(Routes.LEAD_LIST_SCREEN)
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'LIST_LEAD' }]
                    })

                    productList.length = 0;
                }
            }
            else {
                setLoading(false);
                if (response.status == 401) {
                    showErrorToast("User session expired!")
                    signOut();
                }
                showErrorToast("Error while submitting lead form");
                response.json().then((body) => {
                    errorMessage = body.error.message;
                    showErrorToast(errorMessage);
                });
            }
        }
        ).catch(error => {
            showErrorToast("Error while submitting lead form");
            console.log("error is", error);
        })
    }

    // console.log("selected product is",productsListData)

    // console.log("data option set is",dataOptionSet.leadNature);

    function goToQualifyProcess(url, firstName, lastName, email, product, color, productId) {
        let errorMessage = '';
        console.log("passed props is", url + firstName + lastName + product + color + productId);
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


                response.json().then((responseJson) => {
                    responseJson.value.forEach(items => dataList.push(items))
                    let opportunityid = dataList[1].opportunityid;
                    console.log("opportunity id is", opportunityid);
                    setLoading(false);
                    showSuccessToast("Lead qualified success");
                    productList.length = 0;
                    setPassingProp({
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        modelId: productId,
                        opportunityId: opportunityid,
                        modelName: product,
                        color: color !== undefined ? color : ''
                    })
                    // props.navigation.navigate(Routes.OPPORTUNITY_SCREEN, route.params = {
                    //     firstName: firstName,
                    //     lastName: lastName,
                    //     email: email,
                    //     productId: productId,
                    //     opportunityId: opportunityid,
                    //     model: product,
                    //     color: color != undefined ? color : ''
                    // });
                })

            }
            else {
                setLoading(false)
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
            showErrorToast("Error while qualifying the leads");
            console.log("error is", error);
        })
    }

    function renderColorView(flag) {
        let container;
        if (flag) {
            container = (
                <View style={{ flexDirection: 'column' }}>
                    <Text style={{ marginBottom: -16, marginLeft: 24, marginTop: 16, fontSize: 14, lineHeight: 16, color: '#333333', fontFamily: Fonts.type.primary }}>Color</Text>
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
                            value={editMode ? dataOptionSet.color : colorsListData}
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
                    uneditable={editMode ? true : false}
                    passedValue={dataOptionSet.campaign}
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
                    uneditable={editMode ? true : false}
                    passedValue={dataOptionSet.otherModel}
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
                        <Text style={{ marginBottom: -16, fontSize: 14, lineHeight: 16, color: '#333333', fontFamily: Fonts.type.primary }}>Riding For</Text>
                        <View style={dropDownStyleFull}>

                            <RNPickerSelect
                                disabled={editMode ? true : false}
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
                            uneditable={editMode ? true : false}
                            passedValue={dataOptionSet.previousModel}
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
                        uneditable={editMode ? true : false}
                        passedValue={dataOptionSet.companyName}
                        label="Company Name"
                        formikProps={props}
                        formikKey="companyName"
                    />
                    <StyledInput
                        uneditable={editMode ? true : false}
                        passedValue={dataOptionSet.requiredQuantity}
                        label="Required Quantity"
                        formikProps={props}
                        formikKey="requiredQuantity"
                    />
                    <StyledInput
                        uneditable={editMode ? true : false}
                        passedValue={dataOptionSet.businessContact}
                        label="Business Contact No."
                        formikProps={props}
                        formikKey="businessContact"
                    />
                    <StyledInput
                        uneditable={editMode ? true : false}
                        passedValue={dataOptionSet.jobTitle}
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

    console.log("final data option set is", dataOptionSet);
    console.log("product lisr data is", productsListData);

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
                        <HeaderText>New Lead</HeaderText>
                        {editMode ?
                            <TouchableOpacity onPress={() => {
                                setEditMode(false);
                                setModelReload(true);
                                setPatchMode(true);
                                setPostUrl(BASE_URL + LEADS_ENDPOINT + '(' + leadId + ')');
                            }}>
                                <Text style={{ alignSelf: "flex-end", fontSize: 20, fontFamily: Fonts.type.primary, paddingEnd: 16 }}>Edit</Text>
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
                                firstName: editMode ? '' : dataOptionSet.firstName,
                                lastName: editMode ? '' : dataOptionSet.lastName,
                                phoneNumber: editMode ? '' : dataOptionSet.phoneNumber,
                                emailAddress: editMode ? '' : dataOptionSet.emailAddress,
                                nextButton: false,

                            }}
                            onSubmit={onFormSubmit}


                            validationSchema={validationSchema}>

                            {formikProps => (
                                <SafeAreaView style={{ marginLeft: 16, marginTop: 13, flex: 1 }}>

                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ flexDirection: 'column' }}>
                                            <Text style={{ marginBottom: -16, fontSize: 14, lineHeight: 16, color: '#333333', fontFamily: Fonts.type.primary }}>Lead Nature</Text>
                                            <View style={dropDownStyle}>
                                                <RNPickerSelect
                                                    disabled={editMode ? true : false}
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
                                            <Text style={{ marginBottom: -16, fontSize: 14, lineHeight: 16, color: '#333333', fontFamily: Fonts.type.primary }}>Lead Source</Text>
                                            <View style={dropDownStyle}>
                                                <RNPickerSelect
                                                    disabled={editMode ? true : false}
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
                                        <Text style={{ marginBottom: -16, marginTop: 8, fontSize: 14, lineHeight: 16, color: '#333333', fontFamily: Fonts.type.primary }}>Categories</Text>
                                        <View style={dropDownStyleFull}>

                                            <RNPickerSelect
                                                disabled={editMode ? true : false}
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
                                            <Text style={{ marginBottom: -16, marginTop: 16, fontSize: 14, lineHeight: 16, color: '#333333', fontFamily: Fonts.type.primary }}>Model</Text>
                                            <View style={dropDownStyleModel}>
                                                <RNPickerSelect
                                                    disabled={editMode ? true : false}
                                                    items={productDataItems}
                                                    onValueChange={(value, key) => {
                                                        setProductsListData(value);
                                                        if (productDataItems !== undefined) {
                                                            if (key !== 0) {
                                                                console.log("product data item is", productDataItems);
                                                                console.log("productkey is", key);
                                                                setProductName(productDataItems[key - 1].label);
                                                            } else {
                                                                console.log("product data item is", productDataItems);
                                                                console.log("productkey is", key);
                                                                setProductName(productDataItems[key].label);
                                                            }
                                                        }
                                                    }
                                                    }
                                                    style={pickerSelectStyles}
                                                    value={editMode ? dataOptionSet.model : productsListData}
                                                    useNativeAndroidPickerStyle={false}

                                                />
                                            </View>
                                        </View>
                                        {renderColorView(flag)}
                                    </View>

                                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 8 }}>
                                        <View style={{ flexDirection: 'row' }}>

                                            <RadioButton
                                                color="red"
                                                uncheckedColor="red"
                                                value={GenderConstants[0].value}
                                                status={!editMode ? checked === GenderConstants[0].value ? 'checked' : 'unchecked' : dataOptionSet.gender === "1" ? 'checked' : 'unchecked'}
                                                onPress={() => setChecked(GenderConstants[0].value)}
                                            />
                                            <Text style={{ color: '#333333', alignSelf: 'center', fontFamily: Fonts.type.primary }}>Mr</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignSelf: 'center', alignContent: 'space-around' }}>

                                            <RadioButton
                                                color="red"
                                                uncheckedColor="red"
                                                value={GenderConstants[1].value}
                                                status={!editMode ? checked === GenderConstants[1].value ? 'checked' : 'unchecked' : dataOptionSet.gender === "2" ? 'checked' : 'unchecked'}
                                                onPress={() => setChecked(GenderConstants[1].value)}
                                            />
                                            <Text style={{ color: '#333333', alignSelf: 'center', fontFamily: Fonts.type.primary }}>Mrs</Text>
                                        </View>
                                    </View>


                                    <View style={{ flexDirection: 'row', marginTop: 8 }}>
                                        <StyledInput
                                            uneditable={editMode ? true : false}
                                            label="First Name"
                                            formikProps={formikProps}
                                            formikKey="firstName"
                                            passedValue={dataOptionSet.firstName}
                                        />

                                        <StyledInput
                                            uneditable={editMode ? true : false}
                                            label="Last Name"
                                            formikProps={formikProps}
                                            formikKey="lastName"
                                            passedValue={dataOptionSet.lastName}
                                        />
                                    </View>
                                    <StyledInput
                                        uneditable={editMode ? true : false}
                                        label="Mobile Number"
                                        formikProps={formikProps}
                                        formikKey="phoneNumber"
                                        passedValue={dataOptionSet.phoneNumber}
                                    />

                                    <StyledInput
                                        uneditable={editMode ? true : false}
                                        label="Email Address"
                                        formikProps={formikProps}
                                        formikKey="emailAddress"
                                        passedValue={dataOptionSet.emailAddress}
                                    />

                                    <View style={{ flexDirection: 'column', marginBottom: 16 }}>
                                        <Text style={{ marginBottom: -16, fontSize: 14, lineHeight: 16, color: '#333333', fontFamily: Fonts.type.primary }}>Occupation</Text>
                                        <View style={dropDownStyleFull}>

                                            <RNPickerSelect
                                                disabled={editMode ? true : false}
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
                                        uneditable={editMode ? true : false}
                                        label="Address"
                                        formikProps={formikProps}
                                        formikKey="addeess"
                                    />
                                    <View style={{ flexDirection: 'row' }}>
                                        <StyledInput
                                            uneditable={editMode ? true : false}
                                            label="Street"
                                            formikProps={formikProps}
                                            formikKey="street"
                                        />

                                        <View style={{ flexDirection: 'column' }}>
                                            <Text style={{ marginBottom: -16, fontSize: 14, lineHeight: 16, color: '#333333', fontFamily: Fonts.type.primary }}>City</Text>
                                            <View style={dropDownStyle}>

                                                <RNPickerSelect
                                                    disabled={editMode ? true : false}
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
                                        fontFamily: Fonts.type.semiBold

                                    }}>Current Vehicle Information</Text>

                                    <View style={{ flexDirection: 'column', marginTop: 24 }}>
                                        <Text style={{ marginBottom: -16, fontSize: 14, lineHeight: 16, color: '#333333', fontFamily: Fonts.type.primary }}>Current Bike/Scooter</Text>
                                        <View style={dropDownStyleFull}>

                                            <RNPickerSelect
                                                disabled={editMode ? true : false}
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
                                        <Text style={{ marginBottom: -16, fontSize: 14, lineHeight: 16, color: '#333333', fontFamily: Fonts.type.primary }}>Reason To Choose</Text>
                                        <View style={dropDownStyleFull}>

                                            <RNPickerSelect
                                                disabled={editMode ? true : false}
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
                                        <Text style={{ marginBottom: -16, fontSize: 14, lineHeight: 16, color: '#333333', fontFamily: Fonts.type.primary }}>Reason To Leave</Text>
                                        <View style={dropDownStyleFull}>

                                            <RNPickerSelect
                                                disabled={editMode ? true : false}
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
                                            label={t('Qualify')}
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

export default LeadForm
import { useNavigation, useRoute } from '@react-navigation/native';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { ActivityIndicator, Dimensions, SafeAreaView, StyleSheet, Text, TextInput, View, StatusBar } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import {Picker} from '@react-native-community/picker';

import * as yup from 'yup';
import { ButtonX } from '../../Components';
import HeadingText from '../../Components/HeadingText';
import { STATUS } from '../../Constants';
import defaultTheme from '../../Themes';
import useTranslation from '../../i18n';
import { LeadNatureConstants } from '../../Utils/LeadFormConstants/LeadNatureConstants';
import { LeadSourceConstants } from '../../Utils/LeadFormConstants/LeadSourceConstants';
import RNPickerSelect, { defaultStyles } from 'react-native-picker-select';
import {BASE_URL,PRODUCTS_ENDPOINT,COLORS_ENDPOINT,LEADS_ENDPOINT} from 'react-native-dotenv';
import AsyncStorage from '@react-native-community/async-storage';
import { object } from 'prop-types';
import { CityConstants } from '../../Utils/LeadFormConstants/CityConstants';
import { CurrentVehicleConstants } from '../../Utils/LeadFormConstants/CurrentVehicleConstants';
import { ChooseReasonConstants } from '../../Utils/LeadFormConstants/ChooseReasonConstants';
import { RejectReasonConstants } from '../../Utils/LeadFormConstants/RejectReasonConstants';
import { showErrorToast, showSuccessToast } from '../../Lib/Toast';
import Fonts from '../../Themes/Fonts';
import { AgileCategoryConstants } from '../../Utils/LeadFormConstants/AgileCategoryConstants';
import Routes from '../../Navigation/Routes';

var productList = [];
var colorList=[];
var productDataItems=[];
var colorDataItems=[];


var width = Dimensions.get('window').width;

const dropDownStyle={
    height: 45,
    width:width/2.25,
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
}
const dropDownStyleFull={
    height: 45,
    width:width/1.115,
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
        .number()
        .label('Phone')
        .min(2)
        .required('* Phone no is required'),

});


   const LeadForm=(props)=>{

   
        const navigation = useNavigation();
        const route = useRoute();
        const {t} = useTranslation();
        var firstName, lastName, countryCode, phoneNumber;
        const[flag,setFlag]=React.useState(false);
        const[dataOptionSet,setDataOptionSet]=React.useState({
              products:[],
              leadNature: undefined,
              currentVehicle:undefined,
              city:undefined,
              agileCategory:undefined,
              leadSource: undefined,
              firstName:undefined,
              lastName:undefined,
              phoneNumber:undefined,
              emailAddress:undefined,
              street:undefined,
              previousModel:undefined,
              reasonToChoose:undefined,
              reasonToReject:undefined,
        });
        const[token,setToken]=useState();
        const[productsListData,setProductsListData]=useState([
            
        ]);
        const[colorsListData,setColorsListData]=useState([
            
        ]);
    React.useEffect(()=>{

    },[flag]);
    
        React.useEffect((async)=>{
            retrieveToken();
            
        },[])
    
        React.useEffect(()=>{
           fetchColorData(token);
            
        },[productsListData])
    
        async function retrieveToken() {
            try {
              const value = await AsyncStorage.getItem('@token_key');
              if (value !== null) {
                setToken(value);
                fetchProducts(value);
                console.log("token is= "+value);
              }
            } catch (error) {
              console.log("error is",error);
            }
          }
        
    
        
    
        async function fetchProducts(token){
            console.log("token is",token);
            const res=await fetch(BASE_URL+PRODUCTS_ENDPOINT,{
                method:'GET',
                headers:{
                  'Authorization': 'Bearer '+token,
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                }
                
              })
            const data= await res.json();
            data.value.map((object,key)=>productList.push(object));
            productDataItems=productList.map(object=>({
                label:object.name,
                value:object.productid
            }));
          
            
               console.log("product list is",productDataItems);
        }
    
        async function fetchColorData(){
            console.log("product list before fetch",productsListData);
           
            const res=await fetch("https://syakarhonda.api.crm5.dynamics.com/api/data/v9.1/agile_colorses?$filter=_agile_producmodelname_value eq "+ productsListData
      
            ,{
                method:'GET',
                headers:{
                  'Authorization': 'Bearer '+token,
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                }
                
              })
              const data= await res.json();
              console.log("data is",data);
              data.value.map((object,key)=>colorList.push(object));
              colorDataItems=colorList.map(object=>({
                  label:object.agile_name,
                  value:object.agile_colorsid
              }));
            
      
                 console.log("color list is",colorDataItems);
                 console.log("lenght of color data items is",colorDataItems.length);
                 if(colorDataItems.length!=0){
                     console.log("value of color data items",colorDataItems.values.length);
                 setFlag(true);
                 }
                 else{
                     setFlag(false);
                 }
                 colorList=[];
        }
       
    
       

        const onFormSubmit = (values) => {
           
            postForm(dataOptionSet.leadNature,
                dataOptionSet.leadSource,
                dataOptionSet.agileCategory,
                values.firstName,
                values.lastName,
                values.phoneNumber,
                values.emailAddress,
                values.street,
                dataOptionSet.city,
                dataOptionSet.currentVehicle,
                values.previousModel,
                dataOptionSet.reasonToChoose,
                dataOptionSet.reasonToReject
                );
    
        }

        const postForm=(leadNature,leadSource,agileCategory,firstName,lastName,phonenumber,email,street,city,currentVehicle,previousModel,chooseReason,rejectReason)=>{
            let requestBody;
            if(colorDataItems.length!=0){
                requestBody=JSON.stringify({
                    subject:'Interested in '+AgileCategoryConstants[agileCategory-1].label,
                    new_leadnature:leadNature,
                        leadsourcecode:leadSource,
                        agile_catogeries:agileCategory,
                        firstname:firstName,
                        lastname:lastName,
                        fullname:firstName+' '+lastName,
                        mobilephone:phonenumber,
                        emailaddress1:email,
                        address1_name:street,
                        address1_addresstypecode:city,
                        new_currentbikescoote:currentVehicle,
                        new_previousbikemodel:previousModel,
                        agile_reasontochoose:chooseReason,
                        agile_reasonforleaving:rejectReason,
                        'agile_InterestedModel@odata.bind':"/products("+productsListData+")",
                        'agile_Colors@odata.bind':"/agile_colorses("+colorsListData+")"
                })
            }
             
            else{
                requestBody=JSON.stringify({
                    subject:'Interested in '+AgileCategoryConstants[agileCategory-1].label,
                    new_leadnature:leadNature,
                        leadsourcecode:leadSource,
                        agile_catogeries:agileCategory,
                        firstname:firstName,
                        lastname:lastName,
                        fullname:firstName+' '+lastName,
                        mobilephone:phonenumber,
                        emailaddress1:email,
                        address1_name:street,
                        address1_addresstypecode:city,
                        new_currentbikescoote:currentVehicle,
                        new_previousbikemodel:previousModel,
                        agile_reasontochoose:chooseReason,
                        agile_reasonforleaving:rejectReason,
                        'agile_InterestedModel@odata.bind':"/products("+productsListData+")"
                })
            }
            fetch(BASE_URL+LEADS_ENDPOINT,{
                method:'POST',
                headers:{
                  'Authorization': 'Bearer '+token,
                  'Content-Type': 'application/json'
                },
                body:requestBody
              }).then((response)=>{
                  if(response.ok){
                    showSuccessToast("Successfully setup lead form")
                    navigation.reset({
                        index:0,
                        routes:[{name:'LEAD'}]
                    })
                    navigation.navigate(Routes.HOME_STACK);
                  }
                  else{
                    console.log('response not ok');
                    console.log(response.status);
                    showErrorToast("Error while submitting lead form");
                   response.json().then(value=>{
                        console.log("error is",value);
                    })
                    console.log(response.json());
                  }
              }
              ).catch(error=>{
                showErrorToast("Error while submitting lead form");
                  console.log("error is",error);
              })
    }
   
        // console.log("selected product is",productsListData)

        // console.log("data option set is",dataOptionSet.leadNature);

        function renderColorView(flag){
            let container;
            if(flag){
                container=(
                    <View style={{ flexDirection: 'column'}}>
                                     <Text style={{marginBottom:-16}}>Color</Text>
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
          </View>
                );
            }
            else{
                container=null;
            }
            return container;
        }

    return(
        <SafeAreaView style={{ width: '100%', flex: 1, backgroundColor: '#ffffff' }}>
            
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ backgroundColor: '#ffffff',marginTop:24 }}>
                    <ScrollView>
                        <View style={styles.body}>
                            <HeadingText>New Lead</HeadingText>
                        </View>

                        <Formik
                            initialValues={{
                                firstName: '',
                                lastName: '',
                                phoneNumber: '',
                                
                            }}
                            onSubmit={onFormSubmit}
                            
                            validationSchema={validationSchema}>

                            {formikProps => (
                                <SafeAreaView style={{marginLeft: 16, marginTop: 13}}>
                                    
                                     <View style={{ flexDirection: 'row'  }}>
                                     <View style={{ flexDirection: 'column'}}>
                                     <Text style={{marginBottom:-16}}>Lead Nature</Text>
                                     <View style={dropDownStyle}>
                                     <RNPickerSelect
                                   
            items={LeadNatureConstants}
            onValueChange={value => {
            setDataOptionSet({
                ...dataOptionSet,leadNature: value,
              });
            }}
            style={pickerSelectStyles}
            value={dataOptionSet.leadNature}
            useNativeAndroidPickerStyle={false}
           
          />
          </View>
          </View>

          <View style={{ flexDirection: 'column'}}>
                                     <Text style={{marginBottom:-16}}>Lead Source</Text>
                                     <View style={dropDownStyle}>
                                     <RNPickerSelect
          
            items={LeadSourceConstants}
            onValueChange={value => {
            setDataOptionSet({
                ...dataOptionSet,leadSource: value,
              });
            }}
            style={pickerSelectStyles}
            value={dataOptionSet.leadSource}
            useNativeAndroidPickerStyle={false}
           
          />
          </View>
          </View>
                                    </View>

                                    <View style={{ flexDirection: 'column'}}>
                                     <Text style={{marginBottom:-16}}>Categories</Text>
                                     <View style={dropDownStyleFull}>

                                        <RNPickerSelect
                                            items={AgileCategoryConstants}
                                            onValueChange={(value,label) => {
                                            setDataOptionSet({
                                                ...dataOptionSet,agileCategory:value,
                                            });
                                            }}
                                            style={pickerSelectStyles}
                                            value={dataOptionSet.agileCategory}
                                            useNativeAndroidPickerStyle={false}
                                        
                                        />    
                                        </View>
                                        </View>


                                    <View style={{ flexDirection: 'row'  }}>
                                    <View style={{ flexDirection: 'column'}}>
                                     <Text style={{marginBottom:-16}}>Model</Text>
                                     <View style={dropDownStyle}>
                                     <RNPickerSelect
            items={productDataItems}
            onValueChange={(value) => 
            setProductsListData(value)
            }
            style={pickerSelectStyles}
            value={productsListData}
            useNativeAndroidPickerStyle={false}
           
          />
          </View>
          </View>
          {renderColorView(flag)}
          </View>

                                   
                                    <View style={{ flexDirection: 'row'  }}>
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
                                            <StyledInput
                                            label="Address"
                                            formikProps={formikProps}
                                            formikKey="addeess"
                                             />
                                            <View style={{ flexDirection: 'row'  }}>
                                        <StyledInput
                                            label="Street"
                                            formikProps={formikProps}
                                            formikKey="street"
                                             />

                                        <View style={{ flexDirection: 'column'}}>
                                     <Text style={{marginBottom:-16}}>City</Text>
                                     <View style={dropDownStyle}>

                                        <RNPickerSelect
                                            items={CityConstants}
                                            onValueChange={value => {
                                            setDataOptionSet({
                                                ...dataOptionSet,city: value,
                                            });
                                            }}
                                            style={pickerSelectStyles}
                                            value={dataOptionSet.city}
                                            useNativeAndroidPickerStyle={false}
                                        
                                        />    
                                        </View>
                                        </View>
                                    </View>
                                    <Text style={{
                                        fontSize:24,
                                        marginTop:8,
                                        fontFamily:Fonts.type.bold
                                        
                                    }}>Current Vehicle Information</Text>

                                    <View style={{ flexDirection: 'column',marginTop:24}}>
                                     <Text style={{marginBottom:-16}}>Current Bike/Scooter</Text>
                                     <View style={dropDownStyleFull}>

                                        <RNPickerSelect
                                            items={CurrentVehicleConstants}
                                            onValueChange={value => {
                                            setDataOptionSet({
                                                ...dataOptionSet,currentVehicle: value,
                                            });
                                            }}
                                            style={pickerSelectStyles}
                                            value={dataOptionSet.currentVehicle}
                                            useNativeAndroidPickerStyle={false}
                                        
                                        />    
                                        </View>
                                        </View>
                                             <StyledInput
                                            label="Previous Model"
                                            formikProps={formikProps}
                                            formikKey="previousModel"
                                             />
                                             <View style={{ flexDirection: 'column'}}>
                                     <Text style={{marginBottom:-16}}>Reason To Choose</Text>
                                     <View style={dropDownStyleFull}>

                                        <RNPickerSelect
                                            items={ChooseReasonConstants}
                                            onValueChange={value => {
                                            setDataOptionSet({
                                                ...dataOptionSet,reasonToChoose: value,
                                            });
                                            }}
                                            style={pickerSelectStyles}
                                            value={dataOptionSet.reasonToChoose}
                                            useNativeAndroidPickerStyle={false}
                                        
                                        />    
                                        </View>
                                        </View>
                                        <View style={{ flexDirection: 'column'}}>
                                     <Text style={{marginBottom:-16}}>Reason To Leave</Text>
                                     <View style={dropDownStyleFull}>

                                        <RNPickerSelect
                                            items={RejectReasonConstants}
                                            onValueChange={value => {
                                            setDataOptionSet({
                                                ...dataOptionSet,reasonToReject: value,
                                            });
                                            }}
                                            style={pickerSelectStyles}
                                            value={dataOptionSet.reasonToReject}
                                            useNativeAndroidPickerStyle={false}
                                        
                                        />    
                                        </View>
                                        </View>

                                    
                                 

                                    <View style={{ marginTop: 8, marginBottom: 16,marginLeft:16,justifyContent:'center',alignItems:'center' }}>
                                       
                                        <ButtonX
                           
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
            </ScrollView>

        </SafeAreaView >
    )

}


const styles = StyleSheet.create({
    textLabelStyle: {
        fontSize: 12,
        lineHeight: 14,
        marginTop: 2,
        marginBottom: 4,
        marginLeft: 4,
        color: '#333333',
    },
    ovalButton:{
        borderRadius:24,
        width:"50%",
      } ,
  
    body: {
        color: '#3D213B',
        marginTop: 24,
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
    paddingHorizontal: 20,
    paddingVertical: 8,
   
  
    borderRadius: 8,
    color: 'black',
    paddingRight: 40,
        // to ensure the text is never behind the icon
    },
  });

export default LeadForm
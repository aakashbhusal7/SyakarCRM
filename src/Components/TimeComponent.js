// import React, { useState } from 'react';
// import { Dimensions, View,Text} from 'react-native'
// import { TouchableOpacity } from 'react-native-gesture-handler';
// import DateTimePickerModal from "react-native-modal-datetime-picker";
// import Fonts from '../Themes/Fonts';

// var width = Dimensions.get('window').width;

// const dropDownStyleFull = {
//     height: 45,
//     width: width / 1.115,
//     fontSize: 14,
//     lineHeight: 16,

//     backgroundColor: '#ffffff',
//     borderWidth: 1,
//     borderColor: '#EDEDED',
//     borderRadius: 3,
//     marginRight: 8,
//     marginTop: 20,
//     marginBottom: 0,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.5,
// }
// const TimeComponent = (props) => {

//     const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

//     const showDatePicker = () => {
//         setDatePickerVisibility(true);
//     };
//     const [date, setDate] = React.useState(new Date())
//     props.getTime(date);

//     const hideDatePicker = () => {
//         setDatePickerVisibility(false);
//     };

//     const handleConfirm = (date) => {
//         console.warn("A time has been picked: ", date);
//         setDate(date);
//         hideDatePicker();
//     };

//     return (
//         <TouchableOpacity onPress={showDatePicker}>

//         <View style={dropDownStyleFull}>
//             <Text style={{marginTop:12,marginLeft:16,fontFamily:Fonts.type.primary,color:'#333333',fontSize:14,lineHeight:16}}>
//                 {date.toString().substr(15,6)}
//             </Text>
//                 <DateTimePickerModal
//                     isVisible={isDatePickerVisible}
//                     mode="time"
//                     date={date}
//                     onConfirm={handleConfirm}
//                     onCancel={hideDatePicker}
//                 />
//         </View>
//         </TouchableOpacity>



//     );

// }

// export default TimeComponent;
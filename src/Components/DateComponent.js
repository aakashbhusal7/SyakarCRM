import React, { useState } from 'react';
import { Dimensions, View, Text } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Fonts from '../Themes/Fonts';

var width = Dimensions.get('window').width;

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
const DateComponent = (props) => {

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };
    console.log("passed dates is", props.date);
    const [date, setDate] = React.useState(new Date(props.date))
    props.getData(date);

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        setDate(date);
        hideDatePicker();
    };

    return (
        <TouchableOpacity onPress={props.edit?showDatePicker:hideDatePicker}>

            <View style={dropDownStyleFull}>
                <Text style={{ marginTop: 12, marginLeft: 16, fontFamily: Fonts.type.primary, color: '#333333', fontSize: 14, lineHeight: 16 }}>
                    {date.toString().substr(4, 12)}
                </Text>
                <DateTimePickerModal

                    isVisible={isDatePickerVisible}
                    mode="date"
                    date={date}
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                />
            </View>
        </TouchableOpacity>



    );

}

export default DateComponent;
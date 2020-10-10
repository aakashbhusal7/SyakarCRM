import React, { useState } from 'react';
import { View, Button, Platform, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TouchableOpacity } from 'react-native-gesture-handler';

const DatePickerComponent = (props) => {
    const [date, setDate] = useState(new Date(1598051730000));
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(true);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
        props.getData(currentDate.toString().substr(4,12));
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const showTimepicker = () => {
        showMode('time');
    };

    return (
        <View>
            
            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    style={styles.containerSingle}
                    value={date}
                    mode={mode}
                    is24Hour={true}
                    display="default"
                    onChange={onChange}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    containerSingle: {
        height: 45,
        width: '92%',
        fontSize: 14,
        fontFamily: "WorkSans-Bold",
        lineHeight: 16,
        marginLeft: 16,
        paddingLeft: 16,
        alignSelf: 'stretch',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#EDEDED',
        borderRadius: 3,
        marginRight: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
    },
    labelStyle: {
        fontSize: 12,
        fontWeight: 'normal',
        fontFamily: "WorkSans-Regular",
        lineHeight: 14,
        marginLeft: 16,
        marginBottom: -5,
        color: '#333333',
    },
    labeldoubleStyle: {
        fontSize: 12,
        fontWeight: 'normal',
        fontFamily: "WorkSans-Regular",
        lineHeight: 14,
        marginBottom: -5,
        color: '#333333',
    },

})

export default DatePickerComponent;
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from 'react-native-elements';
import IconPhone from '../../src/Assets/icon-phone.svg';
import defaultTheme from '../Themes';
import Fonts from '../Themes/Fonts';
const CardListComponent = (props) => {
    let element;
    if (props.flag === "followUp") {
        element = (
            <View >
                <Card containerStyle={{ borderRadius: 10, opacity: 100, borderWidth: 0 }}>


                    <Text style={styles.nameStyle}>{props.data.name}</Text>
                    <Text style={[styles.subHeaderStyle, { marginTop: 4 }]}>{props.data.email}</Text>


                </Card>
            </View>);
    }
    else if (props.flag === "testRide") {
        element = (
            <View >
                <Card containerStyle={{ borderRadius: 10, opacity: 100, borderWidth: 0 }}>


                    <Text style={styles.nameStyle}>{props.data.name}</Text>
                    <Text style={[styles.subHeaderStyle, { marginTop: 4 }]}>{props.data.email}</Text>
                    <Text style={[styles.subHeaderStyle, { marginTop: 4 }]}>{props.data.feedback}</Text>

                    <Text style={[styles.subHeaderStyle, { marginTop: 4 }]}>{props.data.licenseNumber}</Text>


                </Card>
            </View>);
    } else {
        element = (
            <View >
                <Card containerStyle={{ borderRadius: 10, opacity: 100, borderWidth: 0 }}>


                    <Text style={styles.nameStyle}>{props.data.fullname}</Text>
                    <Text style={[styles.subHeaderStyle, { marginTop: 4 }]}>{props.data.email}</Text>
                    <View style={{ flexDirection: 'row', marginTop: 8, alignItems: 'center' }}>
                        <IconPhone />
                        <Text style={[styles.subHeaderStyle, { marginLeft: 8 }]}>{props.data.phone}</Text>
                    </View>



                </Card>
            </View>
        );
    }
    return element;
}
const styles = StyleSheet.create({
    nameStyle: {
        color: defaultTheme.colors.primary,
        fontFamily: Fonts.type.bold,
        fontSize: 14,

    },
    subHeaderStyle: {
        color: defaultTheme.colors.primary,
        fontFamily: Fonts.type.secondary,
        fontSize: 12,
        

    }

})

export default CardListComponent;
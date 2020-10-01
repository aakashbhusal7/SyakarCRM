import React, { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Routes from '../../Navigation/Routes';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = (props) => {
  const navigation=useNavigation();
    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.navigate(Routes.LOGIN_SCREEN)
            
        }, 2000);
        return () => clearTimeout(timer);
    }, []);
    return (
        <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
           <Image
                    style={{ height: 12, width: 150, padding: 16, marginTop: 36 }}
                    source={require('../../../assets/app_logo.png')}
                />

        </View>
    )
    }

    
const styles = StyleSheet.create({
    textStyle: {
        marginTop: 9,
        color: '#555555',
        fontFamily: "WorkSans-Regular",
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 18,
        display: 'flex',
        lineHeight: 21,
        textAlign: 'center',
    }
})


export default SplashScreen;
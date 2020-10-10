import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
import colors from '../Themes/Colors';
import Fonts from '../Themes/Fonts';


const HeaderText = props => {
  return <Text style={styles.textStyle}>{props.children}</Text>;
};

const styles = StyleSheet.create({
  textStyle:{
      fontSize:28,
      marginLeft:16,
      color:colors.black,
      fontFamily:Fonts.type.bold,
      marginBottom:8,
  }
});

export default HeaderText;

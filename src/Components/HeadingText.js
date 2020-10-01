import * as React from 'react';
import { StyleSheet, Text } from 'react-native';


const HeadingText = props => {
  return <Text style={props.noPadding?[styles.noPadding]:[styles.bold]}>{props.children}</Text>;
};

const styles = StyleSheet.create({
  bold: {
    
    paddingLeft:16,
    fontSize: 24,
    alignItems:'center',
    lineHeight: 23,
    color: '#414D55',
    
  },
  noPadding:{

    fontSize: 20,
    alignItems:'center',
    lineHeight: 23,
    color: '#3D213B',

  }
});

export default HeadingText;

import React from 'react';
import { View, StyleSheet } from 'react-native'
import { SearchBar } from 'react-native-elements';

const SearchComponent = (props) => {
    const [search, setSearch] = React.useState({
        allData: props.data,
        filteredData: props.data
    });
    const updateSearch = (text) => {
        console.log("data of search is", allData);
        setSearch({
            filteredData: props.data.filter(value =>
                value.fullname.toLowerCase().includes(text.toLowerCase()),
            ),
        })
    }
    return (
        <View>
            <SearchBar
                underlineColorAndroid="white"
                lightTheme={true}
                containerStyle={{ backgroundColor: 'white', color: 'white', borderWidth: 0, marginTop: 8, marginBottom: 8, marginLeft: 16, marginRight: 16 }}
                inputContainerStyle={{ backgroundColor: 'white', height: 32, borderWidth: 0, borderColor: 'white' }}
                inputStyle={{ fontFamily: Fonts.type.primary, fontSize: 16 }}
                placeholder="Search"
                onChangeText={text => updateSearch(text)}
                value={search}
            />
        </View>
    );
}

const styles = StyleSheet.create({

})
export default SearchComponent;

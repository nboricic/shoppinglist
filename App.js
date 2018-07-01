import React from 'react';
import {StyleSheet, Text, View, ScrollView, Image, TextInput} from 'react-native';

class Product extends React.Component {

    render() {
        return (
            <View style={{flexDirection: "row", paddingBottom: 10}}>
                <Image style={{height: 50, width: 50}} source={{uri: 'http://via.placeholder.com/50x50'}}/>
                <Text>{this.props.name}</Text>
            </View>
        );
    }

}

class ProductPicker extends React.Component {

    timeout = null;

    state = {
        products: []
    };

    /**
     * Will call product's API and populate the state with products.
     */
    fetchProducts() {
        let localResponse = require('./data/api.json');
        let options = [];

        for (let o of localResponse.items) {
            options.push(<Product key={o.id} name={o.name}/>);
        }

        this.setState({products: options});


        // fetch('http://192.168.86.46:8000/suppliers/1/stores')
        //     .then((response) => response.json())
        //     .then((response) => {
        //         let options = [];
        //
        //         for (let o of response.items) {
        //             options.push(<Product key={o.id} name={o.name}/>);
        //         }
        //
        //         this.setState({products: options});
        //     }).catch((error) => {
        //     console.log(error);
        // });
    }

    textChanged(text) {
        clearTimeout(this.timeout);

        if (!text) {
            this.setState({products: []});
        } else {
            this.timeout = setTimeout(
                () => {
                    this.fetchProducts();
                },
                500
            );
        }

    };

    render() {
        return (

            <ScrollView style={{padding: 50, width: 300}}>
                <TextInput
                    style={{height: 40, width: 100}}
                    onChangeText={(text) => this.textChanged(text)}
                />
                {this.state.products}
            </ScrollView>
        );
    }
}

export default class App extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <ProductPicker/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
});

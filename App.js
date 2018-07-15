import React from 'react';
import {StyleSheet, Text, View, ScrollView, Image, Picker} from 'react-native';

class Customer extends React.Component {

    constructor(props) {
        super(props);
        console.trace();
    }

    addToList(product) {
        React.createElement();
    }

    static current() {
        if (!Customer.instance) {
            Customer.instance = new Customer({username: 'nboricic'});
        }

        return Customer.instance;
    }

    render() {
        return (<Text>{this.props.username}</Text>)
    }

}

class Product extends React.Component {

    render() {
        return (
            <View style={{flexDirection: "row", paddingBottom: 10}}>
                <Image style={{height: 50, width: 50}} source={{uri: 'http://via.placeholder.com/50x50'}}/>
                <View>
                    <Text>{this.props.name}</Text>
                    <Text>{this.props.description}</Text>
                    {this.props.price}
                </View>
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
        let localResponse = {
            "items": [
                {
                    "id": "1",
                    "name": "Apple"
                },
                {
                    "id": "2",
                    "name": "Pear"
                },
                {
                    "id": "3",
                    "name": "Banana"
                },
                {
                    "id": "4",
                    "name": "Coke"
                },
                {
                    "id": "5",
                    "name": "Pepsi"
                }
            ]
        };

        let options = [];

        for (let o of localResponse.items) {
            options.push(<Product key={o.id} name={o.name}/>);
        }

        this.setState({products: options});
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

    onProductSelected(itemValue, itemIndex) {
        if (!itemValue) {
            return;
        }

        let requestParams = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({product_id: itemValue})
        };

        fetch('http://192.168.86.49:8000/carts', requestParams)
            .then((response) => response.json())
            .then((response) => {
                let carts = [];

                for (let i of response.items) {

                    let cartProducts = [];

                    for (let p of i.products) {
                        cartProducts.push(
                            <Product
                                key={p.id}
                                name={p.name}
                                price={<Money value={p.price}/>}
                                description={p.description}/>
                        );
                    }

                    carts.push(
                        <Cart key={i.id}
                              store={<Store
                                  name={i.store.name}
                                  address={i.store.address}/>}
                              products={cartProducts}
                              total={<Money value={i.total}/>}
                        />
                    );
                }

                this.props.listHolder.updateList(carts);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    componentDidMount() {
        //get available products from the api
        fetch('http://192.168.86.49:8000/products/in-area')
            .then((response) => response.json())
            .then((response) => {
                //update picker options
                let options = [];

                for (let i of response.items) {
                    options.push(<Picker.Item key={i.id} label={i.name} value={i.id}/>);
                }

                this.setState({products: options});
            })
            .catch((error) => {
                console.log(error);
            });
    }

    render() {
        return (
            <Picker
                style={{height: 50, width: 300}}
                onValueChange={(itemValue, itemIndex) => this.onProductSelected(itemValue, itemIndex)}>
                <Picker.Item label="What would you like?" value=""/>
                {this.state.products}
            </Picker>
        );
    }
}

class Cart extends React.Component {

    render() {
        return (
            <View style={{borderBottomColor: 'grey', borderBottomWidth: 1, marginBottom: 20}}>
                {this.props.store}
                {this.props.products}
                {this.props.total}
            </View>
        );
    }

}

class Store extends React.Component {

    render() {
        return (
            <View>
                <Text>{this.props.name}</Text>
                <Text>{this.props.address}</Text>
            </View>
        );
    }

}

class Money extends React.Component {

    render() {
        return (<Text>{this.props.value}</Text>);
    }

}

export default class App extends React.Component {

    state = {
        carts: []
    };

    updateList(cartList) {
        this.setState({
            carts: cartList
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <Customer username="nboricic"/>
                <ProductPicker listHolder={this}/>
                <ScrollView>
                    {this.state.carts}
                </ScrollView>
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

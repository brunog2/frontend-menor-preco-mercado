import React from 'react';
import axios from 'axios';
import { Redirect, Link } from 'react-router-dom';
import './index.css'

export default class Products extends React.Component{
    constructor(props) {
        super(props);
        this.state = { 
            productsOnCart: [],
            redirect: false
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleAddToCart = this.handleAddToCart.bind(this);
        this.changeQuantity  = this.changeQuantity.bind(this);
    };

    componentDidUpdate() {
        console.log(this.state)
    };

    componentDidMount() {
        console.log("chegou");
        axios.get('/productsOnCart').then((r) => {
            this.setState({ products: r.data})    
        })
        
    };

    handleSubmit = (e) => {
        axios.get('/products', { params: { q: this.state.searchText } }).then((r) => {
            // retorna a lista de produtos e seta no estado
            this.setState({products: r.data});
        });

        e.preventDefault();
    };

    handleAddToCart = (product) => {
        let newProduct = product;
        newProduct['qtd'] = 1;
        this.setState({ productsOnCart: this.state.productsOnCart.push(newProduct) });

        console.log(newProduct)
    };

    handleDeleteProduct = (codGetin) => {
        var products = this.state.products;
        axios.post("/deleteProduct", { codGetin: codGetin }).then(() => {
            for (var product in products){
                if (product.codGetin == codGetin){
                    products.splice(products.indexOf(product), 1);
                    break;
                }
            }
            
            this.setState({ products: products });
        });
    };

    changeQuantity = (operation, codGetin) => {
        axios.post('/changeQuantity', { params: { "operation": operation, "codGetin": codGetin } }).then((r) => {
            // retorna a lista de produtos e seta no estado
            var products = this.state.products;
            for (var product in products) {
                if (product.codGetin == codGetin) {
                    if (product.qtd == 1 && operation == "sub") {
                        this.handleDeleteProduct(codGetin);
                    } else {
                        axios.post("/changeQuantity", { operation: operation, codGetin: codGetin }).then(() => {
                            this.setState({ products: products });
                            operation == "sum" ? product.qtd++ : product.qtd--;
                        })                        
                    }
                } 
            }            
        });
    };

    render(){
        var { redirect } = this.state;
        var { products } = this.state;
        if (redirect) {
            return <Redirect to={{pathname: "/products", state: { products:  products}}} />
        } else {
            return(
                <div className="main-container">
                    <div className="top-container">
                        <Link to='/products' className="cart-container">
                            <p className="material-icons">Home</p>
                        </Link>
                    </div>

                    <div className="bottom-container">
                        <div>
                            <p className="cards-title">{this.state.products.length} produtos adicionados ao carrinho</p>
                        </div>  

                        <form id="searchMarket" action="/searchMarket" />
                        
                        <div className="cards-container">
                            {this.state.products.map(product => (
                                <div className="card" id="{{product.dscProduto + product.codGetin}}">
                                    <div className="title-container">
                                        <p className="product-title" >{product.dscProduto}</p>
                                        
                                        <button className="material-icons icon delete-button" onClick={this.handleDeleteProduct}>Del</button>
                                        
                                    </div>
                                    
                                    <div className="quantityContainer">
                                        <button name="sum" value="+" className="material-icons icon quantity-button" onClick={() => this.changeQuantity("sub", product.codGetin)}/>

                                        <p>{product.qtd}</p>
                                        
                                        <button name="sum" value="+" className="material-icons icon quantity-button" onClick={() => this.changeQuantity("sum", product.codGetin)}/>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <input type="submit" form="searchMarket" className="submit-products-button" value="Procurar melhor mercado" />
                    </div>  
                </div>    
            )
        }
    }
}
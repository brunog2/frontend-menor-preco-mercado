import React from 'react';
import axios from 'axios';
import './index.css';
import { Redirect } from 'react-router-dom';

export default class Main extends React.Component{
    constructor(props) {
        super(props);
        this.state = { searchText: '', products: [], redirect: false};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange = (e) => {
        this.setState({searchText: e.target.value});  
    }

    handleSubmit = (e) => {
        axios.get('/products', { params: { q: this.state.searchText } }).then((r) => {
            // retorna a lista de produtos e seta no estado
            console.log(r.data);
            this.setState({products: r.data, redirect: true});
        });

        e.preventDefault();
    };



    render(){
        var redirect = this.state.redirect;
        var products = this.state.products;
        var searchText = this.state.searchText;

        if (redirect) {
            return <Redirect to={{pathname: "/products", state: { products:  products, searchText: searchText}}} />
        } else {
            return(
                <div className="main-container">
                    <div className="top-container">
                        <a href="/cart" className="material-icons">Carrinho</a>
                    </div>

                    <div className="search-container">
                        <p htmlFor="search-input" className="input-label">Informe o nome do produto</p>
                        
                        <form onSubmit={this.handleSubmit} className="input-container">
                            <input value={searchText} type="text" className="search-input" placeholder="Ex.: arroz parbolizado" onChange={this.handleChange}/>

                            <input type="submit" className="search-button" value="Pesquisar" />
                        </form>   
                    </div>
                </div>
            )
        }
    }
}
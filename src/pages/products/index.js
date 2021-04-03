import React from 'react';
import axios from 'axios';
import { Redirect, Link } from 'react-router-dom';
import './index.css'

export default class Products extends React.Component{
    constructor(props) {
        super(props);
        this.state = { 
            searchText: '', 
            products: [], 
            productsOnCart: [],
            redirect: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleAddToCart = this.handleAddToCart.bind(this);
    }

    componentDidUpdate() {
        console.log(this.state)
    }

    componentDidMount(props) {
        console.log("chegou");
        if (this.props.location.state !== undefined){
            this.setState({ products: this.props.location.state.products,  searchText: this.props.location.state.searchText})
        }        
    }

    handleChange(event) {
        this.setState({searchText: event.target.value});  
    }

    handleAddToCart = (e, product) => {
        if (product in this.state.productsOnCart) {
            alert("Produto já adicionado!")
        } else {
            axios.post('/addToCart', product).then(() => {
                this.setState({ productsOnCart: this.state.productsOnCart.push(product) });
                console.log(product)
            })
        }
        e.preventDefault();
    } 
    
    handleSubmit = (e) => {
        axios.get('/products', { params: { q: this.state.searchText } }).then((r) => {
            // retorna a lista de produtos e seta no estado
            this.setState({products: r.data});
        });
        e.preventDefault();
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
                        <Link to='/cart' className="cart-container">
                            <p className="material-icons">Carrinho</p>
                        </Link>
                    </div>        

                    <div className="search-container">            
                        <p htmlFor="search-input" className="input-label">Informe o nome do produto</p>
                            <form onSubmit={this.handleSubmit} className="input-container">
                                <input type="text" value={this.state.searchText} onChange={this.handleChange} className="search-input" placeholder="Ex.: arroz parbolizado" />

                                <input type="submit" className="search-button" value="Pesquisar" />
                            </form>         
                            
                        <p className="post-text">Especifique o produto ao máximo para obter resultados mais relevantes</p>
                        
                    </div>
                    

                    <div className="bottom-container">
                        <div>
                            <p className="cards-title">Aproximadamente {this.state.products.length} resultados para "{this.state.searchText}"</p>
                            <p>Escolha o máximo de produtos relevantes para melhorar a pesquisa de preços</p>
                        </div>
                        <div className="cards-container">   
                        {this.state.products.map(product => (
                            <form onSubmit={(e) => this.handleAddToCart(e, product)} >
                                <div className="card">
                                    <div className="title-container">
                                        <p className="product-title" >{product.dscProduto}</p>
                                    </div>
                                    <input type="submit" className="add-to-cart" value="Adicionar ao carrinho" />
                                </div>
                            </form>
                        ))}
                        </div>
                        <Link to="/cart" className="submit-products-button"><p>Ir para o carrinho</p></Link>
                </div>
            </div>
            )
        }
    }
}
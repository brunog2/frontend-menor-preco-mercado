import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Main from './pages/main';
import Products from './pages/products';
import Cart from './pages/cart';

const Routes = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path='/' component={Main} />
            <Route path="/products" render={(props) => <Products {...props}/>}/>
            <Route path="/cart" render={(props) => <Cart {...props}/>}/>
        </Switch>
    </BrowserRouter>
);

export default Routes;
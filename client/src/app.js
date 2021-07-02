import React, { useState, useEffect } from "react";
import axios from 'axios';
import Home from './components/home'

import Products from './components/productList'
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom'

export default function App() {
    return (
        <Router>
            <Switch>
                <Route exact path='/' component={Home} />
                <Route path="/:username" component={Products} />
            </Switch>
            
        </Router>
    );
}

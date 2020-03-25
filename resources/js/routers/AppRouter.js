//package imports
import React from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';

//component imports
import Header from '../components/Header';
import Footer from '../components/Footer';

import WelcomeComponent from "../components/WelcomeComponent";
import HomeComponent from "../components/HomeComponent";


const appRouter = () => (
    <BrowserRouter>
        <div>
            <Header/>
            <Switch>
                <Route path="/" component={WelcomeComponent} exact={true} />
                <Route path="/home" component={HomeComponent} exact={true} />
            </Switch>
            <Footer/>
        </div>
    </BrowserRouter>
);

export default appRouter;

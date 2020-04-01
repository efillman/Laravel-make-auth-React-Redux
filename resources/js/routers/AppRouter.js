//package imports
import React from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';

//component imports
import Header from '../components/Header';
import Footer from '../components/Footer';

import WelcomeComponent from "../components/WelcomeComponent";
import HomeComponent from "../components/HomeComponent";
import LoginComponent from "../components/LoginComponent";
import LogoutComponent from "../components/LogoutComponent";
import RegistrationComponent from "../components/RegistrationComponent";
import EmailVerifyComponent from "../components/EmailVerifyComponent";



const appRouter = () => (
    <BrowserRouter>
        <div>
            <Header/>
            <Switch>
                <Route path="/" component={WelcomeComponent} exact={true} />
                <Route path="/home" component={HomeComponent} exact={true} />
                <Route path="/login" component={LoginComponent} exact={true} />
                <Route path="/logout" component={LogoutComponent} exact={true} />
                <Route path="/register" component={RegistrationComponent} exact={true} />
                <Route path="/email/verify/:verifyid/:verifytoken" component={EmailVerifyComponent} exact={true} />
            </Switch>
            <Footer/>
        </div>
    </BrowserRouter>
);

export default appRouter;

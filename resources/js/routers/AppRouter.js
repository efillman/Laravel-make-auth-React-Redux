//package imports
import React from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';

//component imports
import Header from '../components/Header';
import Footer from '../components/Footer';

import WelcomeComponent from "../components/WelcomeComponent";
import HomeComponent from "../components/HomeComponent";
import LoginComponent from "../components/LoginComponent";
import NewLoginComponent from "../components/NewLoginComponent";
import AuthLoginComponent from "../components/AuthLoginComponent";
import LogoutComponent from "../components/LogoutComponent";
import RegistrationComponent from "../components/RegistrationComponent";
import EmailVerifyComponent from "../components/EmailVerifyComponent";
import PasswordRequestComponent from "../components/PasswordRequestComponent";
import PasswordResetComponent from "../components/PasswordResetComponent";



const appRouter = () => (
    <BrowserRouter>
        <div>
            <Header/>
            <Switch>
                <Route path="/" component={WelcomeComponent} exact={true} />
                <Route path="/home" component={HomeComponent} exact={true} />
                <Route path="/login" component={LoginComponent} exact={true} />
                <Route path="/newlogin" component={NewLoginComponent} exact={true} />
                <Route path="/auth" component={AuthLoginComponent} exact={true} />
                <Route path="/logout" component={LogoutComponent} exact={true} />
                <Route path="/register" component={RegistrationComponent} exact={true} />
                <Route path="/email/verify/:verifyid/:verifytoken" component={EmailVerifyComponent} exact={true} />
                <Route path="/email/verify" component={EmailVerifyComponent} exact={true} />
                <Route path="/password/reset" component={PasswordRequestComponent} exact={true} />
                <Route path="/password/reset/:resettoken" component={PasswordResetComponent} exact={true} />
          </Switch>
            <Footer/>
        </div>
    </BrowserRouter>
);

export default appRouter;

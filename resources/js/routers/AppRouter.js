//package imports
import React from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';

//component imports
import Header from '../components/Header';
import Footer from '../components/Footer';

import WelcomeComponent from "../components/WelcomeComponent";
import TermsComponent from "../components/TermsComponent";
import HomeComponent from "../components/HomeComponent";
import PortfolioMainComponent from "../components/portfolio/PortfolioMainComponent";
import SkordePortfolioMainComponent from "../components/portfolio/SkordePortfolioMainComponent";
import LoginComponent from "../components/LoginComponent";
import LogoutComponent from "../components/LogoutComponent";
import RegistrationComponent from "../components/RegistrationComponent";
import PasswordRequestComponent from "../components/PasswordRequestComponent";
import PasswordResetComponent from "../components/PasswordResetComponent";
import PasswordFindComponent from "../components/PasswordFindComponent";
import EmailVerifyComponent from "../components/EmailVerifyComponent";
import EmailResendComponent from "../components/EmailResendComponent";
import ThreeStockComponent from "../components/games/ThreeStockComponent";
import TwoStockComponent from "../components/games/TwoStockComponent";
import OneStockComponent from "../components/games/OneStockComponent";
import TournamentChart from '../components/games/TournamentChart';
import RankStocksComponent from '../components/games/RankStocksComponent';
import RewardsComponent from "../components/RewardsComponent";

const appRouter = () => (
    <BrowserRouter>
        <div>
            <Header/>
            <Switch>
                <Route path="/" component={WelcomeComponent} exact={true} />
                <Route path="/home" component={PortfolioMainComponent} exact={true} />
                <Route path="/terms" component={TermsComponent} exact={true} />
                <Route path="/login" component={LoginComponent} exact={true} />
                <Route path="/logout" component={LogoutComponent} exact={true} />
                <Route path="/register" component={RegistrationComponent} exact={true} />
                <Route path="/password/request" component={PasswordRequestComponent} exact={true} />
                <Route path="/password/reset" component={PasswordResetComponent} exact={true} />
                <Route path="/password/find/:passwordtoken" component={PasswordFindComponent} exact={true} />
                <Route path="/email/verify/:verifytoken" component={EmailVerifyComponent} exact={true} />
                <Route path="/email/resend" component={EmailResendComponent} exact={true} />
                <Route path="/vote3" component={ThreeStockComponent} exact={true} />
                <Route path="/vote2" component={TwoStockComponent} exact={true} />
                <Route path="/vote1" component={OneStockComponent} exact={true} />
                <Route path="/tournament" component={TournamentChart} exact={true} />
                <Route path="/skordefund" component={SkordePortfolioMainComponent} exact={true} />
                <Route path="/rankstocks" component={RankStocksComponent} exact={true} />
                <Route path="/rewards" component={RewardsComponent} exact={true} />
            </Switch>
            <Footer/>
        </div>
    </BrowserRouter>
);

export default appRouter;

//public function resetPassword()
//    {
//        $this->get('password/reset', 'Auth\ForgotPasswordController@showLinkRequestForm')->name('password.request');
//        $this->post('password/email', 'Auth\ForgotPasswordController@sendResetLinkEmail')->name('password.email');
//        $this->get('password/reset/{token}', 'Auth\ResetPasswordController@showResetForm')->name('password.reset');
//        $this->post('password/reset', 'Auth\ResetPasswordController@reset')->name('password.update');
//    }
//
//public function emailVerification()
//    {
//        $this->get('email/verify', 'Auth\VerificationController@show')->name('verification.notice');
//        $this->get('email/verify/{id}', 'Auth\VerificationController@verify')->name('verification.verify');
//        $this->get('email/resend', 'Auth\VerificationController@resend')->name('verification.resend');
//    }

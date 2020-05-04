<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::group(['middleware' => ['json.response']], function () {

    Route::middleware('auth:api')->get('/user', function (Request $request) {
        return $request->user();
    });

    // public routes
    Route::post('/login', 'Api\AuthController@login')->name('login.api');
    Route::post('/register', 'Api\AuthController@register')->name('register.api');
    Route::post('/password/email', 'Api\AuthController@resetEmail')->name('password.email.api');
    Route::post('/password/reset', 'Api\AuthController@reset')->name('password.reset.api');
    Route::post('/refresh-token', 'Api\AuthController@refreshToken')->name('refreshToken.api');


    // private routes
    Route::middleware('auth:api')->group(function () {
        Route::get('/logout', 'Api\AuthController@logout')->name('logout');
        Route::post('/email/verify', 'Api\AuthController@verify')->name('verification.verify.api');
        Route::get('/email/resend', 'Api\AuthController@resendVerify')->name('verification.resend.api');
    });

});

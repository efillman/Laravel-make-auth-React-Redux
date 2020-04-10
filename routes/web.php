<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/', function () {
//     return view('welcome');
// });


//Route::get('/home', 'HomeController@index')->name('home');

//might have to take this out
Route::view('login', 'login');
Route::post('login', 'AuthController@login')->name('login');

//these routes are used only for verification emails
Route::view('/{path?}', 'welcome');
Route::view('/{path?}/{path1?}', 'welcome');
Route::view('/{path?}/{path1?}/{path2?}', 'welcome');
Route::view('/{path?}/{path1?}/{path2?}/{path3?}', 'welcome');

//Route::get('login','Auth\LoginController@login')->name('login');
Route::get('email/verify/{id}/{hash}', 'Auth\VerificationController@verify')->name('verification.verify');
Route::get('password/reset/{token}', 'Auth\VerificationController@reset')->name('password.reset');

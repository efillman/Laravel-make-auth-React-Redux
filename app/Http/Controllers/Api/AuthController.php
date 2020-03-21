<?php

namespace App\Http\Controllers\Api;

use App\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\Response;
//use App\Notifications\SignupActivate;

class AuthController extends Controller
{
    /**
     * [register description]
     * @param  Request $request [description]
     * @return [type]           [description]
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
          'name' => 'required|string|max:255',
          'email' => 'required|string|email|max:255|unique:users',
          'password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response(['error'=>$validator->errors()->all()], 422);
        }

        $request['password']=Hash::make($request['password']);
        //$request['activation_token']=str_random(60);
        $user = User::create($request->toArray());
        $user->sendEmailVerificationNotification();

       //$user->notify(new SignupActivate($user));

        $token = $user->createToken('Laravel Password Grant Client')->accessToken;
        $response = ['token' => $token];

        return response($response, 200);
    }

    /**
     * [login description]
     * @param  Request $request [description]
     * @return [type]           [description]
     */
    public function login(Request $request)
    {
      $validator = Validator::make($request->all(), [
        'email' => 'required|string|email',
        'password' => 'required|string|min:6',
      ]);

      if ($validator->fails()) {
          return response(['error'=>$validator->errors()->all()], 422);
      }

        $user = User::where('email', $request->email)->first();

        if ($user) {
            if (Hash::check($request->password, $user->password)) {
                $token = $user->createToken('Laravel Password Grant Client')->accessToken;
                $response = ['token' => $token];
                return response($response, 200);
            } else {
                $response = ['error' => "Password missmatch"];
                return response($response, 422);
            }
        } else {
            $response = ['error' => 'User does not exist'];
            return response($response, 422);
        }
    }

    /**
     * [logout description]
     * @param  Request $request [description]
     * @return [type]           [description]
     */
    public function logout(Request $request)
    {
        $token = $request->user()->token();
        $token->revoke();

        $response = ['message' => 'You have been succesfully logged out!'];
        return response($response, 200);
    }

    /**
     * Mark the authenticated user's email address as verified.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     *
     */
    public function verify(Request $request)
    {
        $validator = Validator::make($request->all(), [
          'id' => 'required',
          'hash' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response(['error'=>$validator->errors()->all()], 422);
        }

        if (! hash_equals((string) $request['id'], (string) $request->user()->getKey())) {
          $response = ['error' => 'We cant find a user with that e-mail address.'];
          return response($response, 404);
        }

        if (! hash_equals((string) $request['hash'], sha1($request->user()->getEmailForVerification()))) {
          $response = ['error' => 'This activation token is invalid'];
          return response($response, 404);
        }

        if ($request->user()->hasVerifiedEmail()) {
          $response = ['error' => 'User is already activated'];
          return response($response, 404);
        }

        if ($request->user()->markEmailAsVerified()) {
            event(new Verified($request->user()));
        }

        $response = ['message' => 'You have succesfully activated your account'];
        return response($response, 200);
    }

    /**
     * Resend the email verification notification.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function resend(Request $request)
    {
        if ($request->user()->hasVerifiedEmail()) {
            $response = ['error' => 'User is already activated'];
            return response($response, 404);
        }

        $request->user()->sendEmailVerificationNotification();

        $response = ['message' => 'We have e-mailed your new activation code'];
        return response($response);
    }

}

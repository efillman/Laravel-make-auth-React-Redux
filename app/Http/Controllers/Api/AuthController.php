<?php

namespace App\Http\Controllers\Api;

use App\User;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Controllers\Controller;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Auth\Events\Verified;
use Illuminate\Auth\Events\PasswordReset;

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
            return response(['error'=>$validator->errors()->all()], 400);
        }

        $request['password']=Hash::make($request['password']);
        $user = User::create($request->toArray());
        $user->sendEmailVerificationNotification();

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
            return response(['error'=>$validator->errors()->all()], 400);
        }

        $user = User::where('email', $request->email)->first();

        if ($user) {
            if (Hash::check($request->password, $user->password)) {
                $token = $user->createToken('Laravel Password Grant Client')->accessToken;
                $response = ['token' => $token];
                return response($response, 200);
            } else {
                $response = ['error' => "Password missmatch"];
                return response($response, 400);
            }
        } else {
            $response = ['error' => 'User does not exist'];
            return response($response, 400);
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
            return response(['error'=>$validator->errors()->all()], 400);
        }

        if (! hash_equals((string) $request['id'], (string) $request->user()->getKey())) {
            $response = ['error' => 'We cant find a user with that e-mail address.'];
            return response($response, 400);
        }

        if (! hash_equals((string) $request['hash'], sha1($request->user()->getEmailForVerification()))) {
            $response = ['error' => 'This activation token is invalid'];
            return response($response, 400);
        }

        if ($request->user()->hasVerifiedEmail()) {
            $response = ['error' => 'User is already activated'];
            return response($response, 400);
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
    public function resendVerify(Request $request)
    {
        if ($request->user()->hasVerifiedEmail()) {
            $response = ['error' => 'User is already activated'];
            return response($response, 400);
        }

        $request->user()->sendEmailVerificationNotification();

        $response = ['message' => 'A fresh verification link has been sent to your email address.'];
        return response($response, 200);
    }

    /**
     * Send a reset link to the given user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Http\JsonResponse
     */
    public function resetEmail(Request $request)
    {
        $validator = Validator::make($request->all(), [
          'email' => 'required|email'
        ]);

        if ($validator->fails()) {
            return response(['error'=>$validator->errors()->all()], 400);
        }

        // We will send the password reset link to this user. Once we have attempted
        // to send the link, we will examine the response then see the message we
        // need to show to the user. Finally, we'll send out a proper response.
        $response = $this->broker()->sendResetLink(
            $this->credentials($request)
        );

        $response == Password::RESET_LINK_SENT;

        if (!$response) {
            $response = ['error' => 'Invalid Email'];
            return response($response, 400);
        }

        if ($response) {
            $response = ['message' => 'We have e-mailed your reset code'];
            return response($response, 200);
        }
    }

    /**
     * Reset the given user's password.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Http\JsonResponse
     */
    public function reset(Request $request)
    {
        $validator = Validator::make($request->all(), [
          'token' => 'required',
          'email' => 'required|email',
          'password' => 'required|confirmed|min:8',
        ]);

        if ($validator->fails()) {
            return response(['error'=>$validator->errors()->all()], 400);
        }

        // Here we will attempt to reset the user's password. If it is successful we
        // will update the password on an actual user model and persist it to the
        // database. Otherwise we will parse the error and return the response.
        $response = $this->broker()->reset(
            $this->resetCredentials($request),
            function ($user, $password) {
                $this->resetPassword($user, $password);
            }
        );

        // If the password was successfully reset, we will redirect the user back to
        // the application's home authenticated view. If there is an error we can
        // redirect them back to where they came from with their error message.
        $response == Password::PASSWORD_RESET;

        if (!$response) {
            $response = ['error' => 'Invalid Email or Token'];
            return response($response, 400);
        }

        if ($response) {
            $user = User::where('email', $request['email'])->first();
            $token = $user->createToken('Laravel Password Grant Client')->accessToken;
            $response = ['token' => $token];
            return response($response, 200);
        }
    }

    /**
     * Get the password reset credentials from the request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    protected function resetCredentials(Request $request)
    {
        return $request->only(
            'email',
            'password',
            'password_confirmation',
            'token'
        );
    }

    /**
     * Reset the given user's password.
     *
     * @param  \Illuminate\Contracts\Auth\CanResetPassword  $user
     * @param  string  $password
     * @return void
     */
    protected function resetPassword($user, $password)
    {
        $this->setUserPassword($user, $password);

        $user->setRememberToken(Str::random(60));

        $user->save();

        event(new PasswordReset($user));
    }

    /**
     * Set the user's password.
     *
     * @param  \Illuminate\Contracts\Auth\CanResetPassword  $user
     * @param  string  $password
     * @return void
     */
    protected function setUserPassword($user, $password)
    {
        $user->password = Hash::make($password);
    }

    /**
     * Get the needed authentication credentials from the request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    protected function credentials(Request $request)
    {
        return $request->only('email');
    }

    /**
     * Get the broker to be used during password reset.
     *
     * @return \Illuminate\Contracts\Auth\PasswordBroker
     */
    public function broker()
    {
        return Password::broker();
    }
}

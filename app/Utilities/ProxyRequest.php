<?php

namespace App\Utilities;

class ProxyRequest
{
    public function grantPasswordToken(string $email, string $password)
    {
        $params = [
            'grant_type' => 'password',
            'username' => $email,
            'password' => $password,
        ];

        return $this->makePostRequest($params);
    }

    public function refreshAccessToken()
    {
        $refreshToken = request()->cookie('refresh_token');

        //abort_unless($refreshToken, 401, 'Your refresh token is expired.');
        if (!$refreshToken) {
          $response = ['error' => array('Your refresh token is expired.')];
          return response($response, 401);
        }

        $params = [
            'grant_type' => 'refresh_token',
            'refresh_token' => $refreshToken,
        ];

        return $this->makePostRequest($params);
    }

    protected function makePostRequest(array $params)
    {
        $params = array_merge([
            'client_id' => config('services.passport.password_client_id'),
            'client_secret' => config('services.passport.password_client_secret'),
            'scope' => '*',
        ], $params);

        //var_dump($params);
        $proxy = \Request::create('oauth/token', 'post', $params);
        $resp = json_decode(app()->handle($proxy)->getContent());
        //var_dump($resp);
        if (property_exists($resp, 'refresh_token')) {
          $this->setHttpOnlyCookie($resp->refresh_token);
        }
        return $resp;
    }

    protected function setHttpOnlyCookie(string $refreshToken)
    {
        cookie()->queue(
            'refresh_token',
            $refreshToken,
            14400, // 10 days
            null,
            null,
            false,
            true // httponly
        );
    }
}

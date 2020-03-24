<html lang="{{ app()->getLocale() }}">

<head>
    <title>{{ env("APP_NAME") }}</title>

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
    <script>
        window.Laravel = {!!json_encode([
                'csrfToken' => csrf_token(),
                'base_url' => env("BASE_URL"),
                'app_name' => env("APP_NAME"),
                'img_asset_path' => asset('img/')
            ]) !!
        };
    </script>
</head>

<body>
    <div id="app"></div>
    <script src="{{mix('js/app.js')}}"></script>
</body>

</html>

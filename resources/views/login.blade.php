<form method="post" action="{{ route('authlogin') }}">
    @csrf

    <label for="email">Email:</label>
    <input type="text" name="email">

    <label for="password">Password:</label>
    <input type="password" name="password">
    <button>Login</button>
</form>

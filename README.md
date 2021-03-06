
  <h1>Laravel make:auth React Redux</h1>
  <h1>Objectives:</h1>
  <ul>
    <li>Mimic all features of the Laravel make:auth scaffold using full REST and a React front end.</li>
  </ul>
  <h1>Measures of Effectiveness:</h1>
  <ul>
    <li>Acts and behaves like a fresh Laravel install having run make:auth and associated migrations but with React front end.</li>
    <li>Does not use session variable (other than Redux store).</li>
    <li>Survives Page Refresh</li>
    <li>Best Security Practices for Auth Token</li>
    <li>Uses Best Practices for Laravel</li>
    <li>Uses Best Practices for React</li>
  </ul>
  <h1>Software Stack:</h1>
  <h2>Back end:</h2>
  <ul>
    <li>Major Packages:</li>
    <li>MySQL</li>
    <li>Laravel 6.* LTS</li>
    <li>Laravel Passport</li>
    <li>Minor Packages:</li>
  </ul>
  <h2>Front end:</h2>
  <ul>
    <li>Major Packages:</li>
    <li>React</li>
    <li>React Router</li>
    <li>React Redux</li>
    <li>Minor Packages:</li>
    <li>React-Bootstrap</li>
  </ul>
  <h1>Installation Instructions:</h1>

  <ul>
    <li>clone repository</li>
<li>composer install</li>
<li>npm install</li>
<li>npm run dev</li>
<li>update Laravel security settings</li>
<li>update local /etc/hosts file</li>
<li>update Apache2 Virtual Hosts</li>
<li>examples in server_configs</li>
<li>generate SSL certs if wanted (https://devcenter.heroku.com/articles/ssl-certificate-self)</li>
<li>update Laravel .env file</li>
<li>ensure to update msql database info</li>
<li>generate Laravel app key</li>
<li>php artisan key:generate</li>
<li>link storage</li>
<li>php artisan storage:link</li>
<li>run migrations</li>
<li>php artisan migrate</li>
  </ul>
  <h1>Contributing:</h1>
  <ul>
    <li>TODO</li>
  </ul>
  <h1>References:</h1>
  <ul>
    <li>TODO</li>
  </ul>

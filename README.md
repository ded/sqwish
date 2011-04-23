Welcome to Sqwish
----------
a Node based CSS compiler. It works like this.

    require('sqwish').minify('body { color: red; }');
    // =>
    body{color:red}

CLI
---
Install it.

    $ npm install sqwish

Use it like this:

    sqwish css/styles.css -o css/styles.min.css


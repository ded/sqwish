Welcome to Sqwish
----------
A [Node](http://nodejs.org) based CSS Compressor. It works like this.

    require('sqwish').minify('body { color: #ff33cc; }');
    // =>
    body{color:#f3c}

CLI
---
Install it.

    $ npm install sqwish

Use it like this:

    sqwish css/styles.css -o css/prod-styles.min.css

Notes
-------
Sqwish does not attempt to fix invalid CSS, therefore, at minimum, your CSS should at least follow the basic rules:

    selectors[,more selectors] {
      property: value;
      another-property: another value;
    }

Strict Optimizations
----------
Aside from regular minification, in <code>--strict</code> mode Sqwish will combines duplicate selectors and merge duplicate properties.

    // before
    div {
      color: orange;
      background: red;
    }
    div {
      color: #ff33cc;
      margin: 0;
    }

    // after
    div{color:#f3c;background:red;margin:0}

This mode can be enabled as so:

    sqwish.minify(css, true);

on the command line

    sqwish styles.css --strict

Happy Sqwishing!
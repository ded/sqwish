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

Usage notes
-------
Sqwish does not attempt to fix invalid CSS, therefore, at minimum, your CSS should at least follow the basic rules:

    selectors[,more selectors] {
      property: value;
      another-property: another value;
    }

Optimizations
----------
Sqwish *does* attempt to remove duplicate rules and properties.

    // before
    div {
      color: orange;
      background: red;
    }
    div {
      color: red;
      margin: 0;
    }

    // after
    div{color:red;background:red;margin:0}
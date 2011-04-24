var fs = require('fs');

function uniq(ar) {
  var a = [], i, j;
  label:
  for (i = ar.length - 1; i >= 0; i--) {
    for (j = a.length - 1; j >= 0; j--) {
      if (a[j] == ar[i]) {
        continue label;
      }
    }
    a[a.length] = ar[i];
  }
  return a;
}

function sqwish(css) {
  // allow /*! bla */ style comments to retain copyrights etc.
  var comments = css.match(/\/\*![\s\S]+?\*\//g);


  css = css.trim() // give it a solid trimming to start

    // comments
    .replace(/\/\*[\s\S]+?\*\//g, '')

    // line breaks
    .replace(/\n/g, '')

    // space between selectors and declarations
    .replace(/([\w\*]*)\s+([{}])\s+([\w\*])/g, '$1$2$3')

    // space between declarations, properties and values
    .replace(/([:;,])\s+/g, '$1')

    // space between last declaration and end of rule
    // also remove trailing semi-colons on last declaration
    .replace(/[\s;]+(})/g, '$1')

    // this is important
    .replace(/\s+(!important)/g, '$1');


  // now some super fun funky shit where we remove duplicate declarations
  // into combined rules

  // store global dict of all rules
  var ruleList = {},
      rules = css.match(/([^{]+\{[^}]+\})+?/g);

  // lets find the dups
  rules.forEach(function (rule) {
    // break rule into selector|declaration parts
    var parts = rule.match(/([^{]+)\{([^}]+)/),
        selector = parts[1],
        declarations = parts[2];

    // start new list if it wasn't created already
    if (!ruleList[selector]) {
      ruleList[selector] = [];
    }

    declarations = declarations.split(';');
    // filter out duplicate properties
    ruleList[selector] = ruleList[selector].filter(function (decl) {
      var prop = decl.match(/[^:]+/)[0];
      // pre-existing properties are not wanted anymore
      return !declarations.some(function (dec) {
        return dec.match(new RegExp(prop + ':'));
      });
    });

    // latter takes presedence :)
    ruleList[selector] = ruleList[selector].concat(declarations);
    // still dups? just in case
    ruleList[selector] = uniq(ruleList[selector]);
  });

  // reset css because we're gonna recreate the whole shabang.
  css = '';
  for (var selector in ruleList) {
    var joinedRuleList = ruleList[selector].join(';');
    css += selector + '{' + (joinedRuleList).replace(/;$/, '') + '}';
  }

  // put back in copyrights
  if (comments) {
    comments = comments ? comments.join('\n') : '';
    css = comments + '\n' + css;
  }
  return css;
}
module.exports.exec = function (args) {
  var out;
  var read = args[0];
  if (out = args.indexOf('-o') != -1) {
    out = args[out + 1];
  } else {
    out = read.replace(/\.css$/, '.min.css');
  }
  console.log('compressing ' + read + ' to ' + out + '...');
  var data = fs.readFileSync(read, 'utf8');
  fs.writeFileSync(out, sqwish(data), 'utf8')
};
module.exports.minify = function (css) {
  return sqwish(css);
};
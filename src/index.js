/*!
  * Sqwish - a CSS Compressor
  * Copyright Dustin Diaz 2011
  * https://github.com/ded/sqwish
  * License MIT
  */

'use strict';

var fs           = require('fs'),
    RegexEscape  = /[\-\/\\\^$*+?.()|\[\]{}]/g,
    RuleRgx      = /([^{]+\{[^}]+\}+)+?/g,
    PropRgx      = /[^:]+/,
    RuleSplitRgx = /([^{]+)\{([^}]+\}*)/,
    CopyrightRgx = /copy.?right|[®©]|@preserve|@license|@cc_on/gi,
    CommentsRgx  = /\/\*![\s\S]+?\*\//g,
    Rgx1         = /\/\*[\s\S]+?\*\/|[\n\r]/g,
    Rgx2         = /\s*([:;,{}])\s*/g,
    Rgx3         = /\s+/g,
    Rgx4         = /;}/g,
    Rgx5         = /\s+(!important)/g,
    Rgx6         = /#([a-fA-F0-9])\1([a-fA-F0-9])\2([a-fA-F0-9])\3(?![a-fA-F0-9])/g,
    Rgx7         = /(Microsoft[^;}]*)#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])(?![a-fA-F0-9])/g,
    Rgx8         = /\b(\d+[a-z]{2}) \1 \1 \1/gi,
    Rgx9         = /\b(\d+[a-z]{2}) (\d+[a-z]{2}) \1 \2/gi,
    Rgx10        = /([\s|:])[0]+px/g,
    Regex        = [Rgx10, Rgx9, Rgx8, Rgx7, Rgx6, Rgx5, Rgx4, Rgx3, Rgx2, Rgx1],
    Replace      = ['$10', '$1 $2', '$1', '$1#$2$2$3$3$4$4', '#$1$2$3', '$1', '}', ' ', '$1', '']
;

function unique(ar) {
    var a = [], i = ar.length, j, k;
    label:
    while(i--) {
        j = k = a.length;
        while(j--) { if(a[j] === ar[i]) { continue label; } }
        a[k] = ar[i];
    }
    return a;
}

function strictCss(css) {
    var parts, declarations, selector,
        ruleList = {},
        rules = css.match(RuleRgx),
        i = 0,
        out = '',
        ruleLen = rules.length,
        func2 = function(input, dec) {
            var decLen, ele,
                arr = [],
                inLen = input.length
            ;

            while(inLen--) {
                ele = input[inLen];
                decLen = dec.length;
                while(decLen--) {
                    if(new RegExp('^' + ele.match(PropRgx)[0].replace(RegexEscape, '\\$&') + ':').test(dec[decLen])) {
                        break;
                    }
                }
                if(decLen < 0) {
                    arr.push(ele);
                }
            }

            arr.push.apply(arr, dec);
            return arr;
        }
    ;

    for(; i < ruleLen;) {
        parts = rules[i++].match(RuleSplitRgx);
        selector = parts[1];
        declarations = parts[2].slice(0, -1).split(';');
        ruleList[selector] = unique((ruleList[selector]) ? func2(ruleList[selector], declarations) : declarations);
    }

    rules = Object.keys(ruleList);
    ruleLen = rules.length;
    i = 0;

    for(; i < ruleLen; i++) {
        parts = rules[i];
        out += parts + '{' + ruleList[parts].join(';') + '}';
    }

    return out;
}

function sqwish(css, strict) {
    var comments = css.match(CommentsRgx),
        copyright = CopyrightRgx.test(comments),
        len = Regex.length;

    css = css.trim();

    while (len--) {
        css = css.replace(Regex[len], Replace[len]);
    }

    if(strict) {
        css = strictCss(css);
    }

    if (copyright && comments) {
        comments = comments ? comments.join('\n') : '';
        css = comments + '\n' + css;
    }

    return css;
}

module.exports.exec = function (args) {
    var out, data, read = args[0];

    if (out = args.indexOf('-o') !== -1) {
        out = args[out + 1];
    } else {
        out = read.replace(/\.css$/, '.min.css');
    }

    if (args.indexOf('-v') !== -1) {
        console.log('compressing ' + read + ' to ' + out + '...');
    }

    data = fs.readFileSync(read, 'utf8');

    fs.writeFileSync(out, sqwish(data, (~args.indexOf('--strict'))), 'utf8');
};

module.exports.minify = function (css, strict) {
    return sqwish(css, strict);
};
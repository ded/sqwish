var fs = require('fs');
function sqwish(css) {
  // allow /*! bla */ style comments to retain copyrights etc.
  var comments = css.match(/\/\*![\s\S]+?\*\//g);

            // comments
  css = css.replace(/\/\*[\s\S]+?\*\//g, '')
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
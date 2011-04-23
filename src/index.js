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
           .replace(/[\s;]+(})/g, '$1');

  comments = comments ? comments.join('\n') : '';
  css += comments + '\n' + css;
  return css;
}
module.exports.exec = function (args) {
  // coming soon...
  // var out;
  // if (out = args.indexOf('-o')) {
  //   console.log(args[out + 1]);
  // }
};
module.exports.minify = function (css) {
  return sqwish(css);
};
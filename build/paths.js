var path = require('path');

var appRoot = 'src/';

module.exports = {
  root: appRoot,
  source: appRoot + '**/*.js',
  styles: appRoot + '**/*.less',
  lessEntry: appRoot + 'primary-drag.less',
  output: 'dist/'
};

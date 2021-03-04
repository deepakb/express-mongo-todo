const commandLineArgs = require('command-line-args');

const optionDefinitions = [
  { name: 'verbose', alias: 'v', type: Boolean },
  { name: 'src', type: String, multiple: true, defaultOption: true },
  { name: 'timeout', alias: 't', type: Number },
];
const args = commandLineArgs(optionDefinitions);
const environment = args.src[0]
  ? args.src[0].toString().split('=')[1]
  : 'development';

module.exports = environment;

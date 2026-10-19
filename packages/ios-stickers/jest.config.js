const path = require('path');

const roots = ['__mocks__', 'src'];

module.exports = {
  ...require('../../jest.config.base.js'),
  rootDir: path.resolve(__dirname),
  displayName: require('./package').name,
  roots,
  setupFiles: ['<rootDir>/jest/setup.js'],
  clearMocks: true,
};

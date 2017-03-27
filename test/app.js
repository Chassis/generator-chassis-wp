'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

describe('generator-chassis-wp:app', function () {
  before(function () {
    return helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts({
        name: 'test'
      })
      .withArguments(['skip-vagrant'])
      .toPromise();
  });

  it('creates files', function () {
    assert.file([
      'test/config.local.yaml'
    ]);
  });
});

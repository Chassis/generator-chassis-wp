'use strict';
var Generator = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var slugify = require('underscore.string/slugify');
var fs = require('fs');

module.exports = Generator.extend({
  prompting: function () {
    this.log(yosay(
      'Welcome to the ' + chalk.red('generator-chassis-wp') + ' generator!'
    ));

    // Allow skipping vagrant with a flag.
    this.option('skip-vagrant', {
      type: Boolean,
      required: false,
      desc: 'Skip vagrant up after creation.'
    });

    // Allow just using our defaults with a flag.
    this.option('defaults', {
      type: Boolean,
      required: false,
      desc: 'Use all defaults for optional paramaters.'
    });

    var prompts = [{
      type: 'input',
      name: 'name',
      message: 'What is the name of your project?',
      default: this.appname
    }, {
      type: 'input',
      name: 'host',
      message: 'What url would you like to use?',
      when: ! this.options.defaults,
      default: function( p ) {
        return slugify( p.name ) + '.local';
      }.bind(this)
    },
    {
      type: 'list',
      name: 'phpVersion',
      message: 'What version of PHP would you like to run?',
      default: '7.1',
      store: true,
      when: ! this.options.defaults,
      choices: [
        '5.3',
        '5.4',
        '5.5',
        '5.6',
        '7.0',
        '7.1',
        '7.2'
      ]
    }, {
      type: 'list',
      name: 'multisite',
      message: 'Enable multisite?',
      default: 'No',
      store: true,
      when: ! this.options.defaults,
      choices: [{
        name:  'No',
        value: 'No',
      }, {
        name:  'Yes, with subfolders.',
        value: 'Yes',
      }, {
        name:  'Yes, with subdomains.',
        value: 'subdomains',
      }
      ]
    }, {
      type: 'checkbox',
      name: 'extensions',
      message: 'Which additional extensions would you like to include?',
      store: true,
      when: ! this.options.defaults,
      choices: [{
        name: 'Xdebug',
        value: 'chassis/Xdebug',
        checked: true,
      }, {
        name: 'phpcs',
        value: 'chassis/phpcs',
        checked: true,
      }, {
        name: 'phpini',
        value: 'chassis/phpini',
        checked: true,
      }, {
        name: 'yarn',
        value: 'chassis/yarn',
        checked: true,
      }, {
        name: 'MariaDB',
        value: 'chassis/MariaDB',
        checked: true,
      }, {
        name: 'nodejs',
        value: 'chassis/nodejs',
        checked: true,
      }, {
        name: 'Fish',
        value: 'chassis/Fish',
        checked: true,
      }, {
        name: 'Composer',
        value: 'chassis/Composer',
        checked: true,
      }, {
        name: 'Tester',
        value: 'chassis/Tester',
        checked: true,
      }, {
        name: 'MailHog',
        value: 'chassis/MailHog',
        checked: false,
      }, {
        name: 'SequelPro',
        value: 'chassis/SequelPro',
        checked: false,
      }, {
        name: 'Cavalcade',
        value: 'chassis/Cavalcade',
        checked: false,
      }, {
        name: 'Theme Review',
        value: 'chassis/ThemeReview',
        checked: false,
      }, {
        name: 'xhprof',
        value: 'chassis/xhprof',
        checked: false,
      }, {
        name: 'Debugging',
        value: 'chassis/Debugging',
        checked: false,
      }, {
        name: 'phpMyAdmin',
        value: 'chassis/phpMyAdmin',
        checked: false,
      }, {
        name: 'Query-Monitor',
        value: 'chassis/Query-Monitor',
        checked: false,
      }, {
        name: 'memcache',
        value: 'chassis/memcache',
        checked: false,
      }, {
        name: 'db-backup',
        value: 'chassis/db-backup',
        checked: false,
      }, {
        name: 'local-dev',
        value: 'chassis/local-dev',
        checked: false,
      }, {
        name: 'VIP-Classic',
        value: 'stuartshields/chassis-vip-classic',
        checked: false,
      }]
    }];

    return this.prompt(prompts).then(function (props) {
      props.safename = slugify( props.name );

      // If we're using our defaults, then set those.
      if ( this.options.defaults ) {

        props.host       = slugify( props.name ) + '.local';
        props.phpVersion = '7.1';
        props.multisite  = 'No';
        props.extensions = [];
      }

      this.props = props;
    }.bind(this));
  },

  writing: function () {

    // Grab our destination path folder.
    fs.lstat( this.destinationPath( this.props.safename ), function(err, stats) {

      // If its not an error, but it exists, flag that to the user.
      if ( ! err && stats.isDirectory() ) {
        this.log(
          'A folder named "' + this.props.safename + '" already exists. Please move or rename that folder and re-run the generator.'
        );
        process.exit();
      }
    }.bind(this));

    // Clone chassis from Github.
    this.spawnCommandSync('git', [ 'clone',
      'https://github.com/Chassis/Chassis', this.props.safename,
      '--depth', '1',
    ]);

    // Copy over our yaml config.
    this.fs.copyTpl(
      this.templatePath('_config.local.yaml'),
      this.destinationPath(this.props.safename + '/config.local.yaml'),
      {
        name:       this.props.name,
        host:       this.props.host,
        phpVersion: this.props.phpVersion,
        extensions: this.props.extensions
      }
    );
  },

  install: function () {

    // If we didn't flag to skip vagrant, then do a vagrant up.
    if ( ! this.options['skip-vagrant'] ) {
      this.spawnCommand('vagrant', ['up'], { cwd: this.props.safename } );
    }
  }
});

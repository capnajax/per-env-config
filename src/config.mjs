'use strict';

import Parser from 'args-and-envs';
import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
import _ from 'lodash';

class Config {
  
  #cachedSearches;
  #configs;
  #env;

  /**
   * @constructor
   * @param {object} options
   * @param {object|array} options.configs a list of config files to get the
   *  config details from. This checks the config files in order.
   * @param {string} [options.env] the name of the environment we're getting the
   *  config for. If this is provided, it'll check for an environment-specific
   *  config before it checks for a default config.
   */
  constructor(options) {
    if (_.isNil(options.configs)) {
      throw 'configs required';
    } else if (Array.isArray(options.configs)) {
      this.#configs = options.configs.reverse();
    } else {
      this.#configs = [options.configs];
    }

    this.#env = options.env;

    this.#cachedSearches = {};
  }

  static #fromArgsOptions(options) {
    options || ( options = {} );
    let argumentDefs = [{
      arg: options.configArg || ['--config', '-c'],
      env: options.configEnv || 'CONFIG_FILES',
      name: 'configFiles',
      required: true,
      type: 'list'      
    }, {
      arg: options.envArg || ['--env'],
      env: options.envEnv || 'CONFIG_ENV',
      name: 'configEnv',
      required: false
    }];
    let parserOptions = {
      global: null,
      handler: {
        configFiles: value => {
          let result = [];
          for (let v of value) {
            result.push.apply(result, v.split(path.delimiter));
          }
          return result;
        }
      },
      unknown: 'ignore',
    };
    let parser = new Parser(argumentDefs, parserOptions);
    if (parser.errors) {
      throw {message: "Invalid arguments", reason: parser.errors};
    } else {
      return parser.argv;
    }
  } 

  static #fromArgsErrors(fileErrors, parseErrors) {
    if (fileErrors.length || parseErrors.length) {
      let errorObj = {
        message: "Error loading config files"
      };
      if (fileErrors.length) {
        errorObj.fileErrors = fileErrors;
      }
      if (parseErrors.length) {
        errorObj.parseErrors = parseErrors;
      }
      throw errorObj;
    }
  }

  /**
   * @function fromArgs
   * Build a Config object from command line arguments and environment
   * environment variables. Loads config data from files asyncronously. If a 
   * file is specified in the command line but does not exist, it'll throw an
   * exception, unless `options.ignoreNonexistantFiles` is set.
   */
   static async fromArgs(options) {
    // first determine the config file path
    let argv = this.#fromArgsOptions();
    let configFilenames = argv.configFiles;

    let readFilePromises = [];

    let configs = [];
    let fileErrors = [];
    let parseErrors = [];

    for (let config of configFilenames) {
      let promise = fs.promises.readFile(config)
        .catch(reason => {
          if (!options || !options.ignoreNonexistantFiles) {
            fileErrors.push(reason);
          }
          return null;
        })
        .then(b => {
          if (b) {
            let s = b.toString();
            let c = YAML.parse(s);
            return c;
          } else {
            return null;
          }
        })
        .catch(reason => {
          parseErrors.push(reason);
        });
      readFilePromises.push(promise);
    }
    configs = (await Promise.allSettled(readFilePromises)).map(c=>c.value);
    configs = configs.filter(c => c); // remove any `null` values

    this.#fromArgsErrors(fileErrors, parseErrors);
    return new Config({configs, env: argv.configEnv});
  }

  /**
   * @function fromArgsSync
   * Build a Config object from command line arguments and environment
   * environment variables. Loads config data from files syncronously. If a 
   * file is specified in the command line but does not exist, it'll throw an
   * exception, unless `options.ignoreNonexistantFiles` is set.
   */
  static fromArgsSync(options) {
    // first determine the config file path
    let argv = this.#fromArgsOptions();
    let configFilenames = argv.configFiles;
    
    let configs = [];
    let fileErrors = [];
    let parseErrors = [];

    for (let config of configFilenames) {
      try {
        let b = fs.readFileSync(config);
        let s = b.toString();
        try {
          configs.push(YAML.parse(s));
        } catch(e) {
          parseErrors.push({file: config, reason: e});
        }
      } catch(e) {
        if (!options || !options.ignoreNonexistantFiles) {
          fileErrors.push({file: config, reason: e});
        }
      }
    }

    this.#fromArgsErrors(fileErrors, parseErrors);
    return new Config({configs, env: argv.configEnv});
  }

  /**
   * @method bind
   * Returns a shorthand method to config.config
   */
  bind() {
    return _.bind(this.config, this);
  }

  /**
   * @method config
   * Gets a config from path, or if it doesn't exist, returns a defaultValue
   * @param {string} path 
   * @param {*} defaultValue 
   * @returns {*}
   */
  config(path, defaultValue) {
    let result = defaultValue;
    if (this.#cachedSearches[path]) {
      return this.#cachedSearches[path]
    }
    search: {
      for (let config of this.#configs) {
        if (this.#env) {
          let envPath = _.get(
            _.find(
              _.get(config, 'environment'),
              {name: this.#env}),
            'config');
          if (envPath && _.has(envPath, path)) {
            result = _.get(envPath, path);
            break search;
          }
        }
        if (_.has(config.default, path)) {
          result = _.get(config.default, path);
          break search;
        }
      }
    }
    this.#cachedSearches[path] = result;
    return result;
  }

  get env() {
    return this.#env;
  }

  set env(newEnv) {
    this.#cachedSearches = {};
    this.#env = newEnv;
  }
}

export default Config;

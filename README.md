# per-env-config

Collects configs from multiple sources and handles overrides per environment.

This module was specifically written for Kubernetes apps:

* An app can be moved into different environments (for example DEV to PROD) simply by changing an environment variable.
* The config can be seemlessly split between ConfigMaps, static files,
and Secrets

## Installation

```sh
npm install --save per-env-config
```

## Usage

```javascript
import Config from 'per-env-config';

// non-blocking (async) form
const config = await Config.fromArgs(options);

// blocking (sync) form
const config = Config.fromArgsSync(options);

// from a constructor
// obj1, obj2 are already-parsed objects
const config = new Config({configs: [obj1, obj2], env: 'env1'});

// read a config
let configValue = config.config('path.to.config.item');

// create a shorthand to read a config
const c = config.bind();
let configValue = b('path.to.config.item');
```

Initialize the config object from a static initializer method, `Config.fromArgs` and `Config.fromArgsSync`. The former returns a promise that resolves when al the config files are opened and parsed, the latter is blocking function that does not return until all the config files are opened and parsed.

The synchronous method is only intended for use on startup.

### Options

| Name | Default | Description
| ---- | ------- | -----------
| `configArg` | `[ '--config', '-c' ]` | command line arguments to use to specify config files.
| `configEnv` | `'CONFIG_FILES'` | environment variable to check for config files
| `envArg` | `[ '--env' ]` | command line arguments to use to specify config environment variables
| `envEnv` | `'CONFIG_ENV'` | environment variable to check for config environment
| `ignoreNonexistantFiles` | `false` | Set this to prevent throwing an error if a config file doesn't exist

### Config file

```yaml
default:
  # config objects go here

environment:
- name: env1
  config: 
    # environment-specific names go here.
```

Config files have two sections -- `default` has the default set of configs, and `environment` has a list of environment-specific configs.

Config files are read in reverse order -- e.g. the last config file specific in the command line has the most priority, and of each file, the environment-specific config has a higher priority than the default config.

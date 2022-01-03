#!/usr/bin/env node

'use strict';

import Parser from 'args-and-envs';
import Config from '../src/config.mjs';
import _ from 'lodash';

async function main() {
  try {
    let parser = new Parser([{
      arg: ['--sync'],
      name: 'sync',
      type: 'boolean'
    }], {unknown: 'ignore'});

    const config = (parser.argv && parser.argv.sync) 
      ? Config.fromArgsSync()
      : await Config.fromArgs();

    let outputObject = {
      config1: {
        key1: config.config('config1.key1'),
        key2: config.config('config1.key2'),
        key3: config.config('config1.key3')
      },
      config2: {
        key1: config.config('config2.key1')
      },
      cached: {
        config1: {
          key1: config.config('config1.key1'),
          key2: config.config('config1.key2'),
          key3: config.config('config1.key3')
        }
      }
    }

    console.log(JSON.stringify(outputObject, null, 3));
    process.exit(0);
  } catch(reason) {
    console.log(reason);
    console.log(JSON.stringify(reason));
    process.exit(1);
  }
}
main();

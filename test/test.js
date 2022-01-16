'use strict';

import Config from '../src/config.mjs';
import fs from 'fs';
import TestBattery from 'test-battery';
import { spawn } from 'child_process';
import YAML from 'yaml';

describe('correct configs async', function() {

  it('single config file', function(done) {

    let battery = new TestBattery('single config file');

    new Promise((resolve, reject) => {
      let testSpawn = spawn('test/testImpl.js', [
        '--config=test/test1.yaml'
      ]);
      let data = '';
      testSpawn.stdout.on('data', chunk => {
        data += chunk.toString();
      });
      testSpawn.stderr.on('data', chunk => {
        console.error(chunk.toString());
      });
      testSpawn.on('close', code => {
        if (0 === code) {
          let dataObj = JSON.parse(data);
          battery.test('key1')
            .value(dataObj.config1.key1)
            .value('value1')
            .are.equal;
          battery.test('key2')
            .value(dataObj.config1.key2)
            .value('value2')
            .are.equal;
          battery.test('key3')
            .value(dataObj.config1.key3)
            .value('value3')
            .are.equal;
          resolve();
        } else {
          reject(`code ${code}`);
        }
      });
    })
    .then(() => {
      battery.done(done)
    })
    .catch((reason) => {
      battery.test('exception during test')
        .value(false).is.true;
      console.error(reason);
    })

  });

  it('two config files', function(done) {

    let battery = new TestBattery('single config file');

    new Promise((resolve, reject) => {
      let testSpawn = spawn('test/testImpl.js', [
        '--config=test/test1.yaml', '--config=test/test2.yaml'
      ]);
      let data = '';
      testSpawn.stdout.on('data', chunk => {
        data += chunk.toString();
      });
      testSpawn.stderr.on('data', chunk => {
        console.error(chunk.toString());
      });
      testSpawn.on('close', code => {
        if (0 === code) {
          let dataObj = JSON.parse(data);
          battery.test('key1')
            .value(dataObj.config1.key1)
            .value('value1')
            .are.equal;
          battery.test('key2')
            .value(dataObj.config1.key2)
            .value('value2')
            .are.equal;
          battery.test('test2-value3')
            .value(dataObj.config1.key3)
            .value('test2-value3')
            .are.equal;
          battery.test('config2-value1')
            .value(dataObj.config2.key1)
            .value('config2-value1')
            .are.equal;
          resolve();
        } else {
          reject(`code ${code}`);
        }
      });
    })
    .then(() => {
      battery.done(done)
    })
    .catch((reason) => {
      battery.test('exception during test')
        .value(false).is.true;
      console.error(reason);
    })
  });

  it('single config file with env', function(done) {

    let battery = new TestBattery('single config file');

    new Promise((resolve, reject) => {
      let testSpawn = spawn('test/testImpl.js', [
        '--config=test/test1.yaml', '--env=env1'
      ]);
      let data = '';
      testSpawn.stdout.on('data', chunk => {
        data += chunk.toString();
      });
      testSpawn.stderr.on('data', chunk => {
        console.error(chunk.toString());
      });
      testSpawn.on('close', code => {
        if (0 === code) {
          let dataObj = JSON.parse(data);
          battery.test('key1')
            .value(dataObj.config1.key1)
            .value('value1')
            .are.equal;
          battery.test('env1-value2')
            .value(dataObj.config1.key2)
            .value('env1-value2')
            .are.equal;
          battery.test('key3')
            .value(dataObj.config1.key3)
            .value('value3')
            .are.equal;
          resolve();
        } else {
          reject(`code ${code}`);
        }
      });
    })
    .then(() => {
      battery.done(done)
    })
    .catch((reason) => {
      battery.test('exception during test')
        .value(false).is.true;
      console.error(reason);
    })

  });

  it('two config files with env', function(done) {

    let battery = new TestBattery('single config file');

    new Promise((resolve, reject) => {
      let testSpawn = spawn('test/testImpl.js', [
        '--config=test/test1.yaml', '--config=test/test2.yaml', '--env=env1'
      ]);
      let data = '';
      testSpawn.stdout.on('data', chunk => {
        data += chunk.toString();
      });
      testSpawn.stderr.on('data', chunk => {
        console.error(chunk.toString());
      });
      testSpawn.on('close', code => {
        if (0 === code) {
          let dataObj = JSON.parse(data);
          battery.test('key1')
            .value(dataObj.config1.key1)
            .value('value1')
            .are.equal;
          battery.test('env1-value2-2')
            .value(dataObj.config1.key2)
            .value('env1-value2-2')
            .are.equal;
          battery.test('test2-value3')
            .value(dataObj.config1.key3)
            .value('test2-value3')
            .are.equal;
          battery.test('config2-value1')
            .value(dataObj.config2.key1)
            .value('config2-value1')
            .are.equal;
          resolve();
        } else {
          reject(`code ${code}`);
        }
      });
    })
    .then(() => {
      battery.done(done)
    })
    .catch((reason) => {
      battery.test('exception during test')
        .value(false).is.true;
      console.error(reason);
    })
  });

});

describe('correct configs sync', function() {

  it('single config file', function(done) {

    let battery = new TestBattery('single config file');

    new Promise((resolve, reject) => {
      let testSpawn = spawn('test/testImpl.js', [
        '--config=test/test1.yaml', '--sync=true'
      ]);
      let data = '';
      testSpawn.stdout.on('data', chunk => {
        data += chunk.toString();
      });
      testSpawn.stderr.on('data', chunk => {
        console.error(chunk.toString());
      });
      testSpawn.on('close', code => {
        if (0 === code) {
          let dataObj = JSON.parse(data);
          battery.test('key1')
            .value(dataObj.config1.key1)
            .value('value1')
            .are.equal;
          battery.test('key2')
            .value(dataObj.config1.key2)
            .value('value2')
            .are.equal;
          battery.test('key3')
            .value(dataObj.config1.key3)
            .value('value3')
            .are.equal;
          resolve();
        } else {
          reject(`code ${code}`);
        }
      });
    })
    .then(() => {
      battery.done(done)
    })
    .catch((reason) => {
      battery.test('exception during test')
        .value(false).is.true;
      console.error(reason);
    })

  });

  it('two config files', function(done) {

    let battery = new TestBattery('single config file');

    new Promise((resolve, reject) => {
      let testSpawn = spawn('test/testImpl.js', [
        '--config=test/test1.yaml', '--config=test/test2.yaml', '--sync=true'
      ]);
      let data = '';
      testSpawn.stdout.on('data', chunk => {
        data += chunk.toString();
      });
      testSpawn.stderr.on('data', chunk => {
        console.error(chunk.toString());
      });
      testSpawn.on('close', code => {
        if (0 === code) {
          let dataObj = JSON.parse(data);
          battery.test('key1')
            .value(dataObj.config1.key1)
            .value('value1')
            .are.equal;
          battery.test('key2')
            .value(dataObj.config1.key2)
            .value('value2')
            .are.equal;
          battery.test('test2-value3')
            .value(dataObj.config1.key3)
            .value('test2-value3')
            .are.equal;
          battery.test('config2-value1')
            .value(dataObj.config2.key1)
            .value('config2-value1')
            .are.equal;
          resolve();
        } else {
          reject(`code ${code}`);
        }
      });
    })
    .then(() => {
      battery.done(done)
    })
    .catch((reason) => {
      battery.test('exception during test')
        .value(false).is.true;
      console.error(reason);
    })
  });

  it('single config file with env', function(done) {

    let battery = new TestBattery('single config file');

    new Promise((resolve, reject) => {
      let testSpawn = spawn('test/testImpl.js', [
        '--config=test/test1.yaml', '--env=env1', '--sync=true'
      ]);
      let data = '';
      testSpawn.stdout.on('data', chunk => {
        data += chunk.toString();
      });
      testSpawn.stderr.on('data', chunk => {
        console.error(chunk.toString());
      });
      testSpawn.on('close', code => {
        if (0 === code) {
          let dataObj = JSON.parse(data);
          battery.test('key1')
            .value(dataObj.config1.key1)
            .value('value1')
            .are.equal;
          battery.test('env1-value2')
            .value(dataObj.config1.key2)
            .value('env1-value2')
            .are.equal;
          battery.test('key3')
            .value(dataObj.config1.key3)
            .value('value3')
            .are.equal;
          resolve();
        } else {
          reject(`code ${code}`);
        }
      });
    })
    .then(() => {
      battery.done(done)
    })
    .catch((reason) => {
      battery.test('exception during test')
        .value(false).is.true;
      console.error(reason);
    })

  });

  it('two config files with env', function(done) {

    let battery = new TestBattery('single config file');

    new Promise((resolve, reject) => {
      let testSpawn = spawn('test/testImpl.js', [
        '--config=test/test1.yaml', '--config=test/test2.yaml', '--env=env1',
        '--sync=true'
      ]);
      let data = '';
      testSpawn.stdout.on('data', chunk => {
        data += chunk.toString();
      });
      testSpawn.stderr.on('data', chunk => {
        console.error(chunk.toString());
      });
      testSpawn.on('close', code => {
        if (0 === code) {
          let dataObj = JSON.parse(data);
          battery.test('key1')
            .value(dataObj.config1.key1)
            .value('value1')
            .are.equal;
          battery.test('env1-value2-2')
            .value(dataObj.config1.key2)
            .value('env1-value2-2')
            .are.equal;
          battery.test('test2-value3')
            .value(dataObj.config1.key3)
            .value('test2-value3')
            .are.equal;
          battery.test('config2-value1')
            .value(dataObj.config2.key1)
            .value('config2-value1')
            .are.equal;
          resolve();
        } else {
          reject(`code ${code}`);
        }
      });
    })
    .then(() => {
      battery.done(done)
    })
    .catch((reason) => {
      battery.test('exception during test')
        .value(false).is.true;
      console.error(reason);
    })
  });

  it('two config files with env combined', function(done) {

    let battery = new TestBattery('single config file');

    new Promise((resolve, reject) => {
      let testSpawn = spawn('test/testImpl.js', [
        '--config=test/test1.yaml:test/test2.yaml', '--env=env1',
        '--sync=true'
      ]);
      let data = '';
      testSpawn.stdout.on('data', chunk => {
        data += chunk.toString();
      });
      testSpawn.stderr.on('data', chunk => {
        console.error(chunk.toString());
      });
      testSpawn.on('close', code => {
        if (0 === code) {
          let dataObj = JSON.parse(data);
          battery.test('key1')
            .value(dataObj.config1.key1)
            .value('value1')
            .are.equal;
          battery.test('env1-value2-2')
            .value(dataObj.config1.key2)
            .value('env1-value2-2')
            .are.equal;
          battery.test('test2-value3')
            .value(dataObj.config1.key3)
            .value('test2-value3')
            .are.equal;
          battery.test('config2-value1')
            .value(dataObj.config2.key1)
            .value('config2-value1')
            .are.equal;
          resolve();
        } else {
          reject(`code ${code}`);
        }
      });
    })
    .then(() => {
      battery.done(done)
    })
    .catch((reason) => {
      battery.test('exception during test')
        .value(false).is.true;
      console.error(reason);
    })
  });

});

describe('constructor and bind', function() {

  it('bound obj', function() {
    let battery = new TestBattery('bound obj');
    let configs = ['test/test1.yaml','test/test2.yaml'].map(f => {
      return YAML.parse(fs.readFileSync(f).toString())
    });
    let config = new Config({
      configs
    });
    let c = config.bind();
    battery.test('bound obj')
      .value(c('config2.key1'))
      .value('config2-value1')
      .are.equal;
  });

});

#! /usr/bin/env node
'use strict';
const { writeFile, mkdir } = require('fs');
const path = require('path');
const faker = require('faker');
const yargs = require('yargs');

yargs.array('location');
Object.keys(faker).forEach(key => {
  yargs.array(key);
});

const argv = yargs.argv;
const count = isNaN(argv.count) ? 1 : argv.count;
const useData = argv.data === 'false' ? false : true;
let data = count > 1 ? [] : undefined;
const fileName = argv.location ? `${argv.location.pop()}.json` : 'testData.json';
const filePath = argv.location ? path.join(...argv.location) : '.';

console.log('TCL: filePath', filePath);

mkdir(filePath, { recursive: true }, err => {
  if (err) {
    throw err;
  }

  for (let i = 0; i < count; i++) {
    const d = {};
    Object.keys(argv).forEach(key => {
      if (Array.isArray(argv[key]) && key !== '_') {
        argv[key].forEach(k => {
          if (faker[key] && typeof faker[key][k] === 'function') {
            d[key] = d[key] == null ? {} : d[key];
            d[key][k] = faker[key][k]();
          }
        });
        if (Object.keys(d).length) {
          if (Array.isArray(data)) {
            data.push(d);
          } else {
            data = d;
          }
        }
      }
    });
  }
  
  const jsonData = !useData ? JSON.stringify(data) : JSON.stringify({data});

  writeFile(`${filePath}/${fileName}`, jsonData, err => {
    if (err) {
      throw err;
    }
  });
});

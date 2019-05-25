# json-faker

[![Build Status](https://travis-ci.org/mikeebowen/json-faker.svg?branch=master)](https://travis-ci.org/mikeebowen/json-faker)
[![Coverage Status](https://coveralls.io/repos/github/mikeebowen/json-faker/badge.svg)](https://coveralls.io/github/mikeebowen/json-faker)
[![Known Vulnerabilities](https://snyk.io/test/github/mikeebowen/json-faker/badge.svg?targetFile=package.json)](https://snyk.io/test/github/mikeebowen/json-faker?targetFile=package.json)

----------
A wrapper around [faker.js](https://www.npmjs.com/package/faker) that can be used as a CLI or programmatically to create large amounts of test data. You create an object with the structure you want you data to take and then add meta data to determine how many you want created.

## Getting Started

##### For CLI 
`npm i -g json-faker`
##### For programmatic use 
`npm i -D json-faker`

##### Warning
json-faker works and is tested with node versions 6 - 11. Node 12 however will throw errors, because of worker_threads. We're currently working to resolve this issue.

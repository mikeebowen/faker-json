# faker-json

[![Build Status](https://travis-ci.org/mikeebowen/faker-json.svg?branch=master)](https://travis-ci.org/mikeebowen/faker-json)
[![Coverage Status](https://coveralls.io/repos/github/mikeebowen/faker-json/badge.svg?branch=master)](https://coveralls.io/github/mikeebowen/faker-json?branch=master)
[![Known Vulnerabilities](https://snyk.io//test/github/mikeebowen/faker-json/badge.svg?targetFile=package.json)](https://snyk.io//test/github/mikeebowen/faker-json?targetFile=package.json)

----------
A wrapper around [faker.js](https://www.npmjs.com/package/faker) that can be used as a CLI or programmatically to create large amounts of test data. You create an object with the structure you want you data to take and then add meta data to determine how many you want created.

## Getting Started

##### For CLI 
`npm i -g faker-json`
##### For programmatic use 
`npm i -D faker-json`

##### Warning
faker-json works and is tested with node versions 6 - 11. Node 12 however will throw errors, because of worker_threads. We're currently working to resolve this issue.

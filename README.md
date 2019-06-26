# faker-json

[![Build Status](https://travis-ci.org/mikeebowen/faker-json.svg?branch=master)](https://travis-ci.org/mikeebowen/faker-json)
[![Coverage Status](https://coveralls.io/repos/github/mikeebowen/faker-json/badge.svg?branch=master)](https://coveralls.io/github/mikeebowen/faker-json?branch=master)
[![Known Vulnerabilities](https://snyk.io//test/github/mikeebowen/faker-json/badge.svg?targetFile=package.json)](https://snyk.io//test/github/mikeebowen/faker-json?targetFile=package.json)

----------
A wrapper around [faker.js](https://www.npmjs.com/package/faker) that can be used as a CLI or programmatically to create large amounts of test data. Create an object with the structure you want you data to take and then add meta data to determine how many you want created.

## Getting Started

#### For CLI
`npm i -g faker-json`
#### For programmatic use
`npm i -D faker-json`

### Warning
faker-json works and is tested with node versions 6 - 11. Node 12 however will throw errors, because of worker_threads. We're currently working to resolve this issue.

### faker-json schema object
To create test data create an object with the data and keys you want. For the CLI create a json file with the random values and keys you want, plus the faker-json meta data. For programmatic use, pass an object to faker-json. The CLI will create a json file, programmatic use returns an object, the keys are the same in both cases.

The meta data options for faker-json are:

| Key | Description  |
| ----- | ---- |
| __out | Where the file will be created if you're using the CLI. This is relative to where faker-json. This can only be included in the root object and only one can be included. If not included a file named jfTestData-[guid] will be created|
| __useValue | Use this to create an array for the root element |
| __min, __max | The minimum and maximum number of elements to create. This key will cause the output to be an array instead of an object. If only one is included, exactly that number of elements will be created. If neither are included an object matching your schema will created instead of an array. |

Random data is created using the [faker.js api](https://www.npmjs.com/package/faker#api). For these examples, if you're using the CLI, create a json file with these values, if you're using faker-json programmatically, pass a JavaScript object with these same values. Any value can be passed, but anything that isn't recognized by faker.js will just have it's value added.

This will return or create a single object with a data property and a single object with a type  of "user" and a data object that has a random first name and last name in a file `data/test-data.json`.
```
{
  "__out": "data/test-data.json",
  "type": "user",
  "data": {
    "firstName": "{{name.firstName}}",
    "lastName: "{{name.lastName}}
  }
}
```

Passing `__min` or `__max` or both will create an array, so this will return an object with a type of "user" and "data" will be an array of between 10 and 20 users.

```
{
  "__out": "data/test-data.json",
  "type": "user",
  "data": {
    "__min": 10,
    "__max": 20,
    "firstName": "{{name.firstName}}",
    "lastName: "{{name.lastName}}
  }
}
```

Nested objects are also supported. This will return an object with a "type" of "user" and "data" will be an array of 10-20 users, and each user will have an array of exactly 10 friends

```
{
  "__out": "data/test-data.json",
  "type": "user",
  "data": {
    "__min": 10,
    "__max": 20,
    "firstName": "{{name.firstName}}",
    "lastName: "{{name.lastName}},
    "friends": {
      "__min": 10,
      "firstName": "{{name.firstName}},
      "lastName": "{{name.lastName}}
    }
  }
}
```

Adding `__min` or `__max` to any object in the schema will cause an array to be created. If you pass an actual array, that array will be recreated in the created object. In this example all users will have the same array of `['baseball', undefined, null, 10]` for the key interests.

```
{
  "__out": "data/test-data.json",
  "type": "user",
  "data": {
    "__min": 10,
    "__max": 20,
    "firstName": "{{name.firstName}}",
    "lastName: "{{name.lastName}},
    "friends": {
      "__min": 10,
      "firstName": "{{name.firstName}},
      "lastName": "{{name.lastName}}
    },
    "interests": [
      'baseball',
      undefined,
      null,
      10
    ]
  }
}
```

if you want the root element to be an array instead of an object use the `__useValue` key on the root of the element. This is only needed if you want your root element to be an array, otherwise you only need the `__min` and `__max` options. This example will create an array of users with no root object.

```
{
  "__out": "data/test-data.json",
  "__min": 10,
  "__max": 20,
  "__useValue": {
    "firstName": "{{name.firstName}}",
    "lastName: "{{name.lastName}},
    "friends": {
      "__min": 10,
      "firstName": "{{name.firstName}},
      "lastName": "{{name.lastName}}
    },
    "interests": [
      'baseball',
      undefined,
      null,
      10
    ]
  }
}
```

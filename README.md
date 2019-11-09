# faker-json

Create JSON files or JavaScript Objects with vast amounts of random test data with unique IDs based on your schema.

faker-json creates a JSON file when used from the CLI or a JavaScript Object when used programmatically. the file or Object is based on a user provided schema and populated with data from [faker.js](https://www.npmjs.com/package/faker). faker-json also provides the option of adding a unique IDs so that a JSON file created with the faker-json CLI can be used as a database for [JSON Server](https://www.npmjs.com/package/json-server)

---------

[![Build Status](https://travis-ci.org/mikeebowen/faker-json.svg?branch=master)](https://travis-ci.org/mikeebowen/faker-json) [![Coverage Status](https://coveralls.io/repos/github/mikeebowen/faker-json/badge.svg?branch=master)](https://coveralls.io/github/mikeebowen/faker-json?branch=master) [![Known Vulnerabilities](https://snyk.io//test/github/mikeebowen/faker-json/badge.svg?targetFile=package.json)](https://snyk.io//test/github/mikeebowen/faker-json?targetFile=package.json)

- [Getting Started](#getting-started)
  - [For CLI](#for-cli)
  - [For Programmatic Use](#for-programmatic-use)
- [faker-json Schema Object](#faker-json-schema-object)
  - [faker-json Options](#faker-json-meta-data)
  - [The `__out` Key](#the-__out-key)

---------

## Getting Started

### For CLI

`npm i -g faker-json`

### For programmatic use

`npm i -D faker-json`

## faker-json Schema Object

The faker-json schema object describes the data you want to create, how many instances you want created, whether you want a unique ID, and for the CLI where to place the file. 

To generate a file with the CLI make a JSON file of your schema or a JavaScript file that exports the schema. For programmatic use pass an object with your desired schema and faker-json will return a JavaScript Object described by the schema.

### faker-json Options

None of the faker-json options are required. If no options are provided json-faker will return a single object with the random data you describe.

The options for faker-json are:

| Key | Description  |
| ----- | ---- |
| __out | Where the file will be created if you're using the CLI. |
| __id | Set to `true` to add a unique id |
| __useValue | Use this to create an array for the root element |
| __min, __max | The minimum and maximum number of elements to create. This key will cause the output to be an array instead of an object. If only one is included, exactly that number of elements will be created. If neither are included an object matching your schema will created instead of an array. |

#### The `__out` Key

This is relative to where faker-json. This can only be included in the root object and only one can be included. If not included a file named jfTestData-[guid] will be created

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

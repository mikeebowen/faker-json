# faker-json

Create JSON files or or store data in memory with vast amounts of random, realistic test data with unique IDs based on your schema. Perfect for development when you want to test with a large amount of data with a realistic variation in values.

faker-json creates a JSON file when used from the CLI or an in memory JavaScript Object when used programmatically. the file or Object is based on a user provided schema and populated with data from [faker.js](https://www.npmjs.com/package/faker).

---------

[![Build Status](https://travis-ci.org/mikeebowen/faker-json.svg?branch=master)](https://travis-ci.org/mikeebowen/faker-json) [![Coverage Status](https://coveralls.io/repos/github/mikeebowen/faker-json/badge.svg?branch=master)](https://coveralls.io/github/mikeebowen/faker-json?branch=master) [![Known Vulnerabilities](https://snyk.io//test/github/mikeebowen/faker-json/badge.svg?targetFile=package.json)](https://snyk.io//test/github/mikeebowen/faker-json?targetFile=package.json)

- [Getting Started](#getting-started)
  - [For CLI](#for-cli)
  - [For Programmatic Use](#for-programmatic-use)
- [faker-json Options](#faker-json-meta-data)
  - [The `__out` Key](#the-__out-key)
  - [The `__id` Key](#th-__id-key)
  - [The `__useVal` Key](#the-__useVal-key)
  - [The `__min` and `__max` Keys](#the-__min-and-__max-keys)
- [Creating Data](#creating-data)
  - [Creating Data from JSON](#creating-data-from-json)
    - [`number` and `boolean` in JSON](#number-and-boolean-in-json)
- [Creating Data with JavaScript](#creating-data-with-javascript)

---------

## Getting Started

### For CLI

`npm install -g faker-json`

Then from the terminal call `faker-json --file ./[faker-json_Schema_file_path]` where `[faker-json_Schema_file_path]` is the path to a JSON file containing your faker-json schema or a JavaScript file that exports an object representing your faker-json schema.

### For programmatic use

`npm install --save-dev faker-json`

Once faker-json is installed in your project, to create your fake data, require `faker-json` and then call it with an object representing a faker-json schema.

```javascript
const fakerJson = require('faker-json');

const data = fakerJson({/**faker-json options**/});

// Do something with data
```

## faker-json Options

To produce fake data, create an object that describes the fake data you want with any faker-json options you need. Any keys on the object that do not start with `__` will be analyzed and added to the data produced. How values are analyzed is described below. 

The faker-json options determine how many instances to create, whether you want a unique ID, and for the CLI where to place the file.

To generate a file with the CLI make a JSON file with your options and desired data or a JavaScript file that exports them. For programmatic use pass an object with your described data and faker-json will return a JavaScript Object or Array containing the data described.

None of the faker-json options are required. If no options are provided json-faker will return a single object with the random data you describe.

The options for faker-json are:

| Key | Description  |
| ----- | ---- |
| __out | Where the file will be created if you're using the CLI. |
| __id | Set to `true` to add a unique id |
| __useVal | Use this to create an array of random simple types instead of objects |
| __min, __max | The minimum and maximum number of elements to create. |

### The `__out` Key

When using the cli, this is where the file will be created. It is relative to the directory where faker-json is called. This can only be included in the root object and only one can be included. `__out` keys not in the root will be ignored. If not included a file named `jfTestData-[guid]` will be created in the same directory where faker-json is called.

### The `__id` Key

If you want a single object or an array of objects in your schema to have a unique id then add `__id: true`, to your schema. This will add a unique incremental ID to each object in an array and all corresponding arrays in subsequent instances of the same type.

The IDs are unique only to their type, so for example in the data below, there is an array of users who each have an array of posts. The IDs of the users and posts are unique among the users and among the posts, but there is a user and a post who both had ID 1 and ID 2, but within users and posts, ID 1 and ID 2 are unique.

```json
{
  "type": "user",
  "data": [
    {
      "id": 1,
      "name": {
        "first": "Christian",
        "last": "Yelich"
      },
      "posts": [
        {
          "id": 1,
          "title:": "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
          "content": "Sed ut perspiciatis unde omnis iste natus..."
        },
        {
          "id": 2,
          "title:": "At vero eos et accusamus",
          "content": "Ut enim ad minim veniam..."
        }
      ]
    },
    {
      "id": 2,
      "name": {
        "first": "Mike",
        "last": "Trout"
      },
      "posts": [
        {
          "id": 3,
          "title:": "Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi",
          "content": "Architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam..."
        },
        {
          "id": 4,
          "title:": "Voluptatem quia voluptas sit",
          "content": "Aspernatur aut odit aut fugit, sed quia consequuntur magni dolores..."
        }
      ]
    }
  ]
}
```

### The `__useVal` Key

When the `__min` or `__max` keys are included, the default is for faker-json to use the meta-data and values provided to make an array of objects with fake data. So for example the following schema will produce an array of two objects that each have `item` and `price` keys.

```json
{
  "__min": 2,
  "item": "{{commerce.productName}}",
  "price": "{{commerce.price}}"
}
```

The data created will look something like this:

```json
[
  {
    "item": "Fantastic Soft Cheese",
    "price": "435.00"
  },
  {
    "item": "Intelligent Wooden Gloves",
    "price": "141.00"
  }
]
```

If however you want an array of random data not in an object then use the `__useVal` key. The schema below will create a list of exactly two random city names:

```json
{
  "__min": 2,
  "__useVal": "{{address.city}}
}
```

The data this produces will look similar to this:

```json
[
  "Port Jamie",
  "South Carrie"
]
```

### The `__min` and `__max` Keys

 If either the `__min` or `__max` key or both, are included faker-json will create an array of objects (or simple types if `__useVal` is included) from the keys not included in the faker-json meta data i.e. every key except `__out`, `__id`, `__useVal`, `__min`, and `__max`.
 
 If `__min` or `__max` is included, but not the other then exactly that number of elements will be created.

 If neither `__min` nor `__max` are included a single object matching your schema will created instead of an array.

## Creating Data

When creating data from a JSON file, Values can be of type `number`, `boolean`, `null`, `string`, `object`, or `array`.

With a JavaScript file that exports an object or when used programmatically values can also be of type `undefined`, `symbol`, or `function`. Note, if the value is a function the value will not be assigned to the function, instead that function will be called and the return value will be the value of the field.

`bigint` is not yet supported but it's coming soon.

### Creating Data from JSON

Data can be created with the cli by simply passing a json object.

```shell
faker-json --file ./myFakerObject.json
```

Different data types are handled differently.

### `number` and `boolean` in JSON

If you want a random number or boolean value, use the faker.js api to create them. The following will create an array with two objects each containing a bool key with a random boolean value and a num key with a random integer. 

Note that the boolean and number returned will both be strings. If you want actual random boolean or integer values you will need to [create data with JavaScript instead of JSON](#creating-data-with-javascript)

```json
{
  "__min": 2,
  "bool": "{{random.boolean}}",
  "num": "{{random.number}}"
}
```

Returns random data similar to this. 

```json
[
  {
    "bool": "true",
    "num": "71772"
  },
  {
    "bool": "false",
    "num": "43696"
  }
]
```

## Creating Data with JavaScript

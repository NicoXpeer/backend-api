# Ipsum API

[Apollo server](https://www.apollographql.com/docs/) with a mongoDB using [mongoose](https://mongoosejs.com/) as ORM

## Setup

```bash
$ npm install
```

[MongoDB Community](https://docs.mongodb.com/manual/administration/install-community/) installed or a [cloud based solution](https://www.mongodb.com/cloud) are needed.
[MongoDB Compass](https://www.mongodb.com/try/download/compass) useful for inspect the schema.

## Usage

There are 2 environments at the moment:

- `development`
- `testing`

For development environment

```bash
$ npm run dev
```

For testing environment

```bash
$ npm run testing
```

Config's files are located in **/src/config/** with the token config and db url.

## Test

To run the all the test

```bash
$ npm run test
```

In a near future will be scripts just to run specific test suites.

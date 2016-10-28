## TC API

## Requirements
* node v6 (https://nodejs.org)
* mongoDB v3.2 (https://www.mongodb.com/)

## Configuration

Configuration files are located under `config` dir.  
See Guild https://github.com/lorenwest/node-config/wiki/Configuration-Files

|Name|Description|
|----|-----------|
|`PORT`| The port to listen|
|`MONGODB_URL`| The mongodb url|
|`VERBOSE_LOGGING`| The flag if enable debug information|


## Install dependencies
`npm i`

## Running

|`npm run <script>`|Description|
|------------------|-----------|
|`start`|Serves the app in prod mode.|
|`dev`|Same as `npm start`, but enables nodemon for the server as well.|
|`lint`|Lint all `.js` files.|
|`lint:fix`|Lint and fix all `.js` files. [Read more on this](http://eslint.org/docs/user-guide/command-line-interface.html#fix).|

## Restore data
Run `npm run restore` to load all challenges from `data` directory.

## dump data
Run `npm run dump` to dump all challenges to `data` directory.
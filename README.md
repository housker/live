# Zt

Live time series data. Deployed to [Heroku](https://zlyt.herokuapp.com/).

## Built With

* [Angular](https://angular.io/) version 7.3.2 - front-end framework
* [Node.js](https://nodejs.org/en/) version 8.11.2 - Server
* [Socket.io](https://socket.io/) version 8.11.2 - Bi-directional communication
* [Cron](https://www.npmjs.com/package/cron) - Scheduling

## Development server

Create a .env file and add the following variables:
```
PORT=###
MONGODB_URI=###
DB_NAME=###
```

Run `npm install` and `NODE_ENV=dev npm run dev-start` for a dev server. Navigate to localhost at port specified in .env. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Author

**Adelle Housker** - [housker](https://github.com/housker)

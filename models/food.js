const axios = require('axios');
const {FDC_API_KEY} = require('../config')
//or put in another js file if running in repl?
//get key env vars https://nodejs.dev/learn/how-to-read-environment-variables-from-nodejs



//frontend makes call to food.js
//food js make api request to fdc-api
//food.js returns list of foods in better formatting


//node -i -e "$(< food.js)"
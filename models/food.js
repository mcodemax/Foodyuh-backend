const axios = require('axios');

const  {SECRET_API_KEY} = require('../secret'); //del later when deploying

const {FDC_API_KEY} = require('../config'); //use this instead of SECRET_API_KEY when deploying
const FDC_BASE_URL = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=`
//or put in another js file if running in repl?
//get key env vars https://nodejs.dev/learn/how-to-read-environment-variables-from-nodejs



//frontend makes call to food.js
//food js make api request to fdc-api
//food.js returns list of foods in better formatting

//.then(e => console.log(e));

//list 8 nutrients

//in a query param replace spaces with %20

//play with FDC API https://app.swaggerhub.com/apis/fdcnal/food-data_central_api/1.0.0#/FDC/postFoodsSearch
async function name1(food) {
    const query = {
        "query": `${food}`,
        "pageSize": 25,
        "pageNumber": 1,
        "sortBy": "dataType.keyword",
        "sortOrder": "asc"
    }
    // const response = await axios.post(`${FDC_BASE_URL}${FDC_BASE_URL}`, query);

    // return response.data;
    //https://axios-http.com/docs/post_example

    console.log('url', `${FDC_BASE_URL}${FDC_BASE_URL}`);

    axios.post(`${FDC_BASE_URL}${SECRET_API_KEY}`, query)
        .then((response) => {
         console.log(response.data);
        }).catch( error => {
            if( error.response ){
                console.log(error.response.data); // => the response payload 
            }
        });
    
}

//node -i -e "$(< food.js)"

//cache requests for food possibly, in client memory to avoid extra api calls
//maybe use library that integrates with axios, so if make same reqeust, you can cache the results 
function dummy(){
    const foodQueryObj = {
        "query": "tomato", //replace tomato with fod search query
        "pageSize": 25,
        "pageNumber": 1,
        "sortBy": "dataType.keyword",
        "sortOrder": "asc"
    }


    //get 7 nutrients to list, part of the "foodNutrients" array from response.
    //prob loop thru these in some seperate function and eventually return it to the UI
    /*

    // Check for the keys
            output1 = 'name' in exampleObj;

    {//cals
        "nutrientId": 1008,
        "nutrientName": "Energy",
        "unitName": "KCAL",
        "value": "200",
        "percentDailyValue": 10
    },
    {//total fats
          "nutrientId": 1004,
          "nutrientName": "Total lipid (fat)",
          "unitName": "G",
          "value": 30.8,
          "percentDailyValue": 0
    },
    {//prot
          "nutrientId": 1003,
          "nutrientName": "Protein",
          "unitName": "G",
          "value": 23.1,
          "percentDailyValue": 0
    },
    {
          "nutrientId": 1087,
          "nutrientName": "Calcium, Ca",
          "unitName": "MG"
          "value": 154,
          "percentDailyValue": 0
    },
    {
          "nutrientId": 1162,
          "nutrientName": "Vitamin C, total ascorbic acid",
          "unitName": "MG",
          "value": 0
          "percentDailyValue": 0
    },
    {
          "nutrientId": 1079,
          "nutrientName": "Fiber, total dietary",
          "unitName": "G",
          "value": 0,
          "percentDailyValue": 0
    },
    {
          "nutrientId": 1005,
          "nutrientName": "Carbohydrate, by difference",
          "unitName": "G",
          "value": 0,
          "percentDailyValue": 0
    }

    */
}
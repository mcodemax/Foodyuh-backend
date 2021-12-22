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

//in a query param replace spaces with %20

//play with FDC API https://app.swaggerhub.com/apis/fdcnal/food-data_central_api/1.0.0#/FDC/postFoodsSearch


/** Search for foods then return then in a more readable format
 * most likely better to implement in UI.
 * 
 * For backend:
 *  -In UI client calls searchFdcApi
 *  -another f() calls /v1/food/{fdcId} and only adds the {fdcId} to the plate
 *  -then when the UI calls the plate model, multiple fdc api calls can be made,
 *  -populate the UI, and the UI can do all the logic to add up the nutrients.
 * 
 *  ^For above possibly have a picture link stored in  above plate's table schema;
 *      -so another API call can be made to  pexels
 */
async function searchFdcApi(foodQuery) {
    const query = {
        "query": `${foodQuery}`,
        "pageSize": 25,
        "pageNumber": 1,
        "sortBy": "dataType.keyword",
        "sortOrder": "asc"
    }
    const nutrientIdsArr = [1008, 1004, 1003, 1087, 1162, 1079, 1005];
    
    //https://axios-http.com/docs/post_example

    try {
        const res = await axios.post(`${FDC_BASE_URL}${SECRET_API_KEY}`, query);
        const foods = res.data.foods;
        const foodArr = [];

        if(!foods.length) return `No foods found`;
        //later: if no foods found returned; show it on the UI
        
        //takes food data response and filters into actually needed data.
        for(food of foods){
            // console.log(food.description)
            const foodObj = {
                "fdcId": food.fdcId,
                "description": food.description,
                "lowercaseDescription": food.lowercaseDescription,
                "dataType": food.dataType,
                "publishedDate": food.publishedDate,
                "brandOwner": food.brandOwner,
                "brandName": food.brandName,
                "ingredients": food.ingredients,
                "marketCountry": food.marketCountry,
                "foodCategory": food.foodCategory,
                "modifiedDate": food.modifiedDate,
                "dataSource": food.dataSource,
                "packageWeight": food.packageWeight,
                "servingSizeUnit": food.servingSizeUnit,
                "servingSize": food.servingSize,
                "score": food.score,
            };
            const nutrientsArr = [];

            for(nutrient of food.foodNutrients){

                if(nutrientIdsArr.includes(nutrient.nutrientId)){
                    nutrientsArr.push(nutrient);
                }
            }
            
            foodObj.foodNutrients = nutrientsArr;
            foodArr.push(foodObj);
        }

        return foodArr;
    } catch (error) {
        return new Error(`FDC API error. code: ${error.response.data.error.code},
         message: ${error.response.data.error.message}`);
    }
}

/** Gets the nutrients */
function getWantedNutrients(array){
    //for array of nutrients in an individual food
    //

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

module.exports = {
    searchFdcApi
};
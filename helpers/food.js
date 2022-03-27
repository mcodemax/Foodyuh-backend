const axios = require('axios');
const { nutrientNumbers, nutrientIds } = require('./nutrientKeys');

const {
  FDC_API_KEY,
  FDC_BASE_URL,
  PEXELS_API_KEY,
  PEXELS_BASE_URL,
} = require('../config');

/** Helper function for route to search and fetch food data from fdcapi */
async function searchFdcApi(foodQuery) {
  const query = {
    query: `${foodQuery}`,
    pageSize: 10,
    pageNumber: 1,
    sortBy: 'dataType.keyword',
    sortOrder: 'asc',
  };
  const nutrientIdsArr = [
    nutrientNumbers.kcals,
    nutrientNumbers.protein,
    nutrientNumbers.carbs,
    nutrientNumbers.fats,
    nutrientNumbers.fiber,
    nutrientNumbers.vitC,
    nutrientNumbers.calcium,
  ];

  try {
    const res = await axios.post(`${FDC_BASE_URL}${FDC_API_KEY}`, query);

    const foods = res.data.foods;
    const foodArr = [];

    if (!foods.length) return `No foods found`;

    //takes food data response and filters into actually needed data.
    for (food of foods) {
      const foodObj = {
        fdcId: food.fdcId,
        description: food.description,
        lowercaseDescription: food.lowercaseDescription,
        dataType: food.dataType,
        publishedDate: food.publishedDate,
        brandOwner: food.brandOwner,
        brandName: food.brandName,
        ingredients: food.ingredients,
        marketCountry: food.marketCountry,
        foodCategory: food.foodCategory,
        modifiedDate: food.modifiedDate,
        dataSource: food.dataSource,
        packageWeight: food.packageWeight,
        servingSizeUnit: food.servingSizeUnit,
        servingSize: food.servingSize,
        score: food.score,
      };
      const nutrientsArr = [];

      for (nutrient of food.foodNutrients) {
        if (nutrientIdsArr.includes(nutrient.nutrientId)) {
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

/** API call a single food from fdcId */
async function getSingFood(id) {
  const nutrientNumArr = [
    nutrientIds.kcals,
    nutrientIds.protein,
    nutrientIds.carbs,
    nutrientIds.fats,
    nutrientIds.fiber,
    nutrientIds.vitC,
    nutrientIds.calcium,
  ];
  let nutStr = nutrientNumArr.join('&nutrients=');
  nutStr = '&nutrients='.concat(nutStr);

  try {
    const res = await axios.get(
      `https://api.nal.usda.gov/fdc/v1/food/${id}?format=abridged${nutStr}&api_key=${FDC_API_KEY}`
    );
    console.log(res.data);
    return res.data;
  } catch (error) {
    return new Error(`FDC API error. code: ${error.response.data.error.code},
         message: ${error.response.data.error.message}`);
  }
}

/** Takes query string and generates pic from Pexels API */
async function pexelsReq(params) {
  try {
    params = params.replace(' ', '%20');

    const res = await axios.get(
      `${PEXELS_BASE_URL}search?query=${params}&per_page=10`,
      {
        headers: {
          Authorization: 'Bearer ' + PEXELS_API_KEY,
        },
      }
    );

    return res.data;
  } catch (error) {
    return new Error(`Pexels API error.`);
  }
}

module.exports = {
  searchFdcApi,
  getSingFood,
  pexelsReq,
};

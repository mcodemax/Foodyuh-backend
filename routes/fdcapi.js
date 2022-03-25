'use strict';

/** Routes for connecting to fdcapi. */

const jsonschema = require('jsonschema');
const { FDC_BASE_URL, FDC_API_KEY, PEXELS_API_KEY } = require('../config');
const express = require('express');
const router = new express.Router();
const { BadRequestError } = require('../expressError');
const { searchFdcApi, getSingFood, pexelsReq } = require('../helpers/food');
const { ensureLoggedIn } = require('../middleware/auth');

/** GET /:search => { foodRes }
 * Input: search term
 * Output: fdcapi generated food matches
 */
router.get('/foods/:search', ensureLoggedIn, async function (req, res, next) {
  try {
    const foodRes = await searchFdcApi(req.params.search);

    return res.status(200).json({ foodRes });
  } catch (err) {
    return next(err);
  }
});

/**
 * GET /fdcid/:fdcId => { food }
 */
router.get('/fdcid/:fdcId', ensureLoggedIn, async function (req, res, next) {
  try {
    const food = await getSingFood(req.params.fdcId);

    return res.status(200).json({ food });
  } catch (err) {
    return next(err);
  }
});

/**
 * GET /pexels/:search
 * Input: search term
 * Output: pexels image info related to search
 */
router.get('/pexels/:search', ensureLoggedIn, async function (req, res, next) {
  try {
    const response = await pexelsReq(req.params.search);

    return res.status(200).json({ response });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

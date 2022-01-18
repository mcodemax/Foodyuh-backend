"use strict";

/** Routes for connecting to fdcapi. */

const jsonschema = require("jsonschema");
const { FDC_BASE_URL, FDC_API_KEY, PEXELS_API_KEY } = require("../config")
const express = require("express");
const router = new express.Router();
const { BadRequestError } = require("../expressError");
const {searchFdcApi, getSingFood, pexelsReq} = require("../helpers/food");
const { ensureLoggedIn } = require("../middleware/auth");

/** GET / { search }
 * Input search term
 * Output fdcapi generated food matches
 * 
 */
router.get("/", ensureLoggedIn, async function (req, res, next) {
    try {
        const foodRes = await searchFdcApi(req.body.search);
        return res.status(200).json({ foodRes });
    } catch (err) {
        return next(err);
    }
});

/**
 * GET /fdcid { fdcId }
 */
router.get("/fdcid", ensureLoggedIn, async function (req, res, next) {
    try {
        const food = await getSingFood(req.body.fdcId);
        return res.status(200).json({ food });
    } catch (err) {
        return next(err);
    }
});

/**
 * GET /pexels { search }
 */
 router.get("/pexels", ensureLoggedIn, async function (req, res, next) {
    try {
        const response = await pexelsReq(req.body.search);
        return res.status(200).json({ response });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
"use strict";

/** Routes for plates. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError, UnauthorizedError } = require("../expressError");
const { ensureAdmin, ensureLoggedIn, ensureCorrectUserOrAdmin } = require("../middleware/auth");
const Plate = require("../models/plate");
const User = require("../models/user");

const plateNewSchema = require("../schemas/plateNew.json"); //name ltd to 25 chars
// const plateUpdateSchema = require("../schemas/plateUpdate.json");
// const plateSearchSchema = require("../schemas/plateSearch.json");
const foodEditSchema = require("../schemas/fdcId.json");

const router = new express.Router();


/** POST / { plate } =>  { plate }
 *
 * plate should be { name, description }
 *
 * Returns { id, name, description, username }
 *
 * Authorization required: loggedIn
 */
router.post("/", ensureLoggedIn, async function (req, res, next) {
  try {
    req.body.username = res.locals.user.username; //determines what user is making the plate in an obj
  
    const validator = jsonschema.validate(req.body, plateNewSchema);
    
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const plate = await Plate.makePlate(req.body);
    return res.status(201).json({ plate });
  } catch (err) {
    return next(err);
  }
});


/** DELETE /delete/[plateId] => { deletedPlate }
 * deletes a plate
 */
router.delete("/delete/:plateId", ensureLoggedIn, async function (req, res, next) {
  try {
    //make sure the plate being deleted belongs to the user
    // if not throw an err
    const plate = await Plate.get(req.params.plateId)
    if(res.locals.user.username !== plate.username) {
      throw new UnauthorizedError('Unauthorized: This user cannot delete this plate')
    }
    await Plate.remove(req.params.plateId)

    return res.json({ deletedPlate: {...plate} });
  } catch (err) {
    return next(err);
  }
});

//routes to get all of a user's plates is in users.js route

/** GET /  => { user }
 * Get a current loggedin users info (password ommitted)
 * Returns { user } where user is { username, first_name, last_name, isAdmin, isPaid, plates }
 * where plates is { id, name, description }
 * Authorization required: LoggedIn
 */

//maybe put this in a user route later??
router.get("/", ensureLoggedIn, async function (req, res, next) { 
  //loggedin user gets plates that he made
  try {
    //get user object and their plates
    const user = await User.get(res.locals.user.username);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

/** GET /[plateId]  =>  { plate }
 * Where Plate is { id, name, description, username, foods }
 *   where foods is { foodId, plateId, fdcId }, fdcId is used to get nutrient profile
 *
 * Authorization required: LoggedIn
 */
router.get("/:plateId", ensureLoggedIn, async function (req, res, next) {
  //this route still needs testing after adding to a plateId's plate is implemented
  try {
    const plate = await Plate.get(req.params.plateId);
    return res.json({ plate });
  } catch (err) {
    return next(err);
  }
});

/** POST /[plateId] {fdcId:string} =>  { plate }
 * 
 * Route for adding a food to a plate
 * 
 * plateId passed in url
 * Req Body: { fdcId } //fdcId is text NOT integer
 * 
 * Returns Plate which is { id, name, description, username, foods }
 *   where foods is { foodId, plateId, fdcId }, fdcId is used to get nutrient profile
 * 
 * Authorization required: LoggedIn
 */
 router.post("/:plateId", ensureLoggedIn, async function (req, res, next) {
  
  try {
    
    const validator = jsonschema.validate(req.body, foodEditSchema);
    
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    //validation to make sure user logged in === username from plates
    const plate = await Plate.get(req.params.plateId);

    if(plate.username !== res.locals.user.username){
      throw new UnauthorizedError('Unauthorized: This user cannot add foods to plate')
    }

    await Plate.addFood(req.params.plateId, req.body.fdcId); //aside: list of fdcId's to 
    //pass into here will be generated from food.js in frontend most likely

    return res.status(201).json({ plate });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[plateId] { fdcId:"string" } => { plate }
 * 
 * route for deleting a food (fdcId) in a plate
 * 
 * plateId passed in url
 * Req Body: { fdcId } //fdcId is text NOT integer
 * 
 * Returns Plate which is { id, name, description, username, foods, deletedFood }
 *   where foods is { foodId, plateId, fdcId }, fdcId is used to get nutrient profile
 * 
 * Authorization required: LoggedIn
 */


//might need str json validation for fdcId
 router.delete("/:plateId", ensureLoggedIn, async function (req, res, next) {
  
  try {
    const validator = jsonschema.validate(req.body, foodEditSchema);
    
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    //validation to make sure user logged in === username from plates
    const plate = await Plate.get(req.params.plateId);

    if(plate.username !== res.locals.user.username){
      throw new UnauthorizedError('Unauthorized: This user cannot delete foods from plate')
    }

    const food = await Plate.deleteFood(req.params.plateId, req.body.fdcId); //aside: list of fdcId's to 
    //pass into here will be generated from food.js in frontend most likely
    
    plate.deletedFood = {fdcId: req.body.fdcId};

    return res.json({ plate });
  } catch (err) {
    return next(err);
  }
});


//maybe use this route-skeleton to edit a plate's description or name
/** PATCH /[handle] { fld1, fld2, ... } => { company } 
 *
 * Patches plate data.
 *
 * fields can be: { name, description, numEmployees, logo_url }
 *
 * Returns { handle, name, description, numEmployees, logo_url }
 *
 * Authorization required: admin
 */
router.patch("/:plateId", ensureLoggedIn, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, companyUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const company = await Company.update(req.params.handle, req.body);
    return res.json({ company });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

/*
Summary of routes:
  POST / { plate } =>  { plate }
  DELETE /delete/[plateId] => { deletedPlate }
  GET /  => { user }
  GET /[plateId]  =>  { plate }
  POST /[plateId] {fdcId} =>  { plate }
  DELETE /[plateId] => { plate }
*/
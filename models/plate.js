// make a method that stores plates_foods

"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** Related functions for users. */

class Plate {
  /** Create Plate.
   *
   * Returns { id, name, description, username }
   *
   **/
  static async makePlate(
      { name, description, username }) {
    const duplicateCheck = await db.query(
          `SELECT name, username
           FROM plates
           WHERE username = $1`,
        [username],
    ); //database throws err if user dne
    
    //prevents duplicate plates for the same user
    for(const plate of duplicateCheck.rows){
        if (plate.name === name) {
            throw new BadRequestError(`Duplicate plate: ${plate.name}`);
        }
    }

    const result = await db.query(
          `INSERT INTO plates
           (name,
            description,
            username)
           VALUES ($1, $2, $3)
           RETURNING id, name, description, username`,
        [
          name,
          description,
          username
        ],
    );
    console.log({ name, description, username })
    const plate = result.rows[0];

    return plate;
  }

  /** Given a plate id give info about the plate.
   *
   * Returns { id, name, description, username, foods }
   *   where foods is { foodId, plateId, fdcId }
   *
   * Throws NotFoundError if plate not found.
   **/
  static async get(plateId) {
    const plateRes = await db.query(
          `SELECT id,
                  name,
                  description,
                  username
           FROM plates
           WHERE id = $1`,
        [plateId],
    );

    const plate = plateRes.rows[0];

    if (!plate) throw new NotFoundError(`No plate id: ${id}`);

    const foodsRes = await db.query(
        `SELECT id,
                plate_id AS "plateId",
                fdc_id AS "fdcId"
         FROM plates_foods
         WHERE plates_foods.plate_id = $1`, [plateId]);

    plate.foods = foodsRes.rows; //may need to type coerse the fdcId UI later str>int

    return plate;
  }

//in REPL
  //node -i -e "$(< plate.js)"
  //promiseX.then(e => console.log(e))



  //possibly add method to update name and desc of plate



  /** Delete given plate from database; returns undefined. */

  static async remove(id) {//test in repl
    let result = await db.query(
          `DELETE
           FROM plates
           WHERE id = $1
           RETURNING id, name`,
        [id],
    );
    const plate = result.rows[0];

    if (!plate) throw new NotFoundError(`No plate: ${id}`);
  }

  /** Adds a food to plate
   * I: plateId, fdcId
   * O: { id, plateId, fdcId }
   */
  static async addFood(plateId, fdcId) {//test in repl

    //currently allows duplicate fdc_id entries
    //makes sure plate exists
    const plateRes = await db.query(
          `SELECT id,
                  name,
                  description,
                  username
           FROM plates
           WHERE id = $1`,
        [plateId],
    );
    const plate = plateRes.rows[0];

    if (!plate) throw new NotFoundError(`No plate id: ${plateId}. Cannot add food`);

    let result = await db.query(
          `INSERT INTO plates_foods
           (
            plate_id,
            fdc_id
           )
           VALUES ($1, $2)
           RETURNING plate_id AS "plateId", fdc_id AS "fdcId"`,
        [plateId, fdcId],
    );

    const newFood = result.rows[0];

    //need eror checking to makesure valid fdcId???

    return newFood;
  }

  /**
   * 
   * @param {*} plateId 
   * @param {*} fdcId, string
   * @returns undefined
   */
  static async deleteFood(plateId, fdcId) {//test in repl
    let delId;
    //might need another req frst
    //ask how2delete

    //get list of all foods from plates_foods that has plate_id from input
    //loop thru list^ and find the plates_foods id you need
    //query the id and delete it
        //make sure plateId exists (from input)
        //make sure fdcId exists (input)

    const plate = await this.get(plateId);//will auto throw err if plateId DNE
    
    const foodToDel = plate.foods.find(food => food.fdcId === fdcId);
    
    if(foodToDel){
        delId = foodToDel.id;
    }else{
        throw new NotFoundError(`No fdcId ${fdcId} in plate`);
    }

    let result = await db.query(
          `DELETE
           FROM plates_foods
           WHERE id = $1
           RETURNING plate_id AS "plateId", fdc_id AS "fdcId"`,
        [delId],
    );
    
    const food = result.rows[0];

    if (!food) throw new NotFoundError(`No food id: ${fdcId}`);
  }

  //need addFood and removeFood Plate method  
}


module.exports = Plate;
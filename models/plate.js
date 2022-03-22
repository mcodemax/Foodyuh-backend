'use strict';

const db = require('../db');
const bcrypt = require('bcrypt');
const { sqlForPartialUpdate } = require('../helpers/sql');
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require('../expressError');

const { BCRYPT_WORK_FACTOR } = require('../config.js');

/** Plate class for db queries related to Plates */
class Plate {
  /** Create Plate.
   *
   * Returns { id, name, description, username }
   *
   **/
  static async makePlate({ name, description, username }) {
    const duplicateCheck = await db.query(
      `SELECT name, username
           FROM plates
           WHERE username = $1`,
      [username]
    );

    //prevents duplicate plates for the same user
    for (const plate of duplicateCheck.rows) {
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
      [name, description, username]
    );
    console.log({ name, description, username });
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
      [plateId]
    );

    const plate = plateRes.rows[0];

    if (!plate) throw new NotFoundError(`No plate id: ${id}`);

    const foodsRes = await db.query(
      `SELECT id,
                plate_id AS "plateId",
                fdc_id AS "fdcId"
         FROM plates_foods
         WHERE plates_foods.plate_id = $1`,
      [plateId]
    );

    plate.foods = foodsRes.rows;

    return plate;
  }

  /** Delete given plate from database; returns undefined. */
  static async remove(id) {
    let result = await db.query(
      `DELETE
           FROM plates
           WHERE id = $1
           RETURNING id, name`,
      [id]
    );
    const plate = result.rows[0];

    if (!plate) throw new NotFoundError(`No plate: ${id}`);
  }

  /** Adds a food to plate
   * I: plateId, fdcId
   * O: { id, plateId, fdcId }
   *
   * currently allows duplicate fdc_id entries
   */
  static async addFood(plateId, fdcId) {
    //test in repl
    const plateRes = await db.query(
      `SELECT id,
                  name,
                  description,
                  username
           FROM plates
           WHERE id = $1`,
      [plateId]
    );
    const plate = plateRes.rows[0];

    //makes sure plate exists
    if (!plate)
      throw new NotFoundError(`No plate id: ${plateId}. Cannot add food`);

    let result = await db.query(
      `INSERT INTO plates_foods
           (
            plate_id,
            fdc_id
           )
           VALUES ($1, $2)
           RETURNING plate_id AS "plateId", fdc_id AS "fdcId"`,
      [plateId, fdcId]
    );

    const newFood = result.rows[0];

    return newFood;
  }

  /** Deletes a food from plate
   * I: plateId, fdcId
   * O: undefined
   *
   * currently allows duplicate fdc_id entries
   */
  static async deleteFood(plateId, fdcId) {
    let delId;
    const plate = await this.get(plateId);
    const foodToDel = plate.foods.find((food) => food.fdcId === fdcId);

    if (foodToDel) {
      delId = foodToDel.id;
    } else {
      throw new NotFoundError(`No fdcId ${fdcId} in plate`);
    }

    let result = await db.query(
      `DELETE
           FROM plates_foods
           WHERE id = $1
           RETURNING plate_id AS "plateId", fdc_id AS "fdcId"`,
      [delId]
    );

    const food = result.rows[0];

    if (!food) throw new NotFoundError(`No food id: ${fdcId}`);
  }
}

module.exports = Plate;

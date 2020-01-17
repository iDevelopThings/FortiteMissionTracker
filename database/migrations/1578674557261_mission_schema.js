'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class MissionSchema extends Schema {
  up()
  {
    this.create('missions', (table) => {
      table.increments();
      table.text('title');
      table.integer('tile_index');
      table.string('type');
      table.boolean('is_special');
      table.string('generator');
      table.integer('level').nullable();
      table.timestamps();
    });
  }

  down()
  {
    this.drop('missions');
  }
}

module.exports = MissionSchema;

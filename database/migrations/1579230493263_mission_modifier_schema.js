'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class MissionModifierSchema extends Schema {
  up()
  {
    this.create('mission_modifiers', (table) => {
      table.increments();
      table.integer('mission_id').unsigned().references('id').inTable('missions');
      table.text('title');
      table.text('description').nullable();
      table.string('slug');
      table.string('type');
      table.timestamps();
    });
  }

  down()
  {
    this.drop('mission_modifiers');
  }
}

module.exports = MissionModifierSchema;

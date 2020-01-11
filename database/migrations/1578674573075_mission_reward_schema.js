'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class MissionRewardSchema extends Schema {
  up()
  {
    this.create('mission_rewards', (table) => {
      table.increments();
      table.integer('mission_id').unsigned().references('id').inTable('missions');
      table.text('title');
      table.string('slug');
      table.string('type');
      table.boolean('interesting');
      table.boolean('alert_reward');
      table.integer('quantity');
      table.string('amount_type').nullable();

      table.timestamps();
    });
  }

  down()
  {
    this.drop('mission_rewards');
  }
}

module.exports = MissionRewardSchema;

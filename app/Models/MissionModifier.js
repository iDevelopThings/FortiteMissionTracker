'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class MissionModifier extends Model {
  static get computed()
  {
    return ['image'];
  }

  getImage()
  {
    return `/icons/modifiers/${this.slug}.png`;
  }

}

module.exports = MissionModifier;

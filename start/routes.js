'use strict';

/*
 |--------------------------------------------------------------------------
 | Routes
 |--------------------------------------------------------------------------
 |
 | Http routes are entry points to your web application. You can create
 | routes for different URL's and bind Controller actions to them.
 |
 | A complete guide on routing is available here.
 | http://adonisjs.com/docs/4.1/routing
 |
 */

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route');

//Route.on('/').view('welcome');
Route.get('/store', 'FortniteController.store');
Route.get('/rewards', 'FortniteController.rewards');

Route.get('/missions', 'FortniteController.missions');
Route.get('/missions/:type', 'FortniteController.missionsByType');
Route.get('/missions/containing/:type', 'FortniteController.missionsContainingReward');

Route.any('*', ({view}) => view.render('welcome'));

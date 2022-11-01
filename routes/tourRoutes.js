const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');

const router = express.Router();
// route.param('id', tourController.checkID);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/statistics').get(tourController.getTourStatistics);
router.route('/monthly-plan/:year').get(tourController.getTourMonthlyPlan);

router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.checkNewTourData, tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.patchTour)
  .delete(
    authController.protect,
    authController.restricTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;

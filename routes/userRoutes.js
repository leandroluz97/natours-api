const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);
router.patch(
  '/new-password',
  authController.protect,
  authController.updatePassword
);
router.get('/my-account', authController.protect, userController.getMe);
router.patch('/my-account', authController.protect, userController.updateMe);
router.delete('/my-account', authController.protect, userController.deleteMe);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.patchUser)
  .delete(authController.protect, userController.deleteUser);

// router.stack.forEach((el) => {
//   console.log(el);
// });

module.exports = router;

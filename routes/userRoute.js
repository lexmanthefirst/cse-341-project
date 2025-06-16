const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const userValidator = require('../utilities/userValidator');
const Util = require('../utilities');
const authenticateUser = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authRole');

const authController = require('../controllers/authController');

/**
 * @swagger
 * /user:
 *   post:
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/user'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/user'
 *       400:
 *         description: Invalid input
 */
router.post(
  '/',
  authenticateUser,
  userValidator.userValidationRules(),
  userValidator.validateRequest,
  Util.handleErrors(userController.createUser),
);

/**
 * @swagger
 * tags:
 *   name: User
 *   description: API for user information
 */

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get all users
 *     tags: [User]
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/user'
 */
router.get('/', Util.handleErrors(userController.getAllUsers));

/**
 * @swagger
 * /user/{email}:
 *   get:
 *     summary: Get a user by email
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: The user email
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/user'
 *       404:
 *         description: User not found
 */
router.get(
  '/email/:email',
  authenticateUser,
  Util.handleErrors(userController.getUserByEmail),
);

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/user'
 *       404:
 *         description: User not found
 */
router.get('/:id', Util.handleErrors(userController.getUserById));

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/user'
 *     responses:
 *       200:
 *         description: User updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/user'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: User not found
 */
router.put(
  '/:id',
  authenticateUser,
  userValidator.userValidationRules(),
  userValidator.validateRequest,
  Util.handleErrors(userController.updateUser),
);

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Delete a user member by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User member deleted
 *       404:
 *         description: User not found
 */
router.delete(
  '/:id',
  authenticateUser,
  authorizeRoles('admin'),
  Util.handleErrors(userController.deleteUser),
);

module.exports = router;

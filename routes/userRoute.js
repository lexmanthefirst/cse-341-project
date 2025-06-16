const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const userValidator = require('../utilities/userValidator');
const Util = require('../utilities');
const {
  isAuthenticated,
  authorizeRoles,
} = require('../middleware/authMiddleware');

const authController = require('../controllers/authController');

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Create a new user
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
  isAuthenticated,
  authorizeRoles('admin'),
  userValidator.userValidationRules(),
  userValidator.validateRequest,
  Util.handleErrors(userController.createUser),
);

/**
 * @swagger
 * /user/signup:
 *   post:
 *     summary: Register a new user and get a JWT token
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: Alex Okhitoya
 *               email:
 *                 type: string
 *                 format: email
 *                 example: alex@school.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: secret123
 *               role:
 *                 type: string
 *                 enum: [admin, teacher, student]
 *                 example: student
 *     responses:
 *       201:
 *         description: User registered successfully and JWT token returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 60e7a2a5b5e4c24d88e2f776
 *                     name:
 *                       type: string
 *                       example: Alex Okhitoya
 *                     email:
 *                       type: string
 *                       example: alex@school.com
 *                     role:
 *                       type: string
 *                       example: student
 *       400:
 *         description: User already exists or validation failed
 *       500:
 *         description: Server error during signup
 */

router.post(
  '/signup',
  userValidator.userValidationRules(),
  userValidator.validateRequest,
  Util.handleErrors(authController.signup),
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
router.get('/email/:email', Util.handleErrors(userController.getUserByEmail));

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
  isAuthenticated,
  authorizeRoles('admin'),
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
  isAuthenticated,
  authorizeRoles('admin'),
  Util.handleErrors(userController.deleteUser),
);

module.exports = router;

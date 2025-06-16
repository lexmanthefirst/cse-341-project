const express = require('express');
const router = new express.Router();
const classGroupController = require('../controllers/classController');
const classValidator = require('../utilities/classValidator');
const Util = require('../utilities');
const {
  isAuthenticated,
  authorizeRoles,
} = require('../middleware/authMiddleware');

/**
 * @swagger
 * /class:
 *   post:
 *     summary: Create a new class
 *     tags: [Class]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/class'
 *     responses:
 *       201:
 *         description: Class created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/class'
 *       400:
 *         description: Invalid input
 */
router.post(
  '/',
  isAuthenticated,
  authorizeRoles('admin'),
  classValidator.classGroupValidationRules(),
  classValidator.validateRequest,
  Util.handleErrors(classGroupController.createClassGroup),
);

/**
 * @swagger
 * tags:
 *   name: Class
 *   description: API for class information
 */

/**
 * @swagger
 * /class:
 *   get:
 *     summary: Get all classes
 *     tags: [Class]
 *     responses:
 *       200:
 *         description: List of classes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/class'
 */
router.get('/', Util.handleErrors(classGroupController.getAllClassGroups));

/**
 * @swagger
 * /class/{id}:
 *   get:
 *     summary: Get a class by ID
 *     tags: [Class]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The class ID
 *     responses:
 *       200:
 *         description: Class found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/class'
 *       404:
 *         description: Class not found
 */
router.get('/:id', Util.handleErrors(classGroupController.getClassGroup));

/**
 * @swagger
 * /class/{id}:
 *   put:
 *     summary: Update a class by ID
 *     tags: [Class]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The class ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/class'
 *     responses:
 *       200:
 *         description: Class updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/class'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Class not found
 */
router.put(
  '/:id',
  isAuthenticated,
  authorizeRoles('admin'),
  classValidator.classGroupValidationRules(),
  classValidator.validateRequest,
  Util.handleErrors(classGroupController.updateClassGroup),
);

/**
 * @swagger
 * /class/{id}:
 *   delete:
 *     summary: Delete a class member by ID
 *     tags: [Class]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The class ID
 *     responses:
 *       200:
 *         description: Class member deleted
 *       404:
 *         description: Class not found
 */
router.delete(
  '/:id',
  isAuthenticated,
  authorizeRoles('admin'),
  Util.handleErrors(classGroupController.deleteClassGroup),
);

module.exports = router;

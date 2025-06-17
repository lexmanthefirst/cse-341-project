const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');
const departmentValidator = require('../utilities/departmentValidator');
const Util = require('../utilities');
const authenticateUser = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authRole');

/**
 * @swagger
 * /department:
 *   post:
 *     summary: Create a new department
 *     tags: [Department]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/department'
 *     responses:
 *       201:
 *         description: Department created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/department'
 *       400:
 *         description: Invalid input
 */
router.post(
  '/',
  authenticateUser,
  departmentValidator.departmentValidationRules(),
  departmentValidator.validateRequest,
  Util.handleErrors(departmentController.createDepartment),
);

/**
 * @swagger
 * tags:
 *   name: Department
 *   description: API for department information
 */

/**
 * @swagger
 * /department:
 *   get:
 *     summary: Get all department
 *     tags: [Department]
 *     responses:
 *       200:
 *         description: List of department
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/department'
 */
router.get('/', Util.handleErrors(departmentController.getAllDepartments));

/**
 * @swagger
 * /department/{id}:
 *   get:
 *     summary: Get a department by ID
 *     tags: [Department]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The department ID
 *     responses:
 *       200:
 *         description: Department found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/department'
 *       404:
 *         description: User not found
 */
router.get('/:id', Util.handleErrors(departmentController.getDepartment));

/**
 * @swagger
 * /deparment/{id}:
 *   put:
 *     summary: Update a deparment by ID
 *     tags: [Department]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The department ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/department'
 *     responses:
 *       200:
 *         description: Department updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/department'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Department not found
 */
router.put(
  '/:id',
  authenticateUser,
  departmentValidator.departmentValidationRules(),
  departmentValidator.validateRequest,
  Util.handleErrors(departmentController.updateDepartment),
);

/**
 * @swagger
 * /department/{id}:
 *   delete:
 *     summary: Delete a department member by ID
 *     tags: [Department]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The department ID
 *     responses:
 *       200:
 *         description: Department member deleted
 *       404:
 *         description: Department not found
 */
router.delete(
  '/:id',
  authenticateUser,
  Util.handleErrors(departmentController.deleteDepartment),
);

module.exports = router;

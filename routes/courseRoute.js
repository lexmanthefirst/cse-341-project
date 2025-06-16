const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const courseValidator = require('../utilities/courseValidator');
const Util = require('../utilities');
const authenticateUser = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authRole');

/**
 * @swagger
 * tags:
 *   name: Course
 *   description: API for course management
 */

/**
 * @swagger
 * /course:
 *   post:
 *     summary: Create a new course
 *     tags: [Course]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/course'
 *     responses:
 *       201:
 *         description: Course created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/course'
 *       400:
 *         description: Invalid input
 */
router.post(
  '/',
  authenticateUser,
  authorizeRoles('admin'),
  courseValidator.courseValidationRules(),
  courseValidator.validateRequest,
  Util.handleErrors(courseController.createCourse),
);

/**
 * @swagger
 * /course:
 *   get:
 *     summary: Get all courses
 *     tags: [Course]
 *     responses:
 *       200:
 *         description: List of courses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/course'
 */
router.get('/', Util.handleErrors(courseController.getAllCourses));

/**
 * @swagger
 * /course/{id}:
 *   get:
 *     summary: Get a course by ID
 *     tags: [Course]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The course ID
 *     responses:
 *       200:
 *         description: Course found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/course'
 *       404:
 *         description: Course not found
 */
router.get('/:id', Util.handleErrors(courseController.getCourse));

/**
 * @swagger
 * /course/{id}:
 *   put:
 *     summary: Update a course by ID
 *     tags: [Course]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The course ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/course'
 *     responses:
 *       200:
 *         description: Course updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/course'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Course not found
 */
router.put(
  '/:id',
  authenticateUser,
  authorizeRoles('admin'),
  courseValidator.courseValidationRules(),
  courseValidator.validateRequest,
  Util.handleErrors(courseController.updateCourse),
);

/**
 * @swagger
 * /course/{id}:
 *   delete:
 *     summary: Delete a course by ID
 *     tags: [Course]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The course ID
 *     responses:
 *       204:
 *         description: Course deleted successfully
 *       404:
 *         description: Course not found
 */
router.delete(
  '/:id',
  authenticateUser,
  authorizeRoles('admin'),
  Util.handleErrors(courseController.deleteCourse),
);

module.exports = router;

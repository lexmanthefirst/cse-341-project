// routes/enrollmentRoutes.js
const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');
const {
  enrollmentValidationRules,
  validateRequest,
} = require('../utilities/enrollmentValidator');
const Util = require('../utilities');
const authenticateUser = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authRole');

/**
 * @swagger
 * tags:
 *   name: Enrollment
 */

/**
 * @swagger
 * /enrollment:
 *   post:
 *     summary: Enroll a student in a course
 *     tags: [Enrollment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/enrollment'
 *     responses:
 *       201:
 *         description: Student enrolled successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/enrollment'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Student or course not found
 */
router.post(
  '/',
  authenticateUser,
  enrollmentValidationRules(),
  validateRequest,
  Util.handleErrors(enrollmentController.enrollStudent),
);

/**
 * @swagger
 * /enrollment:
 *   get:
 *     summary: Get all enrollments
 *     tags: [Enrollment]
 *     responses:
 *       200:
 *         description: List of all enrollments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/enrollment'
 */
router.get('/', Util.handleErrors(enrollmentController.getAllEnrollments));

/**
 * @swagger
 * /enrollment/student/{studentId}:
 *   get:
 *     summary: Get enrollments for a specific student
 *     tags: [Enrollment]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The student ID
 *     responses:
 *       200:
 *         description: List of student's enrollments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/enrollment'
 *       404:
 *         description: Student not found
 */
router.get(
  '/student/:studentId',
  Util.handleErrors(enrollmentController.getStudentEnrollments),
);

/**
 * @swagger
 * /enrollment/course/{courseId}:
 *   get:
 *     summary: Get enrollments for a specific course
 *     tags: [Enrollment]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: The course ID
 *     responses:
 *       200:
 *         description: List of course enrollments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/enrollment'
 *       404:
 *         description: Course not found
 */
router.get(
  '/course/:courseId',
  Util.handleErrors(enrollmentController.getCourseEnrollments),
);

/**
 * @swagger
 * /enrollment/{id}:
 *   put:
 *     summary: Update enrollment (grade or status)
 *     tags: [Enrollment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The enrollment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/enrollment'
 *     responses:
 *       200:
 *         description: Enrollment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/enrollment'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Enrollment not found
 */
router.put(
  '/:id',
  authenticateUser,
  enrollmentValidationRules(),
  validateRequest,
  Util.handleErrors(enrollmentController.updateEnrollment),
);

/**
 * @swagger
 * /enrollment/{id}/withdraw:
 *   patch:
 *     summary: Withdraw a student from a course
 *     tags: [Enrollment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The enrollment ID
 *     responses:
 *       200:
 *         description: Student withdrawn successfully
 *       404:
 *         description: Enrollment not found
 */
router.patch(
  '/:id/withdraw',
  authenticateUser,
  authorizeRoles('admin'),
  Util.handleErrors(enrollmentController.withdrawStudent),
);

module.exports = router;

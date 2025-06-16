const router = require('express').Router();
const userRoute = require('./userRoute');
const classRoute = require('./classRoute');
const departmentRoute = require('./departmentRoute');
const courseRoute = require('./courseRoute');
const enrollmentRoute = require('./enrollmentRoute');
const authRoute = require('./authRoute');

router.get('/', (req, res) => {
  res.send('Welcome to the School Management Api');
});

router.use('/user', userRoute);
router.use('/class', classRoute);
router.use('./department', departmentRoute);
router.use('./course', courseRoute);
router.use('/enrollment', enrollmentRoute);
router.use('/auth', authRoute);

module.exports = router;

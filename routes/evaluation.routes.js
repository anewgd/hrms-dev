var express = require("express");
var router = express.Router();

const withAuth = require("../withAuth");

const evaluation = require("../controllers/evaluation.controller.js");

//Create an evaluation
router.post(
  "/",
  withAuth.verifyToken,
  withAuth.withRoleManager,
  evaluation.create
);

router.get(
  "/",
  withAuth.verifyToken,
  withAuth.withRoleManager,
  evaluation.findAll
);
module.exports = router;

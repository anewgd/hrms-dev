var express = require("express");
var router = express.Router();

const withAuth = require("../withAuth");

const indicator = require("../controllers/indicator.controller.js");

//Create a new Indicator.
router.post(
  "/",
  withAuth.verifyToken,
  withAuth.withRoleManager,
  indicator.create
);

//Return all indicators

router.get(
  "/",
  withAuth.verifyToken,
  withAuth.withRoleManager,
  indicator.findAll
);

router.delete(
  "/:indicator_name",
  withAuth.verifyToken,
  withAuth.withRoleManager,
  indicator.delete
);

module.exports = router;

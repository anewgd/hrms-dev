const db = require("../models");
const Evaluation = db.evaluation;

exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content Cannot be empty!",
    });

    return;
  }

  const evaluation = {
    emp_id: req.body.emp_id,
    indicator: req.body.indicator,
    value: req.body.value,
    date: req.body.evaluationDate,
    remark: req.body.remark,
  };

  Evaluation.create(evaluation)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message || "Internal Error." });
    });
};

exports.findAll = (req, res) => {
  Evaluation.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving indicators.",
      });
    });
};

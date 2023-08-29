const db = require("../models");
const Indicator = db.indciator;

exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content Cannot be empty!",
    });

    return;
  }

  const indicator = {
    indicator_name: req.body.indicator_name,
    min_value: req.body.min_value,
    max_value: req.body.max_value,
    interval: req.body.interval,
  };

  Indicator.create(indicator)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message || "Internal Error." });
    });
};

exports.findAll = (req, res) => {
  Indicator.findAll()
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

exports.delete = (req, res) => {
  const indicatorName = req.params.indicator_name;

  Indicator.destroy({
    where: { indicator_name: indicatorName },
  })
    .then((num) => {
      if (num == 1) {
        console.log("Deleted");
        res.status(200).send({
          message: "Indicator deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete indicator ${indicatorName}. Not found.`,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: "Could not delete indicator " + indicatorName,
      });
    });
};

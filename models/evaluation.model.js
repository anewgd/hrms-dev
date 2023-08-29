module.exports = (sequelize, Sequelize) => {
  const Evaluation = sequelize.define(
    "evaluation",
    {
      emp_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      indicator: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      value: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },

      remark: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
      underscored: true,
    }
  );

  return Evaluation;
};

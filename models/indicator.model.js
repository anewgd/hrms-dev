module.exports = (sequelize, Sequelize) => {
  const Indicator = sequelize.define(
    "indicator",
    {
      indicator_name: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },

      min_value: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      max_value: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      interval: {
        type: Sequelize.ENUM,
        values: ["DAILY", "MONTHLY", "YEARLY"],
        allowNull: false,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
      underscored: true,
    }
  );

  return Indicator;
};

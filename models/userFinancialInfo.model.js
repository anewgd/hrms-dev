module.exports = (sequelize, Sequelize) => {
  const UserFinancialInfo = sequelize.define(
    "user_financial_info",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      employmentType: {
        type: Sequelize.ENUM,
        values: ["Full Time", "Part Time"],
        allowNull: true,
      },
      basicSalary: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      grossSalary: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      netSalary: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      allowance: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      incomeTax: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      pensionEmployee: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      pensionCompany: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      totalDeduction: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      bankName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      accountName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      accountNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
      underscored: true,
    }
  );

  return UserFinancialInfo;
};

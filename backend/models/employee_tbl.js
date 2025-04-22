module.exports = (sequelize, DataType) => {
  const employee_tbl = sequelize.define("employee_tbl", {
    ID: {
      primaryKey: true,
      autoIncrement: true,
      type: DataType.INTEGER,
    },
    Country: {
      type: DataType.STRING,
      allowNull: false,
    },
    Account_type: {
      type: DataType.STRING,
      allowNull: false,
    },
    Username: {
      type: DataType.STRING,
      allowNull: false,
      unique: true,
    },
    Password: {
      type: DataType.STRING,
      allowNull: false,
    },
    LastName: {
      type: DataType.STRING,
      allowNull: false,
    },
    FirstName: {
      type: DataType.STRING,
      allowNull: false,
    },
    emailAddress: {
      type: DataType.STRING,
      allowNull: false,
      unique: true,
    },
    contactNum: {
      type: DataType.STRING,
      allowNull: true,
    },
    PhotoPath: {
      type: DataType.STRING,
      allowNull: true,
    },
  });

  return employee_tbl;
};

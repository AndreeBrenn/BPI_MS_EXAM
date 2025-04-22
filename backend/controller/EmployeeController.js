const { employee_tbl } = require("../models");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const { Op } = require("sequelize");
const {
  generate_refresh_token,
  generate_Access_token,
} = require("../token/TokenGenerator");
const jwt = require("jsonwebtoken");

const create_user = async (req, res) => {
  const userData = req.body;

  try {
    fs.rename(
      `./savedImages/${req.file?.filename}`,
      `./savedImages/${req.file?.filename}.png`,
      (err) => console.log(err)
    );

    const usernameExist = await employee_tbl.findOne({
      where: {
        [Op.or]: [
          { username: userData.Username },
          { emailAddress: userData.emailAddress },
        ],
      },
    });

    if (usernameExist)
      return res.status(409).json({ message: "user already exist" });

    const salt = await bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hashSync(userData.Password, salt);

    const result = await employee_tbl.create({
      Country: userData.Country,
      Account_type: userData.Account_type,
      LastName: userData.LastName,
      FirstName: userData.FirstName,
      contactNum: userData.contactNum,
      emailAddress: userData.emailAddress,
      Username: userData.Username,
      Password: hashedPassword,
      PhotoPath: req.file ? `/savedImages/${req.file.filename}.png` : null,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
  }
};

const edit_user = async (req, res) => {
  const userData = req.body;

  try {
    fs.rename(
      `./savedImages/${req.file?.filename}`,
      `./savedImages/${req.file?.filename}.png`,
      (err) => console.log(err)
    );

    const usernameExist = await employee_tbl.findOne({
      where: {
        [Op.or]: [
          { username: userData.Username },
          { emailAddress: userData.emailAddress },
        ],
        ID: { [Op.ne]: userData.ID },
      },
    });

    if (usernameExist)
      return res.status(409).json({ message: "user already exist" });

    const salt = await bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hashSync(userData.Password, salt);

    const result = await employee_tbl.update(
      {
        Country: userData.Country,
        Account_type: userData.Account_type,
        LastName: userData.LastName,
        FirstName: userData.FirstName,
        contactNum: userData.contactNum,
        emailAddress: userData.emailAddress,
        Username: userData.Username,
        Password: hashedPassword,
        PhotoPath: req.file ? `/savedImages/${req.file.filename}.png` : null,
      },
      { where: { ID: userData.ID } }
    );

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const delete_user = async (req, res) => {
  const { ID } = req.params;

  try {
    const result = await employee_tbl.destroy({ where: { ID: ID } });

    return res.status(200).json("Record Deleted");
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const login_user = async (req, res) => {
  const userData = req.body;
  try {
    if (userData.username == "Admin" && userData.password == "Admin") {
      const refreshToken = generate_refresh_token(0);
      const accessToken = generate_Access_token(0, "Admin", "Admin");

      res.cookie("r_token", refreshToken, {
        httpOnly: true,
        sameSite: "Strict",
        secure: false,
        // httpOnly: true,
        // secure: true,
        // sameSite: "None",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json(accessToken);
    }
    const user = await employee_tbl.findOne({
      where: {
        Username: userData.username,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User doesn't exist" });
    }

    // COMPARING THE PASSWORD INPUT AND BCRYPT HASH
    const passwordCorrect = await bcrypt.compareSync(
      userData.password,
      user.Password
    );

    if (!passwordCorrect) {
      return res.status(403).json({ message: "Credentials are invalid" });
    }

    const refreshToken = generate_refresh_token(user.ID);
    const accessToken = generate_Access_token(
      user.ID,
      user.Account_type,
      user.LastName
    );

    res.cookie("r_token", refreshToken, {
      httpOnly: true,
      sameSite: "Strict",
      secure: false,
      // httpOnly: true,
      // secure: true,
      // sameSite: "None",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json(accessToken);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const refreshToken = async (req, res) => {
  const cookies = req.cookies;
  try {
    if (!cookies?.r_token) return res.status(403).json({ message: "No Token" });

    const refreshToken = cookies.r_token;

    const decoded = await jwt.verify(
      refreshToken,
      process.env.SECRET_REFRESH_TOKEN
    );

    if (!decoded) return res.status(403).json({ message: "Token Invalid" });

    const response = await employee_tbl.findOne({ where: { ID: decoded.ID } });

    const newAccessToken = generate_Access_token(
      response.ID,
      response.Account_type,
      response.LastName
    );

    return res.status(200).json(newAccessToken);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong!" });
  }
};

const logout_user = async (req, res) => {
  res.clearCookie("r_token", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });

  return res.status(200).json({ message: "User is logout" });
};

// GET ALL EMPLOYEES
const ReadEmployee = async (req, res) => {
  const { offset, limit, search } = req.params;

  try {
    if (search != "null") {
      const result = await employee_tbl.findAll({
        where: {
          [Op.or]: {
            Username: { [Op.substring]: search },
            FirstName: { [Op.substring]: search },
            LastName: { [Op.substring]: search },
          },
        },
        offset: parseInt(offset),
        limit: parseInt(limit),
      });
      const count = await employee_tbl.count();
      return res.status(200).json({ result, count });
    }
    const result = await employee_tbl.findAll({
      offset: parseInt(offset),
      limit: parseInt(limit),
    });
    const count = await employee_tbl.count();
    return res.status(200).json({ result, count });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

module.exports = {
  create_user,
  login_user,
  refreshToken,
  logout_user,
  ReadEmployee,
  edit_user,
  delete_user,
};

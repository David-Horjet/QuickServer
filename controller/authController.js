const { Users } = require("../model/userModel");


const { validatePassword, generateHashed } = require("../utils/auth");
const { generateAccessToken } = require("../utils/jwt");

const register = async (req, res) => {
  try {
    const body = req.body;
    const casedEmail = body.email.toLowerCase();
    const emailCheck = await Users.findOne({
      email: casedEmail,
    });
    if (emailCheck) {
      return res.json({
        status: false,
        message: `You've got some errors`,
        error: "Email already exists",
      });
    }
    hashedPassword = generateHashed(body.password);
    const data = await Users.create({
      firstName: body.firstName,
      lastName: body.lastName,
      email: casedEmail,
      password: hashedPassword,
    });

    const token = generateAccessToken({ userId: data._id });

    const { password, ...others } = data._doc;

    return res.json({
      status: true,
      message: "Registeration Successful",
      data: others,
      token,
    });
  } catch (error) {
    return res.json({
      status: false,
      message: `You've got some errors`,
      error,
    });
  }
};

const login = async (req, res) => {
  try {
    const body = req.body;
    const casedEmail = body.email.toLowerCase();
    const findUser = await Users.findOne({ email: casedEmail });
    if (!findUser) {
      return res.json({
        status: false,
        message: "Email not found in Database",
      });
    }

    const valid = validatePassword(body.password, findUser.password);

    if (!valid) {
      return res.json({
        status: false,
        message: "Password Incorrect",
      });
    }

    const token = generateAccessToken({ userId: findUser._id });

    const { password, ...others } = findUser._doc;
    if (valid) {
      return res.json({
        status: true,
        message: "Login Successful",
        data: others,
        token,
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      status: false,
      message: `You've got some errors`,
      error
    });
  }
};
const getUsers = async (req, res) => {
  try {
    const users = await Users.find();
    return res.json({
      status: true,
      message: "Here are the Users in the DB",
      data: users,
    });
  } catch (error) {
    return res.json({
      status: false,
      message: `You've got some errors`,
      // error: "There was a problem signing in",
    });
  }
};
const getsingleUser = async (req, res) => {
  try {
    const userId = req.query.id
    const users = await Users.findOne({id : userId});
    console.log(users)
    if (users) {
      return res.json({
        status: true,
        msg: `User's data fetched successfully`,
        data: users
      });
    } else {
      return res.json({
        status: false,
        msg: `Can't Find user's details`,
        err
      });
    }
  
  } catch (error) {
    return res.json({
      status: false,
      message: `You've got some errors`,
      error
    });
  }
};
module.exports = {
  register,
  login,
  getUsers,
  getsingleUser
};

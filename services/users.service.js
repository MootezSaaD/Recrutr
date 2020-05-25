const sequelize = require("sequelize");
const { User, Applicant, Recruiter } = require("../db/models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const config = require("../config/env");

function usersService() {
  async function getUserById(id) {
    return User.findOne({ where: { id: id } });
  }

  async function getUserByEmail(email) {
    const query = { email: email };
    return User.findOne({ where: query });
  }

  async function addUser(userData) {
    return User.create(userData);
  }

  async function getRole(userEmail) {
    const query = { UserEmail: userEmail };
    const res = await Applicant.findOne({ where: query });
    if (res) {
      return "Applicant";
    } else {
      return "Recruiter";
    }
  }

  async function register(resBody) {
    let newUser = {
      firstName: resBody.firstName.trim(),
      lastName: resBody.lastName.trim(),
      email: resBody.email.trim(),
      password: bcrypt.hashSync(resBody.password, 10),
    };
    let user = await addUser(newUser);

    if (resBody.userType === "Applicant") {
      await user.createApplicant({ phoneNumber: resBody.phoneNumber });
    } else if (resBody.userType === "Recruiter") {
      let recruiter = await user.createRecruiter();
      await recruiter.createCompany(resBody.company);
    } else {
      throw Error("Invalid user type");
    }
  }

  async function login(resBody) {
    const user = await getUserByEmail(resBody.email);
    if (!user) {
      throw Error("User not found");
    }
    const match = await bcrypt.compare(resBody.password, user.password);
    if (!match) throw Error;
    const token = jwt.sign(user.toJSON(), config.secret, {
      expiresIn: config.tokenExpiration,
    });
    let userType = await getRole(resBody.email);
    return {
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userType: userType,
        token: token,
      },
    };
  }

  return {
    getUserById,
    getUserByEmail,
    addUser,
    register,
    login,
    getRole,
  };
}

module.exports = usersService;

const { User, Company } = require("../db/models");
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

  async function getRole(user) {
    if(user.role.toLowerCase() == "recruiter") {
      let recruiter = await user.getRecruiter();
      let rectInfo = {
        userType: user.role,
        // Need to convert to JSON since the returned object is translated to Company
        // model instance
        company: await recruiter.getCompany().then(company => company.toJSON())
      } 
      // Delete unnecessary data
      delete rectInfo.company.createdAt;
      delete rectInfo.company.updatedAt;
      return rectInfo;
    }
    let applicantInfo = {
      userType: user.role,
      phoneNumber: await user.getApplicant().then(applicant => applicant.toJSON())
    }
    applicantInfo.phoneNumber = applicantInfo.phoneNumber.phoneNumber;
    return applicantInfo
  }

  async function getProfile(user) {
    let userInfo = await getRole(user);
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      ...userInfo,
    }
  }

  function generateTokens(userEmail) {
    const accessToken = jwt.sign(
      { email: userEmail },
      config.secret, 
      { expiresIn: config.tokenExpiration }
    );
    const refreshToken = jwt.sign(
      { email: userEmail },
      config.refreshTokenSecret,
      { expiresIn: config.refreshTokenExpiration }
    );
    return { accessToken, refreshToken }
  } 

  async function register(resBody) {
    let newUser = {
      firstName: resBody.firstName.trim(),
      lastName: resBody.lastName.trim(),
      email: resBody.email.trim(),
      password: bcrypt.hashSync(resBody.password, 10),
    };
    if (resBody.userType.toLowerCase() === "applicant") {
      newUser["role"] = "applicant";
      let user = await addUser(newUser);
      await user.createApplicant({ phoneNumber: resBody.phoneNumber });
    } else if (resBody.userType.toLowerCase() === "recruiter") {
      newUser["role"] = "recruiter";
      let user = await addUser(newUser);
      let recruiter = await user.createRecruiter();
      await recruiter.createCompany(resBody.company);
    } else {
      throw Error("Invalid user type");
    }
  }

  async function login(resBody) {
    let user = await getUserByEmail(resBody.email);
    if (!user) {
      throw Error("User not found");
    }

    const match = await bcrypt.compare(resBody.password, user.password);
    if (!match) throw Error;
    let userInfo = await getRole(user);

    const { accessToken, refreshToken } = generateTokens(user.email);

    return {
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        ...userInfo,
        accessToken,
        refreshToken
      },
    };
  }

  async function refreshToken(refreshToken) {
    let decoded = jwt.verify(refreshToken, config.refreshTokenSecret);
    if (!decoded) {
        throw Error("Invalid refresh token");
    }
    let user = await getUserByEmail(decoded.email);
    if (!user) {
      throw Error("Invalid refresh token");
    }
    const tokens = generateTokens(user.email);
    return tokens;
  }

  return {
    getUserByEmail,
    getProfile,
    register,
    login,
    refreshToken
  };
}

module.exports = usersService;

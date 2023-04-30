const { Users } = require('../models');

class AuthRepository {

  findOne = async (input) => {
    return await Users.findOne({
      where: input,
      attributes: ["userId", "nickname"],
    });
  }
  
  create = async (input) => {
    await Users.create(input);
  }
}

module.exports = AuthRepository;
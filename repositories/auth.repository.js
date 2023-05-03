class AuthRepository {
  constructor (usersModel) {
    this.usersModel = usersModel;
  }

  findOne = async (input) => {
    return await this.usersModel.findOne({
      where: input,
      attributes: ["userId", "nickname"],
    });
  }
  
  create = async (input) => {
    await this.usersModel.create(input);
  }
}

module.exports = AuthRepository;
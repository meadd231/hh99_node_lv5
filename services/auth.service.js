const AuthRepository = require('../repositories/auth.repository');
const jwt = require("jsonwebtoken");
const { Users } = require('../models');
const AppError = require('../utils/appError');

// 클래스를 정의 Auth 관련 비즈니스 로직이 처리되는 클래스임.
class AuthService {
  authRepository = new AuthRepository(Users);

  sginup = async (input) => {
    const { nickname } = input;
    const userTest = await this.authRepository.findOne({ nickname });
    
    // 중복된 닉네임인지 검사
    if (userTest) {
      throw new AppError(412, '중복된 닉네임입니다.');
    }

    await this.authRepository.create(input);    
  }

  login = async (input) => {
    const user = await this.authRepository.findOne(input);
    if (!user) {
      throw new AppError(412, '닉네임 또는 패스워드를 확인해주세요.');
    }
    return jwt.sign({ userId: user.userId }, "secret_key_hh_node_js");
  }
}

module.exports = AuthService;
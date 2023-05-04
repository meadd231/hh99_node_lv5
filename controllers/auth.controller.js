const AuthService = require('../services/auth.service');
const AppError = require('../utils/appError');

class AuthController {
  authService = new AuthService();

  signup = async (req, res, next) => {
    try {
      const { nickname, password, confirm } = req.body;

      // 닉네임 형식 검사
      const nicknameRegex = /^[a-zA-Z0-9]{3,}$/;
      if (!nicknameRegex.test(nickname)) {
        throw new AppError(412, '닉네임의 형식이 일치하지 않습니다.');
      }
  
      // 비밀번호 형식 검사
      const passwordRegex = /^[a-zA-Z0-9!@#$%^&*()_+]{4,}$/;
      if (!passwordRegex.test(password)) {
        throw new AppError(412, '패스워드 형식이 일치하지 않습니다.');
      }
  
      // 비밀번호에 닉네임이 포함되어 있는지 검사
      if (password.includes(nickname)) {
        throw new AppError(412, '패스워드에 닉네임이 포함되어 있습니다.');
      }
  
      // 비밀번호와 비밀번호 확인 일치 여부 검사
      if (password !== confirm) {
        throw new AppError(412, '패스워드가 일치하지 않습니다.');
      }

      await this.authService.sginup({ nickname, password });
      return res.status(201).json({ message: "회원 가입에 성공하였습니다." });
    } catch (error) {
      next(error, req, res, '회원 가입에 실패하였습니다.');
    }
  }

  login = async (req, res, next) => {
    try {
      const { nickname, password } = req.body;
      const token = await this.authService.login({ nickname, password });
      res.cookie("Authorization", `Bearer ${token}`);
      res.status(200).json({ token });
    } catch (error) {
      next(error, req, res, '로그인에 실패하였습니다.');
    }
  }
}

module.exports = AuthController;
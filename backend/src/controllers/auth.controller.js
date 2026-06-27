const authService = require('../services/auth.service');

class AuthController {
  async register(req, res, next) {
    try {
      const data = await authService.register(req.body);

      res.status(201).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const data = await authService.login(email, password);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async me(req, res, next) {
    try {
      const { userId, email, role } = req.user;

      res.status(200).json({
        success: true,
        data: {
          userId,
          email,
          role,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();

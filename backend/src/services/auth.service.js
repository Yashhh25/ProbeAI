const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const userRepository = require('../repositories/user.repository');
const { generateToken } = require('../utils/jwt');

class AuthService {
  async register(userData) {
    const existingUser = await userRepository.findByEmail(userData.email);

    if (existingUser) {
      throw new Error('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    const token = generateToken({
      userId: user._id,
      email: user.email,
      role: user.role,
    });

    return { user, token };
  }

  async login(email, password) {
    const user = await userRepository.findByEmailWithPassword(email);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const token = generateToken({
      userId: user._id,
      email: user.email,
      role: user.role,
    });

    return { user: user.toJSON(), token };
  }
}

module.exports = new AuthService();

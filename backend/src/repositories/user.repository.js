const User = require('../models/user.model');

class UserRepository {
  create(userData) {
    return User.create(userData);
  }

  findById(userId) {
    return User.findById(userId);
  }

  findByEmail(email) {
    return User.findOne({ email });
  }

  findByEmailWithPassword(email) {
    return User.findOne({ email }).select('+password');
  }

  updateById(userId, updateData) {
    return User.findByIdAndUpdate(userId, updateData, { new: true,runValidators: true,});
  }

  deleteById(userId) {
    return User.findByIdAndDelete(userId);
  }
}

module.exports = new UserRepository();

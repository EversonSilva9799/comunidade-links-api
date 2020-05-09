import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import authConfig from './../../config/secretToken';

const User = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'USER',
      enum: ['USER', 'ADMIN', 'GESTOR'],
    },
  },
  {
    timestamps: true,
  }
);

User.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 8);
});

User.statics.generateToken = ({ _id, nome, role }) => {
  return jwt.sign({ _id, nome, role }, authConfig.secretKey, {
    expiresIn: authConfig.expiresIn,
  });
};

User.methods = {
  checkPassword(password) {
    return bcrypt.compare(password, this.password);
  },
};

export default mongoose.model('User', User);
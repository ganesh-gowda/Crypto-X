import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    verificationTokenExpires: {
      type: Date,
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorSecret: {
      type: String,
    },
    backupCodes: [{
      code: String,
      used: {
        type: Boolean,
        default: false,
      },
    }],
    portfolio: [
      {
        coinId: String,
        amount: Number,
        purchasePrice: Number,
        purchaseDate: String,
      },
    ],
    alerts: [
      {
        coinId: String,
        targetPrice: Number,
        condition: {
          type: String,
          enum: ['above', 'below'],
        },
        triggered: {
          type: Boolean,
          default: false,
        },
        triggeredAt: Date,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    watchlist: [
      {
        coinId: String,
        coinName: String,
        coinSymbol: String,
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    savedFilters: [
      {
        name: String,
        filters: {
          type: Object,
          default: {},
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;

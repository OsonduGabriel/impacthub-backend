import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const NGO = sequelize.define('NGO', {
  name: { type: DataTypes.STRING, allowNull: false },
  registrationNumber: { type: DataTypes.STRING, allowNull: true },
  contactPerson: { type: DataTypes.STRING, allowNull: false },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  phone: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.STRING, allowNull: false },
  verificationStatus: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending',
  },
  verificationDocuments: { type: DataTypes.STRING, allowNull: true },
  userId: { type: DataTypes.UUID, allowNull: false, unique: true },
}, {
  tableName: 'ngos',
  timestamps: true,
});

export default NGO;
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Contribution = sequelize.define('Contribution', {
  opportunityId: { type: DataTypes.INTEGER, allowNull: false },
  volunteerId: { type: DataTypes.UUID, allowNull: false },
  hoursLogged: { type: DataTypes.FLOAT, allowNull: false },
  evidence: { type: DataTypes.STRING, allowNull: true },
  status: {
    type: DataTypes.ENUM('pending', 'verified', 'rejected'),
    defaultValue: 'pending',
  },
}, {
  tableName: 'contributions',
  timestamps: true,
});

export default Contribution;
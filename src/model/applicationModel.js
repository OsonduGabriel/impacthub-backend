import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Application = sequelize.define('Application', {
  opportunityId: { type: DataTypes.INTEGER, allowNull: false },
  volunteerId: { type: DataTypes.UUID, allowNull: false },
  status: {
    type: DataTypes.ENUM('submitted', 'under_review', 'accepted', 'rejected', 'withdrawn'),
    defaultValue: 'submitted',
  },
}, {
  tableName: 'applications',
  timestamps: true,
});

export default Application;

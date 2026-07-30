import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Opportunity = sequelize.define('Opportunity', {
  ngoId : {type: DataTypes.INTEGER, allowNull: false},
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: true },
  location: { type: DataTypes.STRING, allowNull: true },
  date: { type: DataTypes.DATE, allowNull: true },
  capacity: { type: DataTypes.INTEGER, allowNull: true },
  applicationDeadline: { type: DataTypes.DATE, allowNull: true },
  requiredSkills: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
  duration: { type: DataTypes.STRING, allowNull: true },        // e.g. "6 Months"
  timeCommitment: { type: DataTypes.STRING, allowNull: true },  // e.g. "10 hrs/week"
  compensation: { type: DataTypes.STRING, allowNull: true },    // e.g. "Unpaid (Stipend provided)"
  status: {
    type: DataTypes.ENUM('draft', 'published', 'open', 'closed', 'archived'),
    defaultValue: 'draft',
  },
}, {
  tableName: 'opportunities',
  timestamps: true,
});

export default Opportunity;
import NGO from './ngoModel.js';
import Opportunity from './opportunityModel.js';
import Application from './applicationModel.js';
import Contribution from './contributionModel.js';
import User from './userModel.js';

NGO.hasMany(Opportunity, { foreignKey: 'ngoId', onDelete: 'CASCADE' });
Opportunity.belongsTo(NGO, { foreignKey: 'ngoId' });

Opportunity.hasMany(Application, { foreignKey: 'opportunityId', onDelete: 'CASCADE' });
Application.belongsTo(Opportunity, { foreignKey: 'opportunityId' });

Opportunity.hasMany(Contribution, { foreignKey: 'opportunityId', onDelete: 'CASCADE' });
Contribution.belongsTo(Opportunity, { foreignKey: 'opportunityId' });

User.hasMany(Application, { foreignKey: 'volunteerId' });
Application.belongsTo(User, { foreignKey: 'volunteerId', as: 'volunteer' });

User.hasMany(Contribution, { foreignKey: 'volunteerId' });
Contribution.belongsTo(User, { foreignKey: 'volunteerId', as: 'volunteer' });

export { NGO, Opportunity, Application, Contribution };
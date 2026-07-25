import NGO from './ngoModel.js';
import Opportunity from './opportunityModel.js';

NGO.hasMany(Opportunity, { foreignKey: 'ngoId', onDelete: 'CASCADE' });
Opportunity.belongsTo(NGO, { foreignKey: 'ngoId' });

export { NGO, Opportunity };
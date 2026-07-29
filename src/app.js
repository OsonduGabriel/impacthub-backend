import express from 'express';
import sequelize from './config/database.js';
import './model/associations.js';
import ngoRoute from './routes/ngoRoute.js';
import opportunityRoute from './routes/opportunityRoute.js';
import applicationRoute from './routes/applicationRoute.js';
import contributionRoute from './routes/contributionRoute.js';
const app = express();

app.use(express.json()); // lets Express read JSON bodies from POST/PUT requests

app.use('/ngo', ngoRoute);
app.use('/contributions', contributionRoute);
app.use('/applications', applicationRoute);
app.use('/opportunities', opportunityRoute);


sequelize.sync({ alter: true })
  .then(() => console.log('models synced'))
  .catch(err => console.error('sync failed:', err));

sequelize.authenticate()
  .then(() => console.log('Database connected'))
  .catch(err => console.error('connection failed:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

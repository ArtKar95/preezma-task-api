const express = require('express');
const mongoose = require('mongoose');
cors = require('cors');
const envPath = './config/.env';
require('dotenv').config({ path: envPath });
const swaggerUi = require('swagger-ui-express');
swaggerDocument = require('./swagger.json');

const app = express();
app.use(cors());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json({ extended: true }));
app.use('/api',require('./routes/clients.routes'));
app.use('/api', require('./routes/providers.routes'));

let port = process.env.PORT || 3001;
let mongourl = process.env.MONGO_API;
async function start() {
  try {
    await mongoose.connect(mongourl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    app.listen(port, () =>
      console.log(`App has been started on port ${port}...`)
    );
  } catch (e) {
    console.log('Server error', e.message);
    process.exit(1);
  }
}

start();

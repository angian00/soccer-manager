const express = require('express');
const app = express();

app.use(express.json());

const cors = require('cors');
app.use(cors());

const morgan = require('morgan');
app.use(morgan('dev'));


const routes = require('./routes/soccerRoutes');
routes(app);

port = process.env.PORT || 8080;
app.listen(port, () => console.log('soccer-manager server running on Port 3000'))

const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DATABASE = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DATABASE, {
    keepAlive: true,
    useNewUrlParser: true,
  })
  .then(() => console.log('DB connected successfully!'));

// if (process.env.NODE_ENV === 'development') {
//     dotenv.config({ path: './config.dev.env' });
// } else if (process.env.NODE_ENV === 'production') {
//     dotenv.config({ path: './config.prod.env' });
// }

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1); // unhandledRejection
    // process.exit(0);  successfully
  });
});

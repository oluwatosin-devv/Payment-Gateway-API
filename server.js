if (process.env.NODE_ENV !== 'production' && !process.env.CI) {
  require('dotenv').config({ path: '.env' });
}

const app = require('./app');

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App running on port: ${port}`);
});

// app.js
const express = require('express');
const i18n = require('i18n');
const faqRoutes = require('./components/faqRoutes');

const app = express();
const port = 3000;

// Initialize i18n
i18n.configure({
  locales: ['en', 'hi', 'bn'],
  directory: __dirname + '/locales',
  defaultLocale: 'en',
  queryParameter: 'lang'
});

app.use(i18n.init);
app.use(express.json());
app.use('/api', faqRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const express = require('express');
const commentRoutes = require('./package.jsonroutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/comments', commentRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const routes = require('./routes');

// Middleware to parse JSON bodies
app.use(express.json());

// Mount routes
app.use('/', routes);


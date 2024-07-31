// var http = require('http');
// var server = http.createServer(function(req, res) {
//     res.writeHead(200, {'Content-Type': 'text/plain'});
//     var message = 'It works!\n',
//         version = 'NodeJS ' + process.versions.node + '\n',
//         response = [message, version].join('\n');
//     res.end(response);
// });
// server.listen();

const express = require('express'); // Import Express framework
const bodyParser = require('body-parser'); // Import body-parser to parse JSON requests
const { Sequelize, DataTypes } = require('sequelize'); // Import Sequelize and data types

const app = express();
app.use(bodyParser.json()); // Use body-parser middleware to parse JSON requests

// Set up Sequelize connection to MySQL database
const sequelize = new Sequelize('weddcchi_test', 'weddcchi_test', '@@VapoRub2018@@', {
  host: 'localhost',
  dialect: 'mysql'
});

// Define the Test model with 'name' and 'description' fields
const Test = sequelize.define('Test', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING
  }
}, {});

// Create a new test entry
app.post('/test', async (req, res) => {
  try {
    const test = await Test.create(req.body); // Create a new entry in the Test table
    res.status(201).json(test); // Respond with the created entry
  } catch (error) {
    res.status(400).json({ error: error.message }); // Handle any errors
  }
});

// Get all test entries
app.get('/test', async (req, res) => {
  try {
    const tests = await Test.findAll(); // Retrieve all entries from the Test table
    res.json(tests); // Respond with the list of entries
  } catch (error) {
    res.status(400).json({ error: error.message }); // Handle any errors
  }
});

// Get a single test entry by ID
app.get('/test/:id', async (req, res) => {
  try {
    const test = await Test.findByPk(req.params.id); // Find an entry by primary key (ID)
    if (test) {
      res.json(test); // Respond with the found entry
    } else {
      res.status(404).json({ error: 'Test not found' }); // Respond with an error if not found
    }
  } catch (error) {
    res.status(400).json({ error: error.message }); // Handle any errors
  }
});

// Update a test entry by ID
app.put('/test/:id', async (req, res) => {
  try {
    const [updated] = await Test.update(req.body, { // Update an entry by primary key (ID)
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedTest = await Test.findByPk(req.params.id); // Retrieve the updated entry
      res.json(updatedTest); // Respond with the updated entry
    } else {
      res.status(404).json({ error: 'Test not found' }); // Respond with an error if not found
    }
  } catch (error) {
    res.status(400).json({ error: error.message }); // Handle any errors
  }
});

// Delete a test entry by ID
app.delete('/test/:id', async (req, res) => {
  try {
    const deleted = await Test.destroy({ // Delete an entry by primary key (ID)
      where: { id: req.params.id }
    });
    if (deleted) {
      res.json({ message: 'Test deleted' }); // Respond with a success message
    } else {
      res.status(404).json({ error: 'Test not found' }); // Respond with an error if not found
    }
  } catch (error) {
    res.status(400).json({ error: error.message }); // Handle any errors
  }
});

// Root route
app.get('/', async (req, res) => {
    res.send(`
        WElCOME
    `)
})

// Sync the database and start the server
const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); // Start the server on the specified port
  });
}).catch((error) => {
  console.error('Unable to connect to the database:', error); // Handle any connection errors
});

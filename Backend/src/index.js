const express = require('express');
const cassandra = require('cassandra-driver');
const router = express.Router();
require('dotenv').config();

const app = express(); // Create Express app

// Add middleware to parse JSON request bodies
app.use(express.json());

const cluster = new cassandra.Client({
    contactPoints: ["node-0.aws-us-east-1.7cc8effec404e61d6bba.clusters.scylla.cloud", "node-1.aws-us-east-1.7cc8effec404e61d6bba.clusters.scylla.cloud", "node-2.aws-us-east-1.7cc8effec404e61d6bba.clusters.scylla.cloud"],
    localDataCenter: 'AWS_US_EAST_1',
    credentials: { username: 'scylla', password: 'Cydn4xv26tGScbN' },
    keyspace: 'todokeyspace'
});

// Fetch users
router.get('/users', async (req, res) => {
    try {
        const result = await cluster.execute('SELECT * FROM users');
        const users = result.rows.map(row => ({
            id: row.id,
            name: row.name
        }));
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Fetch datas
router.get('/datas', async (req, res) => {
    try {
        const result = await cluster.execute('SELECT * FROM datas');
        const datas = result.rows.map(row => ({
            id: row.id,
            name: row.name
        }));
        res.json(datas);
    } catch (error) {
        console.error('Error fetching datas:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/userrating_new', async (req, res) => {
    try {
        console.log('Request Body:', req.body); // Log request body for debugging

        const dataid = Number(req.body.dataid);
        console.log('Dataid type:', typeof dataid); // Log dataid type for debugging
        console.log('Dataid value:', dataid); // Log dataid value for debugging

        const userid = parseInt(req.body.userid);
        const description = req.body.description;
        const rating = parseInt(req.body.rating);

        // Check data types and validity of fields
        if (isNaN(dataid) || isNaN(userid) || !description || isNaN(rating)) {
            throw new Error('Missing or invalid fields in the request body');
        }

        // Insert the data into the userrating_new table
        const query = 'INSERT INTO userrating_new (dataid, userid, description, rating) VALUES (?, ?, ?, ?)';
        await cluster.execute(query, [dataid, userid, description, rating]);

        res.status(200).json({ message: 'User rating added successfully' });
    } catch (error) {
        console.error('Error adding user rating:', error);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});




// Fetch data ratings
router.get('/dataratings', async (req, res) => {
    try {
        // Query the userrating_new table to calculate average ratings (updated table name)
        const result = await cluster.execute('SELECT dataid, AVG(rating) AS avg_rating FROM userrating_new GROUP BY dataid');

        // Extract the results and format them
        const dataRatings = result.rows.map(row => ({
            dataid: row.dataid,
            rating: row.avg_rating
        }));

        // Now fetch ratingoutof column from datarating table
        const ratingOutOfResult = await cluster.execute('SELECT dataid, ratingoutof FROM datarating');

        // Create a map to store ratingoutof values for each dataid
        const ratingOutOfMap = new Map();

        // Populate ratingoutof map
        ratingOutOfResult.rows.forEach(row => {
            ratingOutOfMap.set(row.dataid, row.ratingoutof);
        });

        // Combine the average ratings and ratingoutof values
        const combinedDataRatings = dataRatings.map(row => ({
            dataid: row.dataid,
            rating: row.rating,
            ratingoutof: ratingOutOfMap.get(row.dataid) || null
        }));

        res.json(combinedDataRatings);
    } catch (error) {
        console.error('Error fetching data ratings:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.use('/api', router);

// Start listening on port 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

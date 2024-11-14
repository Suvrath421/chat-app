require('dotenv').config(); // Add this line at the top of your file

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { OpenAI } = require('openai');
const neo4j = require('neo4j-driver');
const aws = require('aws-sdk');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());

// OpenAI configuration
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Neo4j configuration
const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);
const session = driver.session();

// AWS SDK configuration
aws.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
const lambda = new aws.Lambda();

app.use(bodyParser.json());

app.post('/api/explore', (req, res) => {
    const params = {
        FunctionName: 'ExplorePage', // Ensure this is the correct name of your Lambda function
        InvocationType: 'RequestResponse', // This ensures that Lambda returns the result
        Payload: JSON.stringify(req.body) // Forward the request body directly
    };

    console.log('Invoking Lambda with params:', params); // Debugging line

    lambda.invoke(params, (err, data) => {
        if (err) {
            console.error("Error invoking Lambda function:", err);
            return res.status(500).send({ error: 'Error invoking Lambda function', details: err });
        } else {
            try {
                const responsePayload = JSON.parse(data.Payload);
                console.log('Lambda response:', responsePayload); // Debugging line
                if (responsePayload.statusCode !== 200) {
                    throw new Error(`Lambda error: ${responsePayload.body}`);
                }
                const responseBody = JSON.parse(responsePayload.body);
                res.send(responseBody);
            } catch (error) {
                console.error("Error parsing Lambda response:", error);
                res.status(500).send({ error: 'Error parsing Lambda response', details: error });
            }
        }
    });
});



app.use(express.json());

app.post('/api/validate', async (req, res) => {
    const { apiKey } = req.body;
  
    try {
      // Validate Canvas API key
      const response = await axios.get('https://canvas.instructure.com/api/v1/users/self', {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });
  
      if (response.status === 200) {
        const userData = response.data;
  
        // Call AWS Lambda function
        const params = {
          FunctionName: 'MultipleAPIChat', // Ensure this is the correct name of your Lambda function
          InvocationType: 'RequestResponse', // This ensures that Lambda returns the result
          Payload: JSON.stringify({ query: `This is the canvas api_key: ${apiKey}. Based on the student's courses, what subjects and topics would they be interested in? For each subject, give me 4 more related topics to each one. And add all of these into a singular array. DONT add any tags or headers in front of the answer`}) // Forward necessary data
        };
  
        console.log('Invoking Lambda with params:', params); // Debugging line
  
        lambda.invoke(params, (err, data) => {
            if (err) {
              console.error("Error invoking Lambda function:", err);
              return res.status(500).send({ error: 'Error invoking Lambda function', details: err });
            } else {
              try {
                const responsePayload = JSON.parse(data.Payload);
                console.log('Lambda response:', responsePayload); // Debugging line
                if (responsePayload.statusCode !== 200) {
                  throw new Error(`Lambda error: ${responsePayload.body}`);
                }
                const recommendations = JSON.parse(responsePayload.body);
                console.log('Recommendations:', recommendations);
                // Send the user data and recommendations back to the frontend
                res.send({ userData, recommendations });
              } catch (error) {
                console.error("Error parsing Lambda response:", error);
                res.status(500).send({ error: 'Error parsing Lambda response', details: error });
              }
            }
          });
      } else {
        res.status(response.status).send('Invalid API key');
      }
    } catch (error) {
      console.error('Error validating API key:', error);
      res.status(500).send('Internal Server Error');
    }
  });


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

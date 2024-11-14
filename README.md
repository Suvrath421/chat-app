# Getting Started with Club Connect
(https://club-connect-chat-229ce385454f.herokuapp.com/)


## Overview
This project is a comprehensive web application designed to help students discover university clubs and organizations tailored to their interests. The application includes a custom web scraper, a Neo4j-powered database, a chatbot interface, server-side routing with Express, and a responsive frontend built with React and Tailwind CSS.

## Key Features
- **Custom Web Scraper**: Built with Selenium and ChromeDriver to extract data from [terplink.umd.edu](https://terplink.umd.edu), ensuring up-to-date information on university clubs and organizations.
- **Data Storage and Processing**: Extracted data is stored in CSV format and then converted into batch documents for further processing.
- **Neo4j Graph Database**: Data is stored in a graph database using Neo4j, where each club/organization is connected based on three main subject areas. Properties for nodes and edges were enriched with the help of the GPT-4-mini model.
- **Express Middleware**: Used Express as the middleware to handle server-side requests across the application. This includes routing, request handling, and integration with backend services like AWS Lambda and Neo4j database.
- **AWS Lambda Integration**: Python scripts running on AWS Lambda handle interactions with the Neo4j database. These functions facilitate data retrieval for the explore page and chatbot responses.
- **LangChain Utilization**: LangChain is employed to integrate language model capabilities and facilitate graph database interactions for extracting relevant information.
- **React Frontend**: A dynamic, responsive website built using React and styled with Tailwind CSS.
- **Explore Page**: Users can discover infinite clubs and organizations using Neo4j as a vector database. The data is retrieved via an AWS Lambda function to ensure a fast and scalable experience.
- **Chat Page**: A simple query-response chatbot feature that leverages an AWS Lambda function to provide information about the clubs on campus. Note: The chatbot does not currently support memory of previous conversations; each query is treated independently.

## Project Workflow
1. **Web Scraping**:
   - Created a custom scraper using **Selenium** and **ChromeDriver** to collect data from [terplink.umd.edu](https://terplink.umd.edu).
   - The collected data was stored in CSV format and later converted into batch documents for graph database insertion.

2. **Data Storage and Graph Creation**:
   - Used **LangChain** and **GPT-4-mini** to transform batch documents into nodes with detailed properties.
   - Uploaded and structured the data in **Neo4j**, where nodes represent clubs/organizations and edges signify relationships based on shared subject areas.

3. **Server-Side Middleware with Express**:
   - Implemented **Express** as the middleware for handling server-side routing, managing API requests, and integrating with backend services. Express routes were used to process user requests, call AWS Lambda functions, validate API keys, and interact with the Neo4j database.
   - This middleware ensured efficient handling of HTTP requests, cross-origin resource sharing (CORS), and JSON parsing for seamless server-client communication.

4. **AWS Lambda Functions**:
   - Wrote Python scripts for AWS Lambda to query the Neo4j database through LangChain.
   - The functions were designed to handle requests from the web app for both the explore page and the chatbot feature.

5. **Web Development**:
   - Built a modern, user-friendly web application using **React** for frontend development and **Tailwind CSS** for styling.
   - The explore page integrates seamlessly with the Neo4j database, providing endless recommendations of clubs and organizations.
   - The chat page allows users to ask questions and receive information about university clubs, facilitated by an AWS Lambda function. Each query is treated as a new request due to the lack of conversation memory.

## Limitations
- The chatbot currently lacks conversation memory, meaning each query is handled as a standalone interaction without context from previous messages.

## Future Improvements
- Implementing conversation memory for the chatbot to allow more dynamic and context-aware interactions.
- Enhancing data extraction and enrichment processes to include more detailed club information and relationships.

## Technologies Used
- **Web Scraper**: Selenium, ChromeDriver
- **Data Storage**: CSV, Batch documents
- **Graph Database**: Neo4j
- **Language Processing**: LangChain, GPT-4-mini
- **Server Middleware**: Express.js
- **Backend Services**: AWS Lambda (Python scripts)
- **Frontend**: React, Tailwind CSS
- **APIs**: Custom integrations for AWS Lambda functions

## Getting Started
Clone the repository into your local files and run npm install to download all the necessary packages. The run node server.js and npm start to start the localhost and node server software.

## Contributing
Contributions are welcome! Please submit a pull request or reach out with ideas for improving the project.

## License
This project is licensed under the MIT License. See `LICENSE` for more details.

## Contact
For more information, please reach out to [Suvrath] at [suvrathc@gmail.com].

<h1 align="center">
🌐 MERN Stack 
</h1>
<h1>COVID-19 Tracker
</h1>
<p align="center">
MongoDB, Expressjs, React, Nodejs
</p>

> Track and visualize the latest COVID-19 data with my MERN (MongoDB, Express.js, React.js, Node.js) stack-based application. Stay informed about the global pandemic's impact on different countries, explore historical data, and gain insights through interactive charts and maps. The project integrates real-time data from reliable sources, providing a comprehensive tool for monitoring and understanding the ongoing situation.

## clone or download

```terminal
$ git clone https://github.com/Kledis98/Covid-19-Mern.git
```

# Usage (run fullstack app on your machine)

## Prerequisites

- [MongoDB]
- [Node]
- [npm]

## Connect to MongoDB

Use scripts on server.js to fetch data from 2 free API's provided by https://disease.sh, and store the data in your database.

---

This is the API from which I fetch the data => https://disease.sh/v3/covid-19/historical?lastdays=365
I have 365 days worth of data for each country. ( You can modify it as you like for ex: lastdays=50)
The last updated date is 9 March 2023, so using lastdays=365 I have data from
10 March 2022 - 9 March 2023.

---

Use scripts to create an admin user in DB who will be able to perform CRUD operations, and do not forget to put the username and the password inside the .env file.
Update .env file

```
$ MONGO_URI= <yourMongoDB link>
```

## Server-side usage(PORT: 5000)

### Start

Create a .env file and define the PORT there.

```
$ PORT=5000
```

```terminal
$ cd backend   // go to server folder
$ npm i       // npm install packages
$ npm run server // run it locally
```

notice, you need backend and frontend runs concurrently in different terminal session, in order to make them talk to each other

## Client-side usage(PORT: 3000)

```terminal
$ cd frontend          // go to client folder
$ yarn # or npm i    // npm install packages
$ npm start        // run it locally

```

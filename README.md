This README file provides information on setting up and running the project built with NestJS, Prisma, Docker, and GraphQL.

## Project Overview

This project utilizes the following technologies:

NestJS: A progressive Node.js framework for building efficient and scalable server-side applications.

Prisma: An ORM (Object-Relational Mapping) tool that simplifies database access and management.

Docker: A containerization platform used to create isolated environments for running applications.

GraphQL: A query language and runtime for APIs, providing an efficient and flexible approach to data fetching and manipulation.

### Prerequisites

Before running the project, ensure that you have the following prerequisites installed:

Node.js and npm: Install the latest stable versions of Node.js and npm from the official website: https://nodejs.org

Docker: Install Docker from the official website, following the instructions specific to your operating system: https://docs.docker.com/engine/install/

## Getting Started

To set up and run the project, follow the steps below:

Clone the project repository to your local machine.
Open a terminal and navigate to the project's root directory.

### Step 1: Install Dependencies

Run the following command to install the required dependencies, including Prisma:

```bash
npm install
```

### Step 2: Set up Docker

Since this project uses PostgreSQL as the database, we will use Docker to create an instance of a PostgreSQL database. Make sure Docker is installed and set up on your machine by following the instructions provided in the official Docker documentation: https://docs.docker.com/engine/install/

### Step 3: Configure the Database Connection

If a .env file does not exist in the project's root directory, create one. Inside the .env file, add the following property:

DATABASE_URL="postgresql://dbuser:dbpassword@localhost:5432/dbname?schema=public"
Replace the credentials, 'dbuser', 'dbpassword', and 'dbname' with the those of your PostgreSQL database. Prisma will use this URL to establish a connection with the database.

### Step 4: Start the NestJS Application

To start the NestJS application in development mode, run the following command:

```bash
$ npm run start:dev
```

By default, the application will run on port 3000. If port 3000 is already occupied by another application, you can change the port in the main.ts file.

### Step 5: Start the PostgreSQL Database

To spin up an instance of the PostgreSQL database using Docker, run the following command:

```bash
docker compose up
```

Make sure Docker is installed globally on your machine. If not, refer back to Step 2 for installation instructions.

### Step 6: Run Database Migrations

To update the database schema and apply any pending migrations, run the following command:

```bash
npx prisma migrate dev --name init
```

The --name flag allows you to specify a custom name for the migration. The example above uses the name init since it's the first migration being run, but you can choose any descriptive name that reflects the changes being made in the migration.

### Step 7: Visualize the Database Schema

To view a visualization of the database schema and explore the tables and relationships, run the following command:

```bash
npx prisma studio
```

This will open Prisma Studio in your default web browser.

### Step 8: Run Tests

To execute the tests for the Todo resolvers, run the following command in the terminal:

```bash
npm run test
```

This command will execute five tests for the Todo resolver and one test for the Prisma service. For more detailed information on the resolver tests, navigate to the src/todo/todo.resolver.spec.ts file

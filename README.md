# plan-it
# Plan-It: A Simple Todo Application

A full-stack web application for managing tasks (todos), built with Angular (frontend) and Node.js/Express/MongoDB (backend). This project demonstrates CRUD operations, modern Angular features like Signals, and backend API integration using the `Workspace` API.

## Features

* **Add Todos:** Create new tasks with a title and description.
* **View Todos:** Display the list of current tasks.
* **Update Todos:**
    * Mark todos as complete or active (toggle).
    * Edit todo title and description in-place.
* **Delete Todos:** Remove tasks individually.
* **Filter Todos:** View All, Active, or Completed tasks.
* **Todo Count:** Display the number of active items remaining.
* **Toggle All:** Mark all visible todos as complete or active simultaneously.
* **Persistence:** Data is saved to a MongoDB database.

## Technologies Used

**Frontend:**

* Angular (v16+ likely, utilizes Signals and `model()`)
* TypeScript
* HTML5
* CSS3
* `Workspace` API (for backend communication)

**Backend:**

* Node.js
* Express.js
* Mongoose (ODM for MongoDB)
* `cors` middleware

**Database:**

* MongoDB

## Prerequisites

Before you begin, ensure you have met the following requirements:

* **Node.js & npm (or yarn):** Download and install Node.js (which includes npm) from [nodejs.org](https://nodejs.org/).
* **Angular CLI:** Install globally using `npm install -g @angular/cli`.
* **MongoDB:** You need a running MongoDB instance. You can:
    * Install it locally ([MongoDB Community Server](https://www.mongodb.com/try/download/community)).
    * Use a cloud service like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

## Project Structure (From Angular and Node Documentation following right standards)
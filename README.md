# Veff2-Hopverkefni1
 

Recommended Tools & Technologies
Backend Framework:

Use Express or Hono for setting up your REST API endpoints. Both are mature and will allow you to easily implement middleware for validation, error handling, and JWT-based authentication.
Database:

Use PostgreSQL as required. Consider using an ORM like Prisma to simplify writing SQL queries, managing migrations, and enforcing schema constraints (primary keys, foreign keys, unique fields, etc.).
Authentication & Authorization:

Implement JWT tokens for managing sessions and securing endpoints.
Use libraries such as jsonwebtoken for token handling.
Image Upload/Management:

Integrate with Cloudinary or imgix for handling image uploads and storage.
Alternatively, if you prefer video support, you can consider using Mux.
Testing & Code Quality:

Set up Jest for unit and integration tests.
Use ESLint for linting to maintain code quality across your project.
Version Control & Collaboration:

Use Git and GitHub for version control.
Follow best practices by making regular commits and using pull requests (at least five PRs, with peer reviews).
Project Setup & Order of Implementation
Planning & Design (Week 1):

Define the Project Scope: Identify which functionalities you want to include based on the assignment requirements.
Database Schema Design:
Design at least six tables with appropriate relationships (primary keys, foreign keys, unique constraints, and proper data types).
Decide on sample data (at least 50 records overall). Consider using tools like Faker to generate test data.
API Endpoint Mapping:
Sketch out all your REST endpoints (GET, POST, PUT, DELETE) ensuring you cover:
A landing endpoint (GET /) listing available routes.
Pagination for responses returning more than 10 entries.
Proper error handling for 400, 401, 404, etc.
Environment Setup (Week 1):

Repository & Git:
Create your GitHub repository.
Set up a basic project structure with separate folders for controllers, routes, models, middleware, etc.
Tooling:
Initialize your Node.js project.
Install ESLint and configure your linting rules.
Set up Jest for testing.
Database & Models (Week 2):

Database Connection:
Set up the PostgreSQL database (locally or via a hosted service if needed).
ORM Integration (Optional):
Configure Prisma (or use direct SQL queries if preferred).
Create migrations for your schema and seed the database with test data.
API Endpoints & Business Logic (Week 2-3):

Core REST API:
Build endpoints for CRUD operations following the assignment’s validation, sanitization, and error-handling requirements.
User Management:
Implement registration and login endpoints.
Add middleware for JWT authentication.
Differentiate between regular users (limited actions) and admin users (full CRUD privileges).
Note: Create an initial admin account with the provided credentials (admin/yourPassword – document the password in your README as required).
Image/Media Uploads (Week 3):

Integrate Cloudinary or imgix for handling image uploads.
Validate mime types so that only jpg/jpeg and png files are accepted.
Optionally, if you choose to support videos, integrate with Mux.
Testing & Quality Assurance (Week 3-4):

Write tests (at least for four endpoints) with one requiring authentication and one involving data submission.
Run ESLint to ensure there are no linting errors.
Document your tests and how to run them in the README.
Deployment & Final Touches (Week 4):

Deploy your service using platforms like Render, Railway, or Heroku.
Ensure that your GitHub repository is public (or that the instructors have access) with complete commit history and at least five peer-reviewed pull requests.
Update the README with setup instructions, test examples, and your team members’ GitHub usernames.
Splitting the Work & Timeframe Suggestions
With two team members, you can consider dividing the work into two main areas:

Developer A (Backend & Database):

Database Design & Integration: Define the schema, set up PostgreSQL, and configure ORM.
Core API Endpoints: Implement CRUD operations and ensure proper error handling and pagination.
Testing (Database & Endpoints): Write tests for the endpoints you create.
Developer B (User Management, Authentication & Media Handling):

User Management & Authentication: Implement registration, login, JWT middleware, and admin vs. user roles.
Image/Media Upload Integration: Set up and integrate Cloudinary/imgix (or Mux for video).
API Documentation & Quality Tools: Work on the README, ensure ESLint is configured, and manage the overall project structure.
Suggested Timeframe (Approximately 4 Weeks)
Week 1:

Planning: Outline the project, decide on tech stack, design database schema, and sketch API endpoints.
Setup: Initialize the project, set up GitHub repo, configure ESLint and Jest.
Week 2:

Database & Core API Development: Build your database models, configure connections, and implement key API endpoints.
Week 3:

User Management & Media Integration: Implement authentication, JWT, and image upload functionality.
Testing: Start writing tests for endpoints and user management functions.
Week 4:

Final Integration & Deployment: Conduct integration tests, fix any issues, and deploy the service.
Documentation: Update the README with setup instructions, test details, and team member info.
Review & Code Cleanup: Make final commits and prepare for the presentation.

 # hæ


# Voyagr – Travel Experience Sharing 
Voyagr is a web application that allows users to create, share, and explore travel experiences. Users can register for an account, log in, add trips, upload photos, and browse experiences by location or keyword. This is designed to make trips inspirational by showcasing engaging experiences.

## Capabilities: 
- Secure User registration and login with MongoDB 
- API routes for creating, retrieving, and editing trip experiences
- Frontend form submission with real-time backend integration
- Deployment ready for Google Cloud Platform

## Tech Stack 
- Frontend: ReactJS 
- Backend: NodeJS + ExpressJS 
- Database: MongoDB (via Mongoose)
- Deployment: Google Cloud Platform (GCP)

## Voyagr Backend: Local Setup
### Prerequisites 
Before running the project locally, make sure you have:
- Node.js (v18 or later)
- npm (comes with Node)
- A MongoDB Atlas account & cluster access

#### 1. Clone the Repository & install Dependencies
- `git clone https://github.com/Patrick-Culley/voyagr-app.git`
- `cd voyagr-app/backend`
- `nmp install`
- This will install express, mongoose, dotenv, cors (front-end)
#### 2. Create a .env File
- Inside the `backend` folder, create a file called `.env`:
- Add your MongoDB connection string and server port: 
```
MONGO_URI=<your MongoDB connection string>
PORT=5555
```
- Replace placeholders with your own credentials (see MongoDB Atlas setup)
#### 3. Start the Backend Server 
- Run the backend locally: `node server.js`

## Image Upload Workflow 
1. User uploads image via frontend form 
2. Backend uses Google Cloud Storage to store image.
3. Public URL is saved in MongoDB under `images` field of Experience object 
4. Frontend retrieves/displays via <img src={url}>.


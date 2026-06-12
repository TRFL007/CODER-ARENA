# Coder Arena — Render Deployment Guide

This repository is pre-configured to deploy as a **single, unified Web Service** on Render. In this mode, the Node/Express backend builds and hosts the React/Vite frontend static assets, providing a seamless setup without CORS configurations or separate service cold starts.

---

## Prerequisites

1. A **GitHub** account containing this repository.
2. A **Render** account ([render.com](https://render.com)).
3. A **MongoDB Atlas** account ([mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)) for the database.

---

## Step 1: Set Up MongoDB Atlas

1. **Log in** to MongoDB Atlas.
2. **Create a New Project** (e.g., "Coder Arena").
3. **Build a Database**:
   - Choose the **M0 Free** tier.
   - Select your preferred region (e.g., AWS us-east-1).
   - Click **Create**.
4. **Security Quickstart**:
   - **Database User**: Create a user with a username and password (write this password down!).
   - **IP Access List**: Add `0.0.0.0/0` (allow access from anywhere) so that Render's dynamic IP addresses can access the database.
5. **Get Connection String**:
   - Navigate to your database overview.
   - Click **Connect** -> **Drivers** (Node.js).
   - Copy the connection string (it looks like `mongodb+srv://<username>:<password>@cluster0...mongodb.net/?retryWrites=true&w=majority`).
   - Replace `<password>` with the password you created for the database user.

---

## Step 2: Deploy to Render using Blueprint (Recommended)

1. Log in to your **Render Dashboard**.
2. Click **New +** in the top right and select **Blueprint**.
3. Connect your **GitHub repository**.
4. Render will read the `render.yaml` file in this repository:
   - It will automatically set up the service type, build/start commands, and runtime.
   - It will prompt you for the required environment variables:
     - `MONGO_URI`: Paste your MongoDB Atlas connection string from Step 1.
     - `JWT_SECRET`: Leave blank (Render will auto-generate a secure random key).
     - `GROQ_API_KEY`: (Optional) Paste your Groq API key if you have one.
5. Click **Apply**.
6. Render will build and deploy the project! Once completed, you will receive a public URL (e.g., `https://coder-arena.onrender.com`).

---

## Step 3: Alternative Manual Deployment (Without Blueprint)

If you prefer to configure the service manually on Render:

1. Click **New +** -> **Web Service**.
2. Connect your **GitHub repository**.
3. Set the following configuration fields:
   - **Name**: `coder-arena`
   - **Environment**: `Node`
   - **Region**: Select a region close to your database.
   - **Branch**: `main` (or your active branch)
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
4. Under **Advanced / Environment Variables**, add the following keys:
   - `MONGO_URI`: (Your MongoDB connection string)
   - `JWT_SECRET`: (A random string, e.g. `your-super-secret-key`)
   - `GROQ_API_KEY`: (Optional, your Groq AI key)
   - `JUDGE0_URL`: `https://ce.judge0.com`
   - `NODE_VERSION`: `18`
5. Click **Create Web Service**.

---

## Verification

Once deployed successfully, navigate to your public URL. 
- You should see the Coder Arena dashboard load.
- You can create an account and log in.
- Navigate to the **Multiplayer** section to confirm WebSockets are connecting.

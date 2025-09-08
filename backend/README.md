# Totality Waitlist Backend

This repository contains the backend for the Totality Waitlist project.

## Features
- Store emails in PostgreSQL database
- Send confirmation emails using Resend
- Simple REST API endpoints:
  - `GET /waitlist` → retrieve all emails
  - `POST /waitlist` → add a new email

## Setup
1. Clone the repo
2. Install dependencies: `npm install`
3. Set up `.env` file with your credentials
4. Start the server: `npm run dev` or `node src/index.js`

## License
MIT

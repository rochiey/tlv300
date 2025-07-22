# WHOIS Domain Lookup

A simple web application to look up domain information using the WHOIS API. Built with Node.js backend and React frontend.

## Getting Started

### Prerequisites

- Node.js (14+)
- npm

### Installation

1. Clone the repository
```bash
git clone <repository-url> whois-app
cd whois-app
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

### Get API Key

You'll need a free WHOIS API key from https://user.whoisxmlapi.com/products

Sign up, verify your email, and copy your API key from the dashboard.

### Running the Application

1. Start the backend server (from backend directory):
```bash
cd backend
npm start
```
Server runs on http://localhost:5000

2. Start the frontend (from frontend directory):
```bash
cd frontend
npm start
```
Frontend runs on http://localhost:3000

## Usage

1. Open http://localhost:3000 in your browser
2. Enter your API key
3. Type a domain name (try amazon.com)
4. Select domain info or contact info
5. Click lookup

## API Endpoints

`POST /api/whois`
- domain: string
- type: "domain" or "contact"  
- apiKey: string

Returns domain registration info or contact details.

## Deployment

For production, build the frontend with `npm run build` and serve it with the backend or deploy separately to services like Netlify/Heroku.

## License

MIT

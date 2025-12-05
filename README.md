# HunarmandPro

A Fiverr-like freelance marketplace platform built with React.js and Node.js.

## Features

- **Two User Types**: Seller and Buyer
- **Modern UI**: Blue and white theme
- **Responsive Design**: Works on all devices

## Project Structure

```
hunarmandpro/
├── frontend/          # React.js frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── theme/
│   │   └── App.js
│   └── package.json
├── backend/           # Node.js backend
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   ├── middleware/
│   └── server.js
└── package.json
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install all dependencies:
```bash
npm run install-all
```

2. Set up environment variables:
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your configuration
```

3. Start development servers:
```bash
npm run dev
```

This will start:
- Frontend on http://localhost:3000
- Backend on http://localhost:5000

## Technology Stack

- **Frontend**: React.js, React Router
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (to be configured)

## License

ISC


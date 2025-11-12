# MySafari App

A full-stack web application for safari tour bookings, built with React (frontend) and Node.js/Express (backend).

## Features

- User authentication and authorization
- Safari route management
- Vehicle fleet management
- Booking system for tours
- Admin dashboard for management
- Employee dashboard
- Real-time notifications
- Reporting with charts

## Tech Stack

### Frontend
- React 18
- Vite
- React Router DOM
- Tailwind CSS
- Axios for API calls
- Recharts for data visualization

### Backend
- Node.js
- Express.js
- MongoDB (assumed from models)
- JWT for authentication
- bcrypt for password hashing

### DevOps
- Docker & Docker Compose
- npm for package management

## Project Structure

```
MySafari App/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── api/            # API service functions
│   │   └── main.jsx        # App entry point
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── server/                 # Node.js backend
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── utils/              # Utility functions
│   ├── config/             # Database config
│   ├── server.js           # Server entry point
│   └── package.json
├── docker-compose.yml      # Docker setup
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Docker (optional, for containerized setup)
- MongoDB (if not using Docker)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd MySafari App
   ```

2. Install dependencies for both client and server:
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. Set up environment variables:
   - Copy `server/.env.example` to `server/.env` and fill in your values
   - Copy `client/.env.example` to `client/.env` and fill in your values

4. Start the application:

   **Using Docker (recommended):**
   ```bash
   docker-compose up --build
   ```

   **Manual setup:**
   ```bash
   # Start the server
   cd server
   npm start

   # In another terminal, start the client
   cd client
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173` (or the port specified in your client config)

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Routes
- `GET /api/routes` - Get all routes
- `POST /api/routes` - Create new route (admin)
- `PUT /api/routes/:id` - Update route (admin)
- `DELETE /api/routes/:id` - Delete route (admin)

### Bookings
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking

### Admin
- `GET /api/admin/dashboard` - Admin dashboard data
- `GET /api/admin/users` - Manage users
- `GET /api/admin/vehicles` - Manage vehicles

## Database Seeding

To populate the database with sample data:
```bash
cd server
npm run seed
```

## Building for Production

### Client
```bash
cd client
npm run build
```

### Server
```bash
cd server
npm run build  # if using a build script
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@mysafari.com or join our Slack channel.

## Roadmap

- [ ] Mobile app development
- [ ] Payment integration
- [ ] Multi-language support
- [ ] Advanced reporting features
- [ ] Real-time chat support

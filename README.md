# Assistance KMY - Emergency Ambulance System

> Complete emergency ambulance request and tracking system with Laravel backend and React Native mobile application.

![Project Status](https://img.shields.io/badge/status-MVP%20Complete-success)
![Backend](https://img.shields.io/badge/backend-Laravel%2012-red)
![Frontend](https://img.shields.io/badge/frontend-React%20Native%20(Expo)-blue)

## 📋 Overview

Assistance KMY is a comprehensive emergency medical assistance platform designed for rapid ambulance dispatch and tracking. Built with modern technologies, it provides a seamless experience for both patients and emergency medical services.

### Key Features

✅ **One-Tap SOS Request** - Emergency ambulance request in seconds  
✅ **Real-time Tracking** - Live ambulance location and ETA  
✅ **Admin Dashboard** - Centralized request management  
✅ **Multi-language** - French, English, Arabic with RTL support  
✅ **Role-based Access** - Separate interfaces for users and admins  
✅ **Dark Theme** - Professional medical design optimized for emergencies  
✅ **GPS Integration** - Automatic location detection  
✅ **Secure Authentication** - Laravel Sanctum token-based auth  

## 🏗️ Architecture

```
assistance-kmy/
├── assistance-kmy-backend/     # Laravel REST API
│   ├── app/
│   │   ├── Models/             # User, Demande models
│   │   └── Http/Controllers/   # API controllers
│   ├── database/               # Migrations, Seeders
│   └── routes/api.php         # API routes
│
└── assistance-kmy-mobile/      # React Native App
    ├── src/
    │   ├── screens/           # Home, Admin, Profile, History
    │   ├── components/        # UserForm, MapTracking
    │   ├── services/          # API integration
    │   └── locales/           # Translations (fr, en, ar)
    └── App.js                 # Main app entry point
```

## 🚀 Quick Start

### Prerequisites

- PHP 8.2+, Composer
- Node.js 16+, npm
- MySQL or SQLite
- Expo CLI

### Backend Setup

```bash
cd assistance-kmy-backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan serve
```

**API URL:** `http://localhost:8000/api`

### Mobile App Setup

```bash
cd assistance-kmy-mobile
npm install
# Update API_URL in src/config.js to point to your backend
npx expo start
```

Scan the QR code with Expo Go app on your phone.

## 📱 Screenshots & UI

### Home Screen
- Large centered SOS button with red glow effect
- Service cards showcasing available medical services
- Dark theme with professional medical aesthetic

### Admin Dashboard
- Real-time list of emergency requests
- Status filtering (pending, accepted, done)
- Direct call and status update actions

### Map Tracking
- Full-screen map with patient and ambulance markers
- ETA calculation and distance display
- Live status updates

## 🔐 Authentication

**Test Accounts:**

| Role  | Email | Password |
|-------|-------|----------|
| Admin | admin@assistancekmy.com | password123 |
| User  | user@test.com | password123 |

## 🌍 Multi-language Support

- **🇫🇷 French** (Français) - Default
- **🇬🇧 English**
- **🇸🇦 Arabic** (العربية) - With RTL layout

## 📡 API Endpoints

### Public
- `POST /api/register` - User registration
- `POST /api/login` - Authentication

### Protected (Require Bearer Token)
- `POST /api/demande` - Create SOS request
- `GET /api/demandes` - List all requests
- `GET /api/demandes/{id}` - Get specific request
- `PATCH /api/demandes/{id}/status` - Update status (admin)

## 🗄️ Database Schema

### Users
- id, name, email, password, role (admin/user)

### Demandes
- id, user_id, nom, prenom, telephone, adresse
- latitude, longitude
- status (pending/accepted/done)
- timestamps

## 🛠️ Technology Stack

### Backend
- **Framework:** Laravel 12
- **Authentication:** Laravel Sanctum
- **Database:** MySQL / SQLite
- **API:** RESTful JSON API

### Frontend
- **Framework:** React Native (Expo)
- **Navigation:** React Navigation
- **HTTP Client:** Axios
- **Maps:** React Native Maps
- **Localization:** i18n-js
- **Icons:** MaterialCommunityIcons

## 📦 Project Structure

### Backend Structure
```
app/
├── Models/
│   ├── User.php              # User model with Sanctum
│   └── Demande.php           # SOS request model
├── Http/Controllers/
│   ├── UserController.php    # Auth (register, login)
│   └── DemandeController.php # CRUD operations
database/
├── migrations/               # Database schema
└── seeders/                 # Test data
```

### Frontend Structure
```
src/
├── screens/                 # Main app screens
├── components/              # Reusable components
├── services/api.js         # Backend integration
├── contexts/AuthContext.js # Auth state management
├── locales/                # Translation files
└── config.js               # App configuration
```

## 🧪 Testing

### Backend Testing
```bash
# Run migrations
php artisan migrate:fresh --seed

# Test API with Postman or curl
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@assistancekmy.com","password":"password123"}'
```

### Frontend Testing
1. Open app in Expo Go
2. Test SOS request creation
3. Verify admin dashboard functionality
4. Test map tracking
5. Switch between languages

## 🌐 Deployment

### Backend (Render / DigitalOcean / AWS)
1. Push to Git repository
2. Configure environment variables
3. Run `php artisan migrate --force`
4. Run `php artisan db:seed --force`

### Mobile App
```bash
# Build for Android
npx eas build --platform android

# Build for iOS
npx eas build --platform ios
```

## 📚 Documentation

- **Backend README:** [assistance-kmy-backend/README.md](file:///c:/xampp/htdocs/lambonce2/assistance-kmy-backend/README.md)
- **Mobile README:** [assistance-kmy-mobile/README.md](file:///c:/xampp/htdocs/lambonce2/assistance-kmy-mobile/README.md)
- **Walkthrough:** See complete walkthrough document for detailed implementation guide

## 🔮 Future Enhancements

- [ ] Push notifications (Firebase)
- [ ] Real-time updates (Laravel Echo + Pusher)
- [ ] SMS alerts (Twilio)
- [ ] Driver mobile app for ambulance tracking
- [ ] Rating and feedback system
- [ ] Analytics dashboard
- [ ] Offline mode support

## 🤝 Contributing

This is a private project for Assistance KMY.

## 📄 License

Private - Assistance KMY © 2025

## 📞 Support

For issues or questions, contact the development team.

---

**Built with ❤️ for emergency medical services**

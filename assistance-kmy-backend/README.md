# Assistance KMY - Backend API

Laravel-based REST API for the Assistance KMY emergency ambulance application.

## Features

- **User Authentication** - Register/Login with Laravel Sanctum
- **SOS Requests Management** - Create and track emergency requests
- **Role-Based Access Control** - Admin and User roles
- **RESTful API** - JSON API endpoints
- **Database Migrations** - MySQL/SQLite support

## Requirements

- PHP 8.2 or higher
- Composer
- MySQL 5.7+ or SQLite
- Laravel 12.x

## Installation

### 1. Install Dependencies

```bash
composer install
```

### 2. Configure Environment

Copy the `.env.example` file to `.env` and configure your database:

```bash
copy .env.example .env
```

For MySQL, update these lines in `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=assistance_kmy
DB_USERNAME=root
DB_PASSWORD=your_password
```

For SQLite (default - good for development):
```env
DB_CONNECTION=sqlite
```

### 3. Generate Application Key

```bash
php artisan key:generate
```

### 4. Run Migrations

```bash
php artisan migrate
```

### 5. Seed Database (Optional)

To create test users (admin and regular user):

```bash
php artisan db:seed
```

**Test Credentials:**
- Admin: `admin@assistancekmy.com` / `password123`
- User: `user@test.com` / `password123`

### 6. Start Development Server

```bash
php artisan serve
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Public Endpoints

#### Register User
```http
POST /api/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "role": "user"
}
```

#### Login
```http
POST /api/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Response includes authentication token:
```json
{
  "success": true,
  "user": {...},
  "token": "1|..."
}
```

### Protected Endpoints

All protected endpoints require the `Authorization` header:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

#### Get Current User
```http
GET /api/user
```

#### Logout
```http
POST /api/logout
```

#### Create SOS Demande
```http
POST /api/demande
Content-Type: application/json

{
  "nom": "Dupont",
  "prenom": "Marie",
  "telephone": "+33612345678",
  "adresse": "123 Rue de Paris, Paris",
  "latitude": 48.8566,
  "longitude": 2.3522
}
```

#### Get All Demandes
```http
GET /api/demandes
GET /api/demandes?status=pending
```

- Users see only their own demandes
- Admins see all demandes
- Optional `status` filter: `pending`, `accepted`, `done`

#### Get Single Demande
```http
GET /api/demandes/{id}
```

#### Update Demande Status (Admin Only)
```http
PATCH /api/demandes/{id}/status
Content-Type: application/json

{
  "status": "accepted"
}
```

Status options: `pending`, `accepted`, `done`

## Database Schema

### Users Table
- `id` - Primary key
- `name` - User's full name
- `email` - Unique email address  
- `password` - Hashed password
- `role` - Enum: 'admin' or 'user'
- `created_at`, `updated_at` - Timestamps

### Demandes Table
- `id` - Primary key
- `user_id` - Foreign key to users table
- `nom` - Last name
- `prenom` - First name
- `telephone` - Phone number
- `adresse` - Address
- `latitude` - GPS latitude (nullable)
- `longitude` - GPS longitude (nullable)
- `status` - Enum: 'pending', 'accepted', 'done'
- `created_at`, `updated_at` - Timestamps

## Project Structure

```
app/
├── Http/
│   └── Controllers/
│       ├── UserController.php      # Authentication logic
│       └── DemandeController.php   # SOS request management
├── Models/
│   ├── User.php                    # User model with Sanctum
│   └── Demande.php                 # Demande model
database/
├── migrations/                     # Database migrations
└── seeders/
    ├── DatabaseSeeder.php
    └── UserSeeder.php
routes/
└── api.php                         # API route definitions
```

## CORS Configuration

For development, you may need to configure CORS to allow requests from your React Native app.

In `config/cors.php`, ensure:
```php
'paths' => ['api/*'],
'allowed_origins' => ['*'], // Or specify your frontend URL
```

## Deployment

### Environment Variables for Production

- `APP_ENV=production`
- `APP_DEBUG=false`
- `APP_URL=https://your-domain.com`
- Configure secure database credentials
- Set `SANCTUM_STATEFUL_DOMAINS` for SPA authentication

### Platforms

- **Render**: Push to Git, configure build command
- **DigitalOcean**: Deploy via App Platform
- **AWS**: Use Elastic Beanstalk or EC2

## Future Enhancements

- [ ] Firebase/Twilio notifications (placeholders in code)
- [ ] Real-time updates with Laravel Echo
- [ ] Ambulance tracking integration
- [ ] SMS alerts
- [ ] Email notifications

## License

Private - Assistance KMY

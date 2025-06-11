# AI-Note-Editor

A Laravel-based note-taking application with AI enhancement features.

## Features

- Google OAuth authentication
- Rich text note editing
- AI-powered content enhancement
- Auto-save functionality
- Real-time collaboration (planned)

## Tech Stack

- **Backend**: Laravel 11
- **Frontend**: React + Inertia.js
- **Database**: PostgreSQL
- **Authentication**: Google OAuth (Laravel Socialite)
- **AI Integration**: OpenAI API

## Setup

1. Clone the repository
2. Install dependencies: `composer install && npm install`
3. Configure environment variables in `.env`
4. Run migrations: `php artisan migrate`
5. Start the development server: `php artisan serve`

## Environment Variables

Required environment variables:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI`
- `OPENAI_API_KEY`
- Database configuration (PostgreSQL)

## License

MIT License

🍽️ Meals Planning
A full-stack web application for planning, organizing, and managing weekly meals — built with Angular v18, .NET 8, and SQL Server.
---
📌 Overview
Meals Planning helps users organize their weekly meals effortlessly. Users can browse meals, create custom meal plans, and manage their food schedule in a clean, intuitive interface.
---
🛠️ Tech Stack
Layer	Technology
Frontend	Angular v18, TypeScript, CSS/SCSS
Backend	ASP.NET Core (.NET 8), C#
Database	Microsoft SQL Server
---
📁 Project Structure
```
MealsPlanning/
├── Meals_Backend/        # ASP.NET Core Web API
│   ├── Controllers/      # API endpoints
│   ├── Models/           # Entity models
│   ├── Data/             # DbContext & migrations
│   └── Services/         # Business logic
│
└── Meals_UI/             # Angular v18 frontend
    ├── src/
    │   ├── app/
    │   │   ├── components/   # Reusable UI components
    │   │   ├── pages/        # Route-level views
    │   │   ├── services/     # HTTP & state services
    │   │   └── models/       # TypeScript interfaces
    │   └── assets/
    └── angular.json
```
---
✨ Features
📅 Weekly meal planner
🍲 Browse and manage meals
➕ Add / Edit / Delete meals
🔗 RESTful API integration
📱 Responsive UI
---
🚀 Getting Started
Prerequisites
Node.js (v18+)
Angular CLI v18
.NET 8 SDK
SQL Server
---
🔧 Backend Setup
```bash
# Navigate to backend folder
cd Meals_Backend

# Restore dependencies
dotnet restore

# Apply database migrations
dotnet ef database update

# Run the API
dotnet run
```
> The API will be available at `https://localhost:7000` (or as configured in `appsettings.json`)
---
🎨 Frontend Setup
```bash
# Navigate to frontend folder
cd Meals_UI

# Install dependencies
npm install

# Start development server
ng serve
```
> The app will be available at `http://localhost:4200`
---
⚙️ Configuration
Update the connection string in `Meals_Backend/appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER;Database=MealsPlanningDB;Trusted_Connection=True;"
  }
}
```
Update the API base URL in `Meals_UI/src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7000/api'
};
```
---
📄 License
This project is for educational and personal use.
---
👤 Author
Carole Hab
GitHub: @carolehab-dev
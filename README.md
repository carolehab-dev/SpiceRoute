# Meals Planning

A full-stack web application designed to simplify meal organization and planning. The platform enables users to manage meals, create weekly meal plans, and receive personalized meal recommendations through AI-powered assistance.

Built with **Angular 18**, **ASP.NET Core (.NET 8)**, **SQL Server**, and **OpenAI GPT-4o** using a Retrieval-Augmented Generation (RAG) approach.

---

## Overview

Meals Planning provides an intuitive solution for organizing meals and planning weekly menus. The application combines traditional meal management features with AI-powered recommendations, helping users discover meals that align with their preferences and available data.

---

## Key Features

* Weekly meal planning and scheduling
* Meal management (Create, Read, Update, Delete)
* AI-powered meal recommendations
* Conversational chat assistant
* Responsive and user-friendly interface
* RESTful API architecture
* SQL Server data persistence

---

## AI-Powered Recommendations

The application leverages a Retrieval-Augmented Generation (RAG) workflow to provide contextual and personalized meal suggestions.

### Workflow

1. User submits a meal-related query.
2. Relevant meal records are retrieved from SQL Server.
3. Retrieved data is supplied as contextual information.
4. GPT-4o generates tailored recommendations based on available meals.
5. Results are returned through the chat interface.

This architecture improves recommendation quality by grounding AI responses in the application's own data.

---

## Technology Stack

| Layer          | Technologies                                     |
| -------------- | ------------------------------------------------ |
| Frontend       | Angular 18, TypeScript, HTML5, SCSS              |
| Backend        | ASP.NET Core (.NET 8), C#, Entity Framework Core |
| Database       | Microsoft SQL Server                             |
| AI Integration | OpenAI GPT-4o, RAG Architecture                  |

---

## Project Structure

```text
MealsPlanning
│
├── Meals_Backend
│   ├── Controllers
│   ├── Models
│   ├── Data
│   ├── Services
│   └── AI
│
└── Meals_UI
    ├── src
    │   ├── app
    │   │   ├── components
    │   │   ├── pages
    │   │   ├── services
    │   │   └── models
    │   └── assets
    └── angular.json
```

---

## Getting Started

### Prerequisites

* .NET 8 SDK
* Node.js (v18 or later)
* Angular CLI
* Microsoft SQL Server

### Backend Setup

```bash
cd Meals_Backend

dotnet restore

dotnet ef database update

dotnet run
```

### Frontend Setup

```bash
cd Meals_UI

npm install

ng serve
```

The application will be available at:

* Frontend: `http://localhost:4200`
* Backend API: `https://localhost:7000`

---

## Configuration

### Database Connection

Update the connection string in `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER;Database=MealsPlanningDB;Trusted_Connection=True;"
  }
}
```

### Frontend Environment

Update the API URL in `environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: "https://localhost:7000/api"
};
```

---

## Future Enhancements

* User authentication and authorization
* Nutritional and calorie tracking
* Shopping list generation
* Dietary preference filtering
* Meal plan export functionality
* Enhanced AI personalization

---

## Author

**Carol Ehab**

Software Developer

GitHub: https://github.com/carolehab-dev


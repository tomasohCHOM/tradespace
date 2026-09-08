# TradeSpace
tradespace-491.web.app/
**TradeSpace** is a community-focused platform designed to make buying, selling, and trading items with other people simple and accessible.

The goal of TradeSpace is to create a space where users can discover items, connect with other members, and participate in a community-driven marketplace. Rather than focusing solely on traditional buying and selling, the platform is built around the idea of **trading and exchanging value within a community**.

(TradeSpace was a senior project for students in their last year for the Computer Science department in CSUF).
## What It Does

TradeSpace provides a marketplace experience where users can:

* Browse available items and trades
* Create and manage their own listings
* Connect with other users through shared tradespaces
* Join and leave different tradespaces
* Manage items and potential trades
* Organize marketplace activity through user-specific spaces
* Authenticate and manage accounts through Firebase

The application is structured around the concept of **Tradespaces** — individual communities or collections where users can participate in buying, selling, and trading.

## Tech Stack

TradeSpace is built using modern web technologies:

* **React** — Frontend UI
* **TypeScript** — Type-safe application development
* **Vite** — Development server and build tooling
* **TanStack Router** — File-based client-side routing
* **TanStack Query** — Data fetching and state management
* **Firebase** — Authentication, database, and storage services
* **Tailwind CSS** — Styling and responsive UI
* **Radix UI** — Accessible interface components
* **Lucide React** — Icons
* **Vitest** — Testing
* **Playwright** — End-to-end testing
* **ESLint & Prettier** — Code quality and formatting

The repository uses a modular structure with dedicated API, component, context, Firebase, routing, state, and utility directories.


## Project Structure

A simplified overview of the project structure:

```text
tradespace/
├── e2e/                  # End-to-end tests
├── public/               # Static assets
├── src/
│   ├── api/              # Application API functions
│   ├── components/       # Reusable React components
│   ├── context/          # React context providers
│   ├── firebase/         # Firebase configuration and services
│   ├── hooks/            # Custom React hooks
│   ├── images/           # Application images
│   ├── integrations/     # Third-party integrations
│   ├── lib/              # Shared libraries and helpers
│   ├── routes/           # Application routes
│   ├── static/           # Static application data
│   ├── store/            # Application state
│   ├── types/            # TypeScript types
│   ├── utils/            # Utility functions
│   └── main.tsx          # Application entry point
├── .envexample           # Environment variable template
├── firebase.json         # Firebase configuration
├── firestore.rules       # Firestore security rules
├── storage.rules         # Firebase Storage rules
├── package.json
└── vite.config.ts
```

The API layer includes functionality for creating, retrieving, joining, and leaving Tradespaces, as well as managing trade-related data.

## Routing

TradeSpace uses **TanStack Router** with file-based routing.

Routes are located in:

```text
src/routes/
```

Adding a route to this directory allows TanStack Router to incorporate it into the application's route tree.

## Development Workflow

A typical development workflow is:

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Make changes...

# Check linting
npm run lint

# Check formatting
npm run format

# Run end-to-end tests
npm run e2e

# Verify the production build
npm run build
```

## Why TradeSpace?

Traditional online marketplaces are primarily built around exchanging goods for money. TradeSpace explores a more community-oriented approach, where users can create spaces around shared interests and exchange items with one another.

The project is ultimately about making local and online communities more connected through **trading, sharing, and exchanging value**.

---

**TradeSpace**
*A community marketplace built around people, not just transactions.*


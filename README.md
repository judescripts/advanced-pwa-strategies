# PWA with Advanced Service Worker Strategies

## This is a DevToys.io blog tutorial example PWA app for educational purpose only!

### Visit [🔗 Here for the Original Blog!](https://devtoys.io/2024/07/10/mastering-service-workers-advanced-strategies-for-pwas/)

This project demonstrates how to implement advanced service worker strategies in a Progressive Web App (PWA), including offline support, background sync, push notifications, and caching strategies.

## Features

1. **Cache-First Strategy**: Caches static assets and serves them from the cache first.
2. **Network-First Strategy**: Tries to fetch API data from the network first, and falls back to the cache if the network is unavailable.
3. **Stale-While-Revalidate Strategy**: Serves cached content while fetching the latest version from the network.
4. **Background Sync**: Ensures form data is synced with the server when connectivity is restored.
5. **Push Notifications**: Sends notifications to users even when the app is not open.

## Project Structure

- `index.html`: Main HTML file for the PWA.
- `styles.css`: CSS file for styling the PWA.
- `offline.html`: Offline fallback page.
- `app.js`: JavaScript file for service worker registration and IndexedDB operations.
- `service-worker.js`: Service worker file implementing caching strategies and background sync.
- `server.js`: Node.js server to handle API requests and serve static files.

## Setup

### Prerequisites

- Node.js and npm installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Initialize the project and install dependencies:
   ```bash
   npm init -y
   npm install express body-parser
   ```

### Running the Project

1. Start the Node.js server:
   ```bash
   node server.js
   ```

2. Open your browser and navigate to `http://localhost:3000`.

## Usage

1. **Service Worker Registration**: Registers the service worker and sets up caching strategies.
2. **Form Submission**: Saves form data to IndexedDB and syncs it with the server when connectivity is restored.
3. **Push Notifications**: Displays push notifications sent from the server.

## Debugging

- **Console Logs**: Check the browser's console for logs and errors.
- **IndexedDB**: Inspect the `form-data` database in the Application tab of the browser's developer tools.
- **Network Requests**: Monitor network requests in the Network tab of the browser's developer tools.

## License

This project is licensed under the MIT License.

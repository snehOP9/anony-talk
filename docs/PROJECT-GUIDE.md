# Project Guide

Anony Talk is organized as a frontend client and a Node.js/Express server.

## Development flow

1. Install dependencies in the server and client applications.
2. Create local environment files from the documented examples.
3. Start the backend before testing API-dependent client features.
4. Start the Vite client and verify the API URL points to the local backend.

## Environment safety

Keep API keys, JWT secrets, database paths, and other environment-specific values in `.env` files. Never commit real credentials.

## Testing a change

For a backend change, verify the affected API route directly and then test the corresponding client flow. For a client-only change, verify the affected screen at both desktop and mobile widths.

## AI features

AI integrations should use server-side environment variables for credentials. Client code should never contain a private API key.
## Title and Description
The **WhatsApp Clone** project is a full-stack system that enables users to communicate in real-time. The system provides a seamless experience with an optimized design, robust scalability, and a clear architectural codebase, applying bi-directional communication techniques via WebSockets.

## Acknowledgements
* [Socket.io](https://socket.io/) - The foundational library for real-time communication.
* [shadcn/ui](https://ui.shadcn.com/) & [Tailwind CSS](https://tailwindcss.com/) - For building a modern and accessible UI/UX.
* [Zustand](https://github.com/pmndrs/zustand) - Frontend state management.
* [University of Information Technology (UIT)](#) - Foundational knowledge in Software Engineering and Networking.

## Features
* **Multi-layer Authentication:** Login, registration, and verification via OTP (Email/Twilio).
* **Real-time Messaging:** Send and receive messages with zero latency.
* **1-on-1 & Group Chat:** Supports the creation of multi-user chat groups.
* **Relationship Management:** Easily send, receive, and cancel friend requests.
* **Active Status:** Displays Online/Offline status in real-time.
* **Responsive Design:** A perfectly compatible interface across both PC and mobile devices.

## Tech
**Frontend:**
* React.js (Vite) + TypeScript
* Tailwind CSS, shadcn/ui
* Zustand (State Management)
* Axios, React Router

**Backend:**
* Node.js, Express.js
* Socket.io (WebSockets)
* MongoDB (Mongoose ODM)
* JWT (JSON Web Tokens), Resend (Email API), Twilio

## Deployment
* [https://whats-app-clone-kohl.vercel.app/](https://whats-app-clone-kohl.vercel.app/)

## Demo
*(Add images or GIF animations demonstrating your product here)*

## Documentation
Detailed architecture, Database Schema design, and Data Flow have been thoroughly documented. See more at:
* [Project Documentation](./PROJECT_DOCUMENTATION.md)
* [Folder Structure](./FOLDER_STRUCTURE.md)

## Installation
**Clone the repository:**
```bash
git clone [https://github.com/huudatit/WhatsApp-Clone](https://github.com/huudatit/WhatsApp-Clone)
cd whatsapp-clone
```

## API Reference
Below are some of the core API Endpoints (See the detailed payload structure within the routes and controllers source code):

**Authentication (/api/auth)**
* POST /api/auth/register - Register a new account.

* POST /api/auth/login - Login and receive a JWT token.

* POST /api/auth/verify-otp - Verify the OTP code.

**Users & Friends (/api/users, /api/friends)**
* GET /api/users/me - Retrieve current profile information.

* POST /api/friends/request - Send a friend request.

* PUT /api/friends/accept - Accept a friend request.

**Messages & Conversations (/api/messages, /api/conversations)**
* GET /api/conversations - Retrieve the list of conversations.

* GET /api/messages/:conversationId - Load the message history of a specific conversation.

* POST /api/messages - Send a new message (primarily serves as a backup for Socket.io).
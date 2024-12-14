# HEARTGIVE

HEARTGIVE is a fundraising platform that integrates blockchain technology with the Cardano ecosystem. By utilizing smart contracts written in the Aiken language, we aim to create a transparent, secure, and efficient system for managing charitable donations.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Deployment](#deployment)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

HEARTGIVE is a blockchain-based fundraising platform designed to help charitable organizations receive and manage donations with greater transparency. By integrating the Cardano blockchain, we ensure that every donation is traceable, secure, and verifiable. With the help of smart contracts written in Aiken, we enable automated donation management, allowing for easier tracking and more efficient allocation of funds.

Our goal is to revolutionize charitable giving by eliminating intermediaries, increasing donor confidence, and providing a real-time view of fund allocation and usage.

## Features

- **Blockchain Transparency:** Every transaction is recorded on the Cardano blockchain, ensuring full transparency and traceability.
- **Smart Contract Automation:** Donations are automatically handled through smart contracts, reducing human error and delays.
- **Real-Time Fund Tracking:** Donors can track the status of their contributions in real-time.
- **Low Transaction Fees:** Cardano’s efficient blockchain helps minimize transaction fees, maximizing the amount that reaches the cause.
- **Secure Platform:** Built with industry-standard security protocols, ensuring that both donors and recipients are protected.
- **Decentralized Governance:** Donors and charitable organizations can vote on key decisions via decentralized voting mechanisms.

## Deployment

The HEARTGIVE platform is live and can be accessed at:

**Deployment Link:** [https://heart-give.vercel.app/](https://heart-give.vercel.app/)

You can explore the platform, browse charitable causes, and make donations directly through the deployed web application.

## Getting Started

To get started with HEARTGIVE, follow the steps below to set up the project locally.

### Prerequisites

Before you begin, ensure you have the following tools installed:

- **Node.js** (version 18.x or later)
- **npm** (version 9.x or later)
- **Git** (to clone the repository)
- **A modern web browser** (Chrome, Firefox, etc.)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/WeTranscend-labs/FE-HeartGive-.git
   cd FE-HeartGive-
   ```
2. Install dependencies:
   ```bash
   npm i
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser to access the application.

## Technologies Used

This project utilizes a combination of modern web development and blockchain technologies to create a secure, transparent, and efficient fundraising platform. Here's a summary of the key technologies:

- **Frontend Framework:**

  - **React:** A JavaScript library for building user interfaces, providing a component-based architecture for efficient development.

- **Programming Language:**

  - **TypeScript:** A statically typed superset of JavaScript that enhances code quality, readability, and maintainability.

- **Build Tool:**

  - **Vite:** A fast and modern build tool that significantly improves development speed with features like HMR.

- **Smart Contract Language:**

  - **Aiken:** A Cardano-specific smart contract language for creating secure and verifiable automated agreements.

- **State Management:**

  - **Zustand:** A small, fast, and scalable state management solution with a minimalistic API based on hooks.

- **Styling:**

  - **Tailwind CSS:** A utility-first CSS framework for rapid UI development with highly customizable designs.
  - **Tailwind Merge:** Resolves conflicting Tailwind classes for consistent styling.

- **UI Components:**

  - **Radix UI:** An unstyled, accessible component library for building custom UI components.

- **Store Image:**
  - **Supabase:** An open-source Firebase.

This combination of technologies enables HEARTGIVE to offer a secure, transparent, and user-friendly platform for charitable giving.

## Project Structure

```
.
├── assets
├── components
├── configs
├── constants
├── contexts
├── helpers
├── hooks
├── layouts
├── lib
├── mockData
├── pages
├── schemas
├── services
├── store
├── types
└── utils
```

## Contributing

Contributions are welcome! If you'd like to contribute to HEARTGIVE, please fork the repository, make your changes, and submit a pull request. We appreciate your help!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

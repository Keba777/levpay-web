# LevPay Web 🌐

![Next.js](https://img.shields.io/badge/next.js-%23000000.svg?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Radix UI](https://img.shields.io/badge/radix%20ui-161618.svg?style=for-the-badge&logo=radix-ui&logoColor=white)

**LevPay Web** is the premium client-facing dashboard for LevPay. Built with the T3 Stack philosophy using **Next.js 14**, **TypeScript**, and **Tailwind CSS**, it offers a blazing fast, responsive, and beautiful financial experience.

## ✨ Key Features

-   **Premium Dashboard**: Insightful overview of finances, recent activity, and quick actions.
-   **Wallet Management**: Send money, view balances in multiple currencies, and manage cards.
-   **KYC Verification**: Interactive, multi-step identity verification flow.
-   **Smart Notifications**: Real-time alerts and a dedicated notification center.
-   **Admin Portal**: Dedicated secure area for administrators to manage users and view system stats.
-   **Responsive Design**: Fully optimized for desktop, tablet, and mobile browsers.

## 🛠️ Tech Stack

-   **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
-   **Language**: TypeScript
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [Shadcn UI](https://ui.shadcn.com/) (Radix Primitives)
-   **State Management**: Zustand & React Query
-   **Icons**: Lucide React
-   **Validation**: Zod + React Hook Form

## 🚀 Getting Started

### Prerequisites

-   Node.js 18+
-   npm or yarn

### Installation

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Configure Environment**:
    Create a `.env.local` file in the root directory:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:5001/api
    ```

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```

4.  **Open Browser**:
    Visit [http://localhost:3000](http://localhost:3000).

## 📂 Project Structure

```
levpay-web/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Authentication Routes (Login, Register)
│   ├── (authorized)/       # Protected Routes (Dashboard, Settings)
│   │   ├── (user)/         # User Dashboard
│   │   └── (admin)/        # Admin Portal
│   └── globals.css         # Global Styles & Tailwind
├── components/             # Reusable UI Components
│   ├── ui/                 # Shadcn/Radix Primitives
│   └── dashboard/          # Feature-specific widgets
├── lib/                    # Utilities & API Clients
│   ├── api/                # API Endpoints definitions
│   └── utils.ts            # Helper functions
└── public/                 # Static Assets
```

## 🎨 Design System

We utilize a **Modern Financial** aesthetic:
-   **Primary**: Deep Teal (`#3D8D7A`)
-   **Secondary**: Mint Green (`#B3D8A8`)
-   **Accent**: Sage & Cream
-   **Typography**: Inter (Clean & Professional)

## 🤝 Contributing

We welcome contributions! Please see our main repository's contribution guidelines.

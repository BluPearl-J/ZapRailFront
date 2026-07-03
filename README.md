# ZapRailFront


ZapRailFront Nomba Connect Hub ZapVeridian Flow is a robust, high-performance integration engine designed to handle real-time event streaming and webhook consumption. This project focuses on the core challenge of reliable event processing and data integrity.

### Live Demo

**View the application here:** [https://zap-rail-front.vercel.app](https://zap-rail-front.vercel.app)

### Core Features

* **Event Schema Enforcement**: Strictly validates incoming event payloads (event_id, event_type, received_at, signature_valid).
* **Flexible API Strategy**: Built-in `USE_MOCK` toggle in `src/lib/api/client.ts` allows for seamless switching between mock data for development and live production Express API endpoints.
* **Resilient Architecture**: Built on the TanStack Start framework for optimized server-side rendering and type-safe routing.
* **Modern UI/UX**: Responsive dashboard built with Tailwind CSS and Radix UI primitives.

### Technical Stack

* **Framework**: TanStack Start (Router & Server Engine)
* **UI Components**: Tailwind CSS, Radix UI, Lucide React
* **State Management**: TanStack Query
* **Validation**: Zod

### Local Development

If you wish to run the project locally:

1. **Install dependencies**: `npm install`
2. **Start the development server**: `npm run dev`
3. **Access the application**: The app will be available at `http://localhost:8080/`.
4. **API Configuration**: To toggle between mock data and your backend API, modify `src/lib/api/client.ts`: `export const USE_MOCK = true;` (Set to `false` to connect to your production Express API).

### Future Roadmap

We have prioritized core functional workflows to ensure maximum value during the initial development phase. The following features are in our immediate development pipeline:

* **Authentication & Security**: Integration of Clerk/Supabase to provide secure OAuth/SSO and role-based access control.
* **User Persistence**: Implementation of multi-tenant dashboard support to allow organizational account management.
* **Analytics**: Advanced reporting features to visualize event processing metrics and throughput trends.
* **Webhook Logs**: A dedicated UI interface for auditing historical event signatures and re-triggering failed webhooks.

---

**Does this look correct to you, or would you like to add anything else to the "Live Demo" section before you commit this?**

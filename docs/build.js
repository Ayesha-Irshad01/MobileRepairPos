const fs = require('fs');
const path = require('path');

// Directories to create
const dirs = ['getting-started', 'system-guide', 'user-guide'];
dirs.forEach(dir => {
    if (!fs.existsSync(path.join(__dirname, dir))) {
        fs.mkdirSync(path.join(__dirname, dir));
    }
});

const pages = [
  // Getting Started
  { id: 'index', title: 'Home', section: 'Getting Started', icon: 'fa-home', url: 'index.html', prev: null, next: 'getting-started/intro.html' },
  { id: 'introduction', title: 'Introduction', section: 'Getting Started', icon: 'fa-info-circle', url: 'getting-started/intro.html', prev: 'index.html', next: 'getting-started/features.html' },
  { id: 'features', title: 'Overview & Features', section: 'Getting Started', icon: 'fa-star', url: 'getting-started/features.html', prev: 'getting-started/intro.html', next: 'system-guide/prerequisites.html' },
  
  // System Guide
  { id: 'prerequisites', title: 'Prerequisites', section: 'System Guide', icon: 'fa-clipboard-check', url: 'system-guide/prerequisites.html', prev: 'getting-started/features.html', next: 'system-guide/installation.html' },
  { id: 'installation', title: 'Local Installation', section: 'System Guide', icon: 'fa-laptop-code', url: 'system-guide/installation.html', prev: 'system-guide/prerequisites.html', next: 'system-guide/env-variables.html' },
  { id: 'env-variables', title: 'Environment Variables', section: 'System Guide', icon: 'fa-key', url: 'system-guide/env-variables.html', prev: 'system-guide/installation.html', next: 'system-guide/tech-stack.html' },
  { id: 'tech-stack', title: 'Tech Stack', section: 'System Guide', icon: 'fa-layer-group', url: 'system-guide/tech-stack.html', prev: 'system-guide/env-variables.html', next: 'system-guide/architecture.html' },
  { id: 'architecture', title: 'System Architecture', section: 'System Guide', icon: 'fa-sitemap', url: 'system-guide/architecture.html', prev: 'system-guide/tech-stack.html', next: 'system-guide/database.html' },
  { id: 'database', title: 'Database Schema', section: 'System Guide', icon: 'fa-database', url: 'system-guide/database.html', prev: 'system-guide/architecture.html', next: 'system-guide/deployment.html' },
  { id: 'deployment', title: 'Deployment', section: 'System Guide', icon: 'fa-cloud-arrow-up', url: 'system-guide/deployment.html', prev: 'system-guide/database.html', next: 'user-guide/auth-roles.html' },

  // User Guide
  { id: 'auth-roles', title: 'Authentication & Roles', section: 'User Guide', icon: 'fa-user-shield', url: 'user-guide/auth-roles.html', prev: 'system-guide/deployment.html', next: 'user-guide/dashboard.html' },
  { id: 'dashboard', title: 'Dashboard Overview', section: 'User Guide', icon: 'fa-chart-line', url: 'user-guide/dashboard.html', prev: 'user-guide/auth-roles.html', next: 'user-guide/repair-management.html' },
  { id: 'repair-management', title: 'Repair Management', section: 'User Guide', icon: 'fa-tools', url: 'user-guide/repair-management.html', prev: 'user-guide/dashboard.html', next: 'user-guide/inventory.html' },
  { id: 'inventory', title: 'Inventory & Parts', section: 'User Guide', icon: 'fa-boxes-stacked', url: 'user-guide/inventory.html', prev: 'user-guide/repair-management.html', next: 'user-guide/customers.html' },
  { id: 'customers', title: 'Customer Management', section: 'User Guide', icon: 'fa-users', url: 'user-guide/customers.html', prev: 'user-guide/inventory.html', next: 'user-guide/invoicing.html' },
  { id: 'invoicing', title: 'Sales & Invoicing', section: 'User Guide', icon: 'fa-file-invoice-dollar', url: 'user-guide/invoicing.html', prev: 'user-guide/customers.html', next: 'user-guide/payments.html' },
  { id: 'payments', title: 'Payments', section: 'User Guide', icon: 'fa-credit-card', url: 'user-guide/payments.html', prev: 'user-guide/invoicing.html', next: 'user-guide/expenses.html' },
  { id: 'expenses', title: 'Expenses', section: 'User Guide', icon: 'fa-receipt', url: 'user-guide/expenses.html', prev: 'user-guide/payments.html', next: 'user-guide/devices.html' },
  { id: 'devices', title: 'Devices', section: 'User Guide', icon: 'fa-mobile-screen', url: 'user-guide/devices.html', prev: 'user-guide/expenses.html', next: 'user-guide/settings.html' },
  { id: 'settings', title: 'Settings', section: 'User Guide', icon: 'fa-cog', url: 'user-guide/settings.html', prev: 'user-guide/devices.html', next: null },
];

const contentMap = {
  'index': `
    <div class="not-prose inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">Welcome</div>
    <h1>Mobile Repair POS Documentation</h1>
    <p class="lead">
        Welcome to the official documentation for Mobile Repair POS. This hub is designed to provide comprehensive theoretical backgrounds, architectural overviews, and step-by-step practical guides to seamlessly operate and scale your repair business.
    </p>
    
    <div class="not-prose grid md:grid-cols-2 gap-6 mt-10">
        <a href="getting-started/intro.html" class="block p-8 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-lg transition-all hover:border-blue-300 dark:bg-slate-800 dark:border-slate-700">
            <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 text-xl shadow-inner border border-blue-100 dark:bg-slate-700 dark:border-slate-600 dark:text-blue-400">
                <i class="fas fa-play"></i>
            </div>
            <h2 class="text-xl font-semibold text-slate-900 mb-3 dark:text-white">Getting Started</h2>
            <p class="text-slate-500 text-sm leading-relaxed dark:text-slate-400">Discover the theoretical foundation of Mobile Repair POS, core philosophies, and high-level feature sets designed to optimize your workflow.</p>
        </a>
        <a href="system-guide/prerequisites.html" class="block p-8 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-lg transition-all hover:border-blue-300 dark:bg-slate-800 dark:border-slate-700">
            <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 text-xl shadow-inner border border-blue-100 dark:bg-slate-700 dark:border-slate-600 dark:text-blue-400">
                <i class="fas fa-cogs"></i>
            </div>
            <h2 class="text-xl font-semibold text-slate-900 mb-3 dark:text-white">System Guide</h2>
            <p class="text-slate-500 text-sm leading-relaxed dark:text-slate-400">Deep dive into system requirements, deployment strategies, environmental configuration, and underlying software architecture.</p>
        </a>
        <a href="user-guide/auth-roles.html" class="block p-8 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-lg transition-all hover:border-blue-300 dark:bg-slate-800 dark:border-slate-700 md:col-span-2">
            <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 text-xl shadow-inner border border-blue-100 dark:bg-slate-700 dark:border-slate-600 dark:text-blue-400">
                <i class="fas fa-users"></i>
            </div>
            <h2 class="text-xl font-semibold text-slate-900 mb-3 dark:text-white">User Guide</h2>
            <p class="text-slate-500 text-sm leading-relaxed dark:text-slate-400 md:w-2/3">Master the daily operations. Learn optimal ways to utilize the dashboard, manage complex repair lifecycles, maintain precise inventory levels, and handle multi-user role authorizations effectively.</p>
        </a>
    </div>
  `,
  'introduction': `
    <div class="not-prose inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">Getting Started</div>
    <h1>Introduction</h1>
    <p class="lead">
        Mobile Repair POS is an enterprise-grade point-of-sale and business management platform meticulously crafted for modern electronic and mobile repair businesses.
    </p>
    <h2>The Philosophy</h2>
    <p>
        Managing a repair business is inherently chaotic. Devices enter in various states of disrepair, require distinct parts sourced from diverse vendors, and mandate meticulous tracking to ensure customer satisfaction. The philosophy behind Mobile Repair POS is to abstract this complexity into a unified, linear, and predictable workflow. 
    </p>
    <p>
        By bridging the gap between customer intake (CRM), operational status (Repair Timeline), and financial settlement (Invoicing), the system ensures data consistency across the entire business lifecycle.
    </p>
    <h2>Who is this for?</h2>
    <ul>
        <li><strong>Independent Technicians:</strong> Seeking to organize their ticketing and reduce paper trails.</li>
        <li><strong>Retail Store Owners:</strong> Needing tight inventory control to prevent part shortages and monitor staff performance.</li>
        <li><strong>Multi-location Franchises:</strong> Requiring centralized cloud architectures, strict role-based access control, and unified reporting.</li>
    </ul>
  `,
  'features': `
    <div class="not-prose inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">Getting Started</div>
    <h1>Overview & Features</h1>
    <p class="lead">
        Our feature set was developed by analyzing bottlenecks in traditional repair workflows. Below is an overview of the core modules driving Mobile Repair POS.
    </p>
    
    <h3>1. Dynamic Repair Lifecycle Management</h3>
    <p>
        Standard ticketing systems treat repairs as static tasks. Our system treats repairs as a dynamic lifecycle containing unique states: <em>Intake</em>, <em>Diagnosing</em>, <em>Awaiting Parts</em>, <em>In Progress</em>, and <em>Completed</em>. This state machine ensures transparency for both technicians and customers.
    </p>

    <h3>2. Real-time Inventory & Supply Chain</h3>
    <p>
        Inventory management in repair shops requires micro-precision. The platform allows you to track individual SKUs, monitor minimum stock thresholds, and link specific replacement parts directly to active repair tickets - automatically decrementing stock upon ticket completion.
    </p>

    <h3>3. Multi-tier Authorization</h3>
    <p>
        Security and delegation are paramount. The system implements a robust Role-Based Access Control (RBAC) mechanism. Administrators hold global mutation rights, while Technicians are restricted to operational domains, preventing unauthorized financial or inventory discrepancies.
    </p>
  `,
  'prerequisites': `
    <div class="not-prose inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">System Guide</div>
    <h1>Prerequisites</h1>
    <p class="lead">
        To ensure optimal performance and circumvent compatibility issues, the host environment must meet specific technical prerequisites before initializing the application.
    </p>
    
    <h2>Runtime Environments</h2>
    <p>
        The backend architecture relies heavily on asynchronous event loops and modern JavaScript standards. Therefore, an up-to-date Node environment is mandatory.
    </p>
    <ul>
        <li><strong>Node.js (LTS):</strong> Version 18.x.x or higher is strictly required to support modern native <code>fetch</code> APIs and Next.js internal tooling.</li>
        <li><strong>Package Manager:</strong> <code>npm</code> (v9+), <code>yarn</code>, or <code>pnpm</code>. We recommend npm for the most stable dependency resolution.</li>
    </ul>

    <h2>Database Requirements</h2>
    <p>
        Mobile Repair POS utilizes a NoSQL document model to allow for flexible schema definitions, which is ideal for diverse device properties and repair notes.
    </p>
    <ul>
        <li><strong>MongoDB:</strong> A running MongoDB instance (Version 5.0+). This can be a local daemon or a managed cluster via MongoDB Atlas.</li>
    </ul>
  `,
  'installation': `
    <div class="not-prose inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">System Guide</div>
    <h1>Local Installation</h1>
    <p class="lead">
        Deploying the application locally is a straightforward process designed to get developers up and running within minutes.
    </p>
    
    <h2>1. Repository Cloning</h2>
    <p>Initiate the process by pulling the source code from the main repository. Ensure you are pulling the most stable branch (typically <code>main</code> or <code>master</code>).</p>
    <pre><code>git clone https://github.com/yourusername/MobileRepairPos.git
cd MobileRepairPos</code></pre>

    <h2>2. Dependency Hydration</h2>
    <p>Install the required <code>node_modules</code>. This step evaluates the <code>package.json</code> tree and securely downloads validated packages.</p>
    <pre><code>npm install</code></pre>
    
    <h2>3. Initializing the Server</h2>
    <p>Once your environment variables are configured (see next section), you can spin up the Hot Module Replacement (HMR) development server.</p>
    <pre><code>npm run dev</code></pre>
    <p>The application will bind to port 3000 by default. Access the UI via <code>http://localhost:3000</code>.</p>
  `,
  'env-variables': `
    <div class="not-prose inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">System Guide</div>
    <h1>Environment Variables</h1>
    <p class="lead">
        Environment variables act as securely injected configurations that abstract sensitive credentials away from the source code.
    </p>
    
    <h2>Configuration Context</h2>
    <p>Create a file named <code>.env.local</code> in the absolute root directory of your project. This file is automatically ignored by <code>.gitignore</code>.</p>
    
    <pre><code># Database Connection String
MONGODB_URI=mongodb+srv://&lt;user&gt;:&lt;password&gt;@cluster.mongodb.net/mobilerepair?retryWrites=true&w=majority

# Cryptographic Secret for JWT
JWT_SECRET=generate_a_secure_random_string_here

# NextAuth URL Context
NEXTAUTH_URL=http://localhost:3000</code></pre>

    <div class="not-prose border-l-4 border-yellow-500 bg-yellow-50 p-5 rounded-r-xl my-8 dark:bg-yellow-900/20 shadow-sm">
        <div class="flex items-start">
            <i class="fas fa-exclamation-triangle text-yellow-600 mt-0.5 mr-3 dark:text-yellow-500"></i>
            <div>
                <h4 class="text-sm font-bold text-yellow-800 dark:text-yellow-400 mb-1">Security Warning</h4>
                <p class="text-xs text-yellow-700 dark:text-yellow-500 leading-relaxed">
                    Under no circumstances should production database URIs or JWT secrets be committed to a public or private repository. Always utilize a secrets manager for CI/CD pipelines.
                </p>
            </div>
        </div>
    </div>
  `,
  'tech-stack': `
    <div class="not-prose inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">System Guide</div>
    <h1>Tech Stack & Architecture</h1>
    <p class="lead">
        Mobile Repair POS relies on a modern, decoupled monolithic architecture - utilizing Server-Side Rendering (SSR) for optimal performance.
    </p>
    
    <h2>The Frontend</h2>
    <p>
        The user interface is powered by <strong>Next.js (React)</strong>. This framework provides seamless client-side routing, automated code splitting, and robust state management. 
        Styling is handled entirely by <strong>Tailwind CSS</strong>, leveraging utility-first paradigms to construct responsive, consistent, and highly maintainable UI components without the bloat of traditional cascading stylesheets.
    </p>

    <h2>The Backend</h2>
    <p>
        Business logic and data mutation are abstracted into <strong>Next.js API Routes</strong>. This serverless-first approach means endpoints act as isolated lambda functions, guaranteeing scalable compute overhead. 
    </p>
    
    <h2>Authentication</h2>
    <p>
        Session management is governed by <strong>NextAuth.js</strong>. It provides a secure, encrypted JWT-based mechanism that guards against Cross-Site Request Forgery (CSRF) and mitigates standard session hijacking vectors.
    </p>
  `,
  'database': `
    <div class="not-prose inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">System Guide</div>
    <h1>Database Schema</h1>
    <p class="lead">
        Understanding the core database relationships is crucial for extending the application. We use Mongoose ORM to enforce strict typing on MongoDB documents.
    </p>

    <h2>Core Collections</h2>
    <ul>
        <li>
            <strong>User Collection:</strong> Contains encrypted credentials, contact data, and an integer-based <code>role</code> flag identifying the user's privilege scope.
        </li>
        <li>
            <strong>Repair Collection:</strong> The largest entity. It contains sub-documents defining device metadata (IMEI, Serial), customer references (via ObjectId), and an array of timeline events tracking state mutations.
        </li>
        <li>
            <strong>Inventory Collection:</strong> Catalogs items using unique SKUs. It holds pricing data (cost vs. retail), manufacturer identifiers, and exact integer counts of stock.
        </li>
        <li>
            <strong>Invoice Collection:</strong> A financial ledger binding a specific <code>RepairId</code> to transaction records, tax calculations, and payment statuses (Paid, Pending, Overdue).
        </li>
    </ul>
  `,
  'deployment': `
    <div class="not-prose inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">System Guide</div>
    <h1>Deployment Strategy</h1>
    <p class="lead">
        The application architecture is tailored for serverless edge deployment, ensuring low latency and high availability.
    </p>

    <h2>Vercel Deployment (Recommended)</h2>
    <p>
        Because the application is constructed with Next.js, Vercel is the optimal host. Vercel automatically detects the framework, configures the build steps, and optimizes API routes into edge functions.
    </p>
    <ol>
        <li>Push your source code to a GitHub repository.</li>
        <li>Navigate to the Vercel Dashboard and click "Import Project".</li>
        <li>Expand the <em>Environment Variables</em> section and securely input your <code>MONGODB_URI</code> and <code>JWT_SECRET</code>.</li>
        <li>Click <strong>Deploy</strong>.</li>
    </ol>
    
    <h2>Traditional Node Server</h2>
    <p>
        If deploying on a VPS (like AWS EC2 or DigitalOcean Droplet), you must build the production bundle explicitly before using process managers like PM2.
    </p>
    <pre><code>npm run build
pm2 start npm --name "mobile-pos" -- start</code></pre>
  `,
  'auth-roles': `
    <div class="not-prose inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">User Guide</div>
    <h1>Authentication & Roles</h1>
    <p class="lead">
        Security begins at the login perimeter. The platform implements Role-Based Access Control (RBAC) to ensure operational integrity.
    </p>

    <h2>Role Definitions</h2>
    <p>The system logically partitions capabilities between two core roles:</p>
    <ul>
        <li>
            <strong>Administrators:</strong> Granted omnipotent access. Admins can add or revoke staff accounts, manipulate core inventory ledgers, bypass repair validations, and view sensitive gross profit metrics.
        </li>
        <li>
            <strong>Technicians:</strong> Confined to an operational sandbox. Technicians can log new repairs, update diagnostic statuses, and view assigned tickets. They are explicitly blocked from deleting invoices or viewing wholesale inventory costs.
        </li>
    </ul>
    
    <h2>Best Practices</h2>
    <p>Ensure that a dedicated Admin account is retained solely for system-level configuration, while everyday ticketing is handled via standard Technician accounts to limit exposure.</p>
  `,
  'dashboard': `
    <div class="not-prose inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">User Guide</div>
    <h1>Dashboard Overview</h1>
    <p class="lead">
        The Dashboard serves as the central command center, aggregating crucial business metrics and active workloads into a single pane of glass.
    </p>

    <h2>Key Analytical Metrics</h2>
    <p>At the top of the dashboard, you will find real-time KPI cards reflecting:</p>
    <ul>
        <li><strong>Active Repairs:</strong> The immediate queue of devices awaiting diagnostics or parts.</li>
        <li><strong>Monthly Revenue:</strong> Aggregated data from completed invoices.</li>
        <li><strong>Low Stock Alerts:</strong> Critical notifications triggering when inventory items breach their predefined minimum thresholds.</li>
    </ul>

    <figure class="mt-8 not-prose border border-slate-200 rounded-xl bg-slate-50 p-2 shadow-sm dark:bg-slate-800 dark:border-slate-700">
        <img src="../../public/screenshots/dashboard.png" alt="Dashboard View" class="rounded-lg w-full shadow-sm border border-slate-200/60 dark:border-slate-700" loading="lazy">
        <figcaption class="text-center text-xs text-slate-500 mt-3 font-medium">Fig 1. The primary administrative dashboard.</figcaption>
    </figure>
  `,
  'repair-management': `
    <div class="not-prose inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">User Guide</div>
    <h1>Repair Management</h1>
    <p class="lead">
        The repair module is the backbone of the application. It governs the meticulous process of intaking, diagnosing, and finalizing electronic repairs.
    </p>

    <h2>1. The Repair Form (Intake)</h2>
    <p>When a customer walks in, staff utilize the Repair Form to generate a digital intake ticket. Best practices require filling out exhaustive device identifiers - such as IMEI or Serial numbers - to prevent device mix-ups. The physical condition (scratches, cracks) must be heavily documented at this stage to avoid liability.</p>

    <figure class="my-6 not-prose border border-slate-200 rounded-xl bg-slate-50 p-2 shadow-sm dark:bg-slate-800 dark:border-slate-700">
        <img src="../../public/screenshots/repair-form.png" alt="Repair Form" class="rounded-lg w-full shadow-sm border border-slate-200/60 dark:border-slate-700" loading="lazy">
        <figcaption class="text-center text-xs text-slate-500 mt-3 font-medium">Fig 2. Customer and Device Intake Form.</figcaption>
    </figure>

    <h2>2. The Repair Timeline</h2>
    <p>Once generated, the ticket transitions to the Timeline view. Technicians interact with this module to mutate the ticket state (e.g., from <em>Diagnostics</em> to <em>Awaiting Parts</em>). This ensures that any employee can click into a ticket and immediately understand its historical context and current bottleneck.</p>
    
    <figure class="my-6 not-prose border border-slate-200 rounded-xl bg-slate-50 p-2 shadow-sm dark:bg-slate-800 dark:border-slate-700">
        <img src="../../public/screenshots/repair-timeline.png" alt="Repair Timeline" class="rounded-lg w-full shadow-sm border border-slate-200/60 dark:border-slate-700" loading="lazy">
        <figcaption class="text-center text-xs text-slate-500 mt-3 font-medium">Fig 3. Active timeline and state transitions.</figcaption>
    </figure>
  `,
  'inventory': `
    <div class="not-prose inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">User Guide</div>
    <h1>Inventory & Parts</h1>
    <p class="lead">
        Precise inventory management prevents halted repairs and unfulfilled tickets. This module allows you to track microscopic components with ease.
    </p>

    <h2>Item Cataloging</h2>
    <p>When adding new parts to the inventory ledger, strict SKU conventions should be maintained. For example, a screen replacement for an iPhone 13 should have a clearly distinguishable SKU compared to a battery replacement. Always input the exact wholesale cost to ensure accurate profit margin calculations downstream.</p>

    <h2>Stock Re-ordering</h2>
    <p>The system intelligently monitors stock levels. When you link an inventory part to an active repair ticket, the system temporarily reserves it. Upon ticket completion, the stock is permanently deducted. If stock breaches the minimum threshold, the dashboard will actively flag the item for reorder.</p>
    
    <figure class="mt-8 not-prose border border-slate-200 rounded-xl bg-slate-50 p-2 shadow-sm dark:bg-slate-800 dark:border-slate-700">
        <img src="../../public/screenshots/inventory.png" alt="Inventory Management" class="rounded-lg w-full shadow-sm border border-slate-200/60 dark:border-slate-700" loading="lazy">
        <figcaption class="text-center text-xs text-slate-500 mt-3 font-medium">Fig 4. Inventory control and low stock alerts.</figcaption>
    </figure>
  `,
  'customers': `
    <div class="not-prose inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">User Guide</div>
    <h1>Customer Management</h1>
    <p class="lead">
        A robust CRM approach ensures recurring business. The Customer Management module aggregates clients and their historical data.
    </p>

    <h2>Client Profiles</h2>
    <p>Every intake automatically generates or appends to a unique customer profile. This profile tracks the lifetime value of the customer, allowing staff to easily look up past repair histories. This is invaluable when diagnosing recurring device faults or verifying warranty claims.</p>

    <figure class="mt-8 not-prose border border-slate-200 rounded-xl bg-slate-50 p-2 shadow-sm dark:bg-slate-800 dark:border-slate-700">
        <img src="../../public/screenshots/customers.png" alt="Customer Management" class="rounded-lg w-full shadow-sm border border-slate-200/60 dark:border-slate-700" loading="lazy">
        <figcaption class="text-center text-xs text-slate-500 mt-3 font-medium">Fig 5. Customer Directory and historical repair logs.</figcaption>
    </figure>
  `,
  'invoicing': `
    <div class="not-prose inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">User Guide</div>
    <h1>Sales & Invoicing</h1>
    <p class="lead">
        Closing the loop. The invoicing module generates professional, financial ledgers binding labor and parts to final monetary transactions.
    </p>

    <h2>Automated Generation</h2>
    <p>Upon moving a repair ticket to the <em>Completed</em> state, the system parses the linked inventory parts (at retail price) and the specified labor charge to automatically construct an invoice. This prevents arithmetic errors and ensures uniform billing.</p>

    <h2>Payment Statuses</h2>
    <p>Invoices maintain their own lifecycle (Pending, Paid, Void). Receipts can be printed or emailed directly to the customer's CRM profile email.</p>
    
    <figure class="mt-8 not-prose border border-slate-200 rounded-xl bg-slate-50 p-2 shadow-sm dark:bg-slate-800 dark:border-slate-700">
        <img src="../../public/screenshots/invoicing.png" alt="Sales and Invoicing" class="rounded-lg w-full shadow-sm border border-slate-200/60 dark:border-slate-700" loading="lazy">
        <figcaption class="text-center text-xs text-slate-500 mt-3 font-medium">Fig 6. Professional invoice generation.</figcaption>
    </figure>
  `,
  'settings': `
    <div class="not-prose inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">User Guide</div>
    <h1>Settings & Configuration</h1>
    <p class="lead">
        Global application parameters are governed via the Settings module. This section is strictly isolated to Administrative roles.
    </p>

    <h2>Business Profiles</h2>
    <p>Ensure that your store name, address, tax identification number, and localized currency are accurately populated. These variables are dynamically injected into the Invoicing module to ensure legal compliance on generated receipts.</p>

    <h2>Staff Management</h2>
    <p>Admins utilize this interface to onboard new technicians. When a staff member departs, it is critical to immediately revoke their access or change their password here to maintain data security.</p>
    
    <figure class="mt-8 not-prose border border-slate-200 rounded-xl bg-slate-50 p-2 shadow-sm dark:bg-slate-800 dark:border-slate-700">
        <img src="../../public/screenshots/settings.png" alt="System Settings" class="rounded-lg w-full shadow-sm border border-slate-200/60 dark:border-slate-700" loading="lazy">
        <figcaption class="text-center text-xs text-slate-500 mt-3 font-medium">Fig. Application settings and variable configuration.</figcaption>
    </figure>
  `,
  'architecture': `
    <div class="not-prose inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">System Guide</div>
    <h1>System Architecture</h1>
    <p class="lead">
        Mobile Repair POS is built on a modern, full-stack monolithic architecture using Next.js, enabling both server-side rendering and serverless API capabilities within a single codebase.
    </p>

    <h2>Architecture Overview</h2>
    <p>
        The application follows a <strong>3-tier architecture</strong>: the Presentation Layer (Next.js React frontend), the Application Layer (Next.js API Routes acting as a serverless backend), and the Data Layer (MongoDB via Mongoose). All three tiers are unified under the same Next.js project, simplifying deployment significantly.
    </p>

    <div class="not-prose my-8 bg-slate-900 rounded-2xl p-6 shadow-xl border border-slate-700 overflow-x-auto">
      <pre class="text-sm text-slate-200 font-mono leading-7 whitespace-pre">
┌─────────────────────────────────────────────────────────────┐
│                        BROWSER (Client)                      │
│              Next.js React Pages & Components                │
│         Dashboard · Repairs · Inventory · Invoices           │
└─────────────────────┬───────────────────────────────────────┘
                      │  HTTP / Fetch (JSON)
┌─────────────────────▼───────────────────────────────────────┐
│                  NEXT.JS SERVER (Vercel / Node)              │
│  ┌──────────────────────┐   ┌──────────────────────────┐    │
│  │   Server Components  │   │   API Routes (/api/*)    │    │
│  │   (SSR / RSC)        │   │   Auth · CRUD · Reports  │    │
│  └──────────────────────┘   └──────────┬───────────────┘    │
│                                        │ Mongoose ODM        │
└────────────────────────────────────────┼────────────────────┘
                                         │
┌────────────────────────────────────────▼────────────────────┐
│                    MongoDB Atlas (Cloud DB)                   │
│  Users · Repairs · Customers · Devices · Inventory           │
│  Invoices · Payments · Expenses · Staff · Settings           │
└─────────────────────────────────────────────────────────────┘</pre>
    </div>

    <h2>Request Lifecycle</h2>
    <ol>
        <li>A user interacts with a React component in the browser (e.g., creates a new repair ticket).</li>
        <li>The component fires a <code>fetch()</code> call to the corresponding Next.js API Route (e.g., <code>POST /api/repairs</code>).</li>
        <li>The API Route validates the JWT session via middleware, then invokes Mongoose to mutate the MongoDB document.</li>
        <li>MongoDB returns the result; the API Route sends a JSON response.</li>
        <li>React state is updated and the UI re-renders automatically.</li>
    </ol>

    <h2>Authentication Flow</h2>
    <p>
        Authentication is handled via custom JWT-based middleware. On login, the server validates credentials against the hashed password in the <code>User</code> collection, then issues a signed JWT stored in an HTTP-only cookie. Every subsequent API request passes through a middleware guard that decodes and verifies this token before the handler executes.
    </p>

    <h2>Key Architectural Decisions</h2>
    <ul>
        <li><strong>Monorepo Structure:</strong> Frontend and backend coexist in one repository, enabling atomic deployments and eliminating CORS complexity.</li>
        <li><strong>Serverless API Routes:</strong> Each API handler is an isolated function, enabling horizontal scaling on Vercel without managing server infrastructure.</li>
        <li><strong>Mongoose ODM:</strong> Provides schema validation, middleware hooks (e.g., pre-save hashing), and relationship population via <code>.populate()</code>.</li>
        <li><strong>MongoDB Atlas:</strong> Managed cloud database with automatic backups, sharding, and global read replicas.</li>
    </ul>
  `,
  'database': `
    <div class="not-prose inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">System Guide</div>
    <h1>Database Schema</h1>
    <p class="lead">
        The application uses MongoDB with Mongoose ODM. Below is the complete schema for all 10 collections, derived directly from the production model files.
    </p>

    <h2>1. User</h2>
    <p>Stores authenticated system users (Admins, Receptionists, Technicians). Passwords are stored as bcrypt hashes, never plaintext.</p>
    <pre><code>User {
  name:                 String (required)
  email:                String (required, unique, lowercase)
  passwordHash:         String (required)
  role:                 Enum ["Admin", "Receptionist", "Technician"]
  isActive:             Boolean (default: true)
  resetPasswordToken:   String | null
  resetPasswordExpires: Date | null
  timestamps:           createdAt, updatedAt
}</code></pre>

    <h2>2. Staff</h2>
    <p>A lightweight directory of technician staff members referenced on repair tickets.</p>
    <pre><code>Staff {
  name:      String (required)
  role:      String (required)
  isActive:  Boolean (default: true)
  timestamps: createdAt, updatedAt
}</code></pre>

    <h2>3. Customer</h2>
    <p>Tracks end-customers who bring in devices for repair. Referenced by Repairs, Invoices, and Payments.</p>
    <pre><code>Customer {
  name:      String (required)
  phone:     String
  email:     String
  address:   String
  notes:     String
  timestamps: createdAt, updatedAt
}</code></pre>

    <h2>4. Device</h2>
    <p>Represents a physical device registered in the system, optionally linked to a customer.</p>
    <pre><code>Device {
  brand:     String (required)
  model:     String (required)
  category:  String
  imei:      String
  customer:  ObjectId → Customer
  timestamps: createdAt, updatedAt
}</code></pre>

    <h2>5. Repair</h2>
    <p>The core collection tracking the full repair lifecycle from intake to completion.</p>
    <pre><code>Repair {
  repairNo:            String (required, unique)
  customer:            ObjectId → Customer (required)
  device:              ObjectId → Device (required)
  technician:          ObjectId → Staff | null
  issue:               String (required)
  status:              String (default: "Received")
  approvalStatus:      Enum ["Pending", "Approved", "Rejected"]
  approvedAt:          Date | null
  priority:            String (default: "Normal")
  deviceCondition:     String
  accessoriesReceived: String
  diagnosis:           String
  repairDetails:       String
  estimatedCost:       Number
  actualCost:          Number
  warrantyDays:        Number
  warrantyUntil:       Date | null
  partsUsed: [{
    inventoryItem: ObjectId → Inventory
    quantity:      Number
    unitPrice:     Number
  }]
  receivedAt:   Date
  completedAt:  Date | null
  notes:        String
  timestamps:   createdAt, updatedAt
}</code></pre>

    <h2>6. Inventory</h2>
    <p>Parts and components catalog with stock tracking and supplier information.</p>
    <pre><code>Inventory {
  item:              String (required)
  sku:               String (required, unique)
  barcode:           String
  qty:               Number (min: 0)
  minQty:            Number (low-stock threshold)
  category:          String (required)
  supplier:          String
  compatibleBrands:  [String]
  compatibleModels:  [String]
  cost:              Number (wholesale)
  price:             Number (retail)
  vatRate:           Number
  location:          String
  isActive:          Boolean
  notes:             String
  timestamps:        createdAt, updatedAt
}</code></pre>

    <h2>7. Invoice</h2>
    <p>Financial document binding line items, labour, and tax to a customer and optionally a repair.</p>
    <pre><code>Invoice {
  invoiceNo:     String (required, unique)
  customer:      ObjectId → Customer (required)
  relatedRepair: ObjectId → Repair | null
  invoiceDate:   Date
  dueDate:       Date | null
  items: [{
    inventoryItem: ObjectId → Inventory | null
    description:   String (required)
    quantity:      Number (required)
    unitPrice:     Number (required)
    vatRate:       Number
    total:         Number (required)
  }]
  subtotal:  Number
  discount:  Number
  vat:       Number
  total:     Number
  notes:     String
  timestamps: createdAt, updatedAt
}</code></pre>

    <h2>8. Payment</h2>
    <p>Records monetary transactions linked to customers, repairs, or invoices.</p>
    <pre><code>Payment {
  customer:       ObjectId → Customer (required)
  customerName:   String (required)
  relatedRepair:  ObjectId → Repair | null
  relatedInvoice: ObjectId → Invoice | null
  amount:         Number (required)
  paymentMethod:  Enum ["Cash", "Card", "Bank Transfer", "Other"]
  paymentDate:    Date
  reference:      String
  notes:          String
  timestamps:     createdAt, updatedAt
}</code></pre>

    <h2>9. Expense</h2>
    <p>Tracks operational outgoings for profit/loss reporting.</p>
    <pre><code>Expense {
  title:       String (required)
  amount:      Number (required)
  category:    String
  date:        Date
  notes:       String
  timestamps:  createdAt, updatedAt
}</code></pre>

    <h2>10. Settings</h2>
    <p>A singleton document storing the full application configuration - business profile, tax rates, appearance, and notification preferences.</p>
    <pre><code>Settings {
  business: { shopName, phone, email, address, currency, taxId }
  regional: { timezone, dateFormat, language }
  tax:      { enabled, rate, label }
  appearance: { theme, accentColor, density }
  // ... and more sub-documents
}</code></pre>
  `,
  'payments': `
    <div class="not-prose inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">User Guide</div>
    <h1>Payments</h1>
    <p class="lead">
        The Payments module provides a complete financial ledger for recording and tracking all money received from customers, whether linked to a repair ticket or a standalone sale.
    </p>

    <h2>Recording a Payment</h2>
    <p>
        When a customer settles their bill, navigate to the <strong>Payments</strong> section and create a new record. Link the payment to the relevant Repair or Invoice for full traceability. Supported payment methods include Cash, Card, Bank Transfer, and Other.
    </p>

    <h2>Payment Traceability</h2>
    <p>
        Every payment is cross-referenced to the customer's profile, the originating repair ticket, and the associated invoice. This triple-linkage allows accountants to reconcile records without leaving the application.
    </p>

    <figure class="mt-8 not-prose border border-slate-200 rounded-xl bg-slate-50 p-2 shadow-sm dark:bg-slate-800 dark:border-slate-700">
        <img src="../../public/screenshots/payments.png" alt="Payments Module" class="rounded-lg w-full shadow-sm border border-slate-200/60 dark:border-slate-700" loading="lazy">
        <figcaption class="text-center text-xs text-slate-500 mt-3 font-medium">The Payments ledger showing received transactions.</figcaption>
    </figure>
  `,
  'expenses': `
    <div class="not-prose inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">User Guide</div>
    <h1>Expenses</h1>
    <p class="lead">
        Track operational costs such as utility bills, tool purchases, and supplier payments to accurately calculate net profit.
    </p>

    <h2>Why Track Expenses?</h2>
    <p>
        Revenue alone does not define profitability. By logging expenses against categories (Utilities, Equipment, Rent, Salaries, etc.), the system can generate accurate gross and net profit reports on the Dashboard, giving management a true picture of business health.
    </p>

    <h2>Adding an Expense</h2>
    <p>
        Click <strong>New Expense</strong>, enter a descriptive title, amount, category, and date. Adding notes is recommended to describe the vendor or purpose for audit purposes.
    </p>

    <figure class="mt-8 not-prose border border-slate-200 rounded-xl bg-slate-50 p-2 shadow-sm dark:bg-slate-800 dark:border-slate-700">
        <img src="../../public/screenshots/expenses.png" alt="Expenses Module" class="rounded-lg w-full shadow-sm border border-slate-200/60 dark:border-slate-700" loading="lazy">
        <figcaption class="text-center text-xs text-slate-500 mt-3 font-medium">The Expenses log for operational cost tracking.</figcaption>
    </figure>
  `,
  'devices': `
    <div class="not-prose inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">User Guide</div>
    <h1>Devices</h1>
    <p class="lead">
        The Devices module maintains a registry of all physical devices that have been brought in for repair, linked to their respective owners.
    </p>

    <h2>Device Registry</h2>
    <p>
        Rather than re-entering device information on every new repair, the system stores device records persistently. A Samsung Galaxy S24 registered for a customer remains in the directory and can be referenced on any future repair ticket with a single click.
    </p>

    <h2>Key Device Fields</h2>
    <ul>
        <li><strong>Brand & Model:</strong> Identifies the manufacturer and product line (e.g., Apple, iPhone 15 Pro).</li>
        <li><strong>Category:</strong> Classifies the device type (Smartphone, Tablet, Laptop, etc.).</li>
        <li><strong>IMEI:</strong> A globally unique 15-digit identifier. Mandatory for high-value devices to prevent mix-ups.</li>
        <li><strong>Customer Link:</strong> Associates the device to its registered owner.</li>
    </ul>

    <figure class="mt-8 not-prose border border-slate-200 rounded-xl bg-slate-50 p-2 shadow-sm dark:bg-slate-800 dark:border-slate-700">
        <img src="../../public/screenshots/devices.png" alt="Devices Module" class="rounded-lg w-full shadow-sm border border-slate-200/60 dark:border-slate-700" loading="lazy">
        <figcaption class="text-center text-xs text-slate-500 mt-3 font-medium">The Device Registry listing all registered customer devices.</figcaption>
    </figure>
  `
};



function getRelativePrefix(url) {
    if (url === 'index.html') return '';
    return '../';
}

function generateSidebar(currentUrl) {
  const relPrefix = getRelativePrefix(currentUrl);

  let sidebarHTML = `<div class="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
      <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center font-bold shadow-md shadow-blue-600/30">M</div>
          <div>
            <h1 class="text-lg font-bold text-slate-900 dark:text-white leading-tight">MRP Docs</h1>
            <p class="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-tight">Mobile Repair POS</p>
          </div>
      </div>
      <button id="closeSidebar" class="ml-auto md:hidden text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
          <i class="fas fa-times"></i>
      </button>
  </div>
  <nav class="flex-1 overflow-y-auto py-6 px-4">
      <ul class="space-y-8">`;

  const sections = ['Getting Started', 'System Guide', 'User Guide'];
  
  sections.forEach(section => {
      sidebarHTML += `<li>
          <h3 class="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-3 dark:text-slate-500">${section}</h3>
          <ul class="space-y-1">`;
      
      pages.filter(p => p.section === section).forEach(page => {
          const isActive = page.url === currentUrl;
          
          const activeClasses = isActive 
            ? "bg-blue-50 text-blue-700 font-semibold border-l-[3px] border-blue-600 dark:bg-blue-900/20 dark:text-blue-400" 
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-l-[3px] border-transparent transition-colors dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200";
          
          let targetUrl;
          if (currentUrl === 'index.html') {
             targetUrl = page.url;
          } else if (page.url === 'index.html') {
             targetUrl = '../index.html';
          } else {
             targetUrl = '../' + page.url;
          }

          sidebarHTML += `<li>
              <a href="${targetUrl}" class="flex items-center px-3 py-2.5 rounded-r-lg ${activeClasses}">
                  <i class="fas ${page.icon} w-5 text-center mr-2 opacity-70"></i>
                  ${page.title}
              </a>
          </li>`;
      });
      
      sidebarHTML += `</ul></li>`;
  });

  sidebarHTML += `</ul></nav>`;
  return sidebarHTML;
}

function generateNavButtons(page, relPrefix) {
    let prevData = page.prev ? pages.find(p => p.url === page.prev) : null;
    let nextData = page.next ? pages.find(p => p.url === page.next) : null;

    let html = `<div class="not-prose mt-16 flex items-center justify-between border-t border-slate-200 pt-8 dark:border-slate-800">`;
    
    if (prevData) {
        let prevTarget = prevData.url === 'index.html' ? '../index.html' : (page.url === 'index.html' ? prevData.url : '../' + prevData.url);
        if (page.url !== 'index.html' && prevData.url === 'index.html') prevTarget = '../index.html';
        else if (page.url === 'index.html') prevTarget = prevData.url;

        html += `
        <a href="${prevTarget}" class="group flex items-center gap-4 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">
            <div class="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-slate-100 group-hover:bg-blue-50 dark:bg-slate-800 dark:group-hover:bg-slate-700 transition-colors border border-transparent group-hover:border-blue-200 dark:group-hover:border-slate-600">
                <i class="fas fa-arrow-left text-sm"></i>
            </div>
            <div class="flex flex-col hidden sm:flex">
                <span class="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-0.5">Previous</span>
                <span class="font-medium text-sm text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">${prevData.title}</span>
            </div>
        </a>`;
    } else {
        html += `<div></div>`;
    }

    if (nextData) {
        let nextTarget = nextData.url === 'index.html' ? '../index.html' : (page.url === 'index.html' ? nextData.url : '../' + nextData.url);
        if (page.url !== 'index.html' && nextData.url === 'index.html') nextTarget = '../index.html';
        else if (page.url === 'index.html') nextTarget = nextData.url;

        html += `
        <a href="${nextTarget}" class="group flex items-center gap-4 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors text-right ml-auto">
            <div class="flex flex-col items-end hidden sm:flex">
                <span class="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-0.5">Next</span>
                <span class="font-medium text-sm text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">${nextData.title}</span>
            </div>
            <div class="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-slate-100 group-hover:bg-blue-50 dark:bg-slate-800 dark:group-hover:bg-slate-700 transition-colors border border-transparent group-hover:border-blue-200 dark:group-hover:border-slate-600">
                <i class="fas fa-arrow-right text-sm"></i>
            </div>
        </a>`;
    } else {
        html += `<div></div>`;
    }
    
    html += `</div>`;
    return html;
}

pages.forEach(page => {
  const relPrefix = getRelativePrefix(page.url);
  const sidebar = generateSidebar(page.url);
  const content = contentMap[page.id];
  const navButtons = generateNavButtons(page, relPrefix);
  
  const logoPath = page.url === 'index.html' ? '../public/screenshots/logo.png' : '../../public/screenshots/logo.png';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${page.title} - Mobile Repair POS Documentation</title>
    
    <meta name="description" content="${page.title} for Mobile Repair POS.">
    <meta name="robots" content="index, follow">
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="${logoPath}">

    <!-- Fonts: Inter -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

    <!-- Tailwind CSS with Typography Plugin for professional rendering -->
    <script src="https://cdn.tailwindcss.com?plugins=typography"></script>
    <script>
      tailwind.config = {
        darkMode: 'class',
        theme: {
          extend: {
            fontFamily: {
              sans: ['Inter', 'sans-serif'],
            }
          }
        }
      }
    </script>
    
    <!-- FontAwesome for Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <!-- Custom CSS -->
    <link rel="stylesheet" href="${relPrefix}css/style.css">
    <style>
      body { font-family: 'Inter', sans-serif; }
      /* Elegant scrollbar */
      ::-webkit-scrollbar { width: 6px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      .dark ::-webkit-scrollbar-thumb { background: #475569; }
    </style>
</head>
<body class="bg-slate-50 text-slate-800 antialiased flex h-screen overflow-hidden selection:bg-blue-200 selection:text-blue-900 dark:bg-[#0f172a] dark:text-slate-200">

    <!-- Sidebar -->
    <aside id="sidebar" class="bg-white border-r border-slate-200 w-[280px] flex-shrink-0 fixed inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 z-20 flex flex-col transition-transform duration-300 dark:bg-[#1e293b] dark:border-slate-800 shadow-sm">
        ${sidebar}
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col w-full h-screen overflow-hidden bg-slate-50/50 dark:bg-[#0f172a]">
        
        <!-- Header -->
        <header class="h-16 border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 z-10 flex-shrink-0 backdrop-blur-xl bg-white/70 dark:bg-[#0f172a]/70 dark:border-slate-800 sticky top-0">
            <div class="flex items-center">
                <button id="sidebarToggle" class="md:hidden text-slate-500 hover:text-slate-800 focus:outline-none mr-4 dark:text-slate-400 dark:hover:text-white">
                    <i class="fas fa-bars text-xl"></i>
                </button>
                
                <!-- Breadcrumbs -->
                <nav class="hidden sm:flex text-sm font-medium text-slate-500 dark:text-slate-400">
                    <ol class="list-none p-0 inline-flex items-center">
                        <li class="flex items-center">
                            <span class="text-slate-400 dark:text-slate-500">Documentation</span>
                            <i class="fas fa-chevron-right text-[10px] mx-3 text-slate-300 dark:text-slate-600"></i>
                        </li>
                        <li class="flex items-center">
                            <span class="text-slate-400 dark:text-slate-500">${page.section}</span>
                            <i class="fas fa-chevron-right text-[10px] mx-3 text-slate-300 dark:text-slate-600"></i>
                        </li>
                        <li class="flex items-center">
                            <span class="text-slate-800 font-semibold dark:text-slate-200">${page.title}</span>
                        </li>
                    </ol>
                </nav>
            </div>

            <div class="flex items-center space-x-4">
                <!-- Search -->
                <div class="relative hidden sm:block">
                    <input type="text" id="searchInput" placeholder="Search documentation..." class="w-72 pl-11 pr-4 py-2.5 bg-slate-100/80 border border-slate-200/60 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:focus:bg-slate-700 shadow-inner">
                    <i class="fas fa-search absolute left-4 top-3 text-slate-400"></i>
                </div>
                
                <!-- Dark Mode Toggle -->
                <button id="theme-toggle" class="text-slate-500 hover:text-blue-600 hover:bg-blue-50 focus:outline-none w-10 h-10 rounded-full flex items-center justify-center transition-all dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-blue-400 border border-transparent hover:border-blue-100 dark:hover:border-slate-700">
                    <i id="theme-toggle-dark-icon" class="fas fa-moon text-lg"></i>
                    <i id="theme-toggle-light-icon" class="fas fa-sun text-lg hidden"></i>
                </button>
            </div>
        </header>

        <!-- Search input for mobile -->
        <div class="sm:hidden p-4 bg-white border-b border-slate-200 dark:bg-[#1e293b] dark:border-slate-800">
            <div class="relative">
                <input type="text" id="searchInputMobile" placeholder="Search documentation..." class="w-full pl-11 pr-4 py-2.5 bg-slate-100 border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:bg-slate-800 dark:text-white">
                <i class="fas fa-search absolute left-4 top-3.5 text-slate-400"></i>
            </div>
        </div>

        <!-- Scrollable Content Area -->
        <main class="flex-1 overflow-y-auto p-6 sm:p-10 lg:p-16">
            <div class="max-w-4xl mx-auto searchable-content">
                <!-- Pro Tip: Using Tailwind Typography plugin (.prose) to automagically format all theory text professionally -->
                <div class="prose prose-slate prose-blue max-w-none dark:prose-invert prose-headings:font-bold prose-h1:text-4xl prose-h1:tracking-tight prose-a:font-semibold prose-img:rounded-xl">
                    ${content}
                </div>
                
                ${navButtons}
            </div>
            
            <!-- Footer -->
            <footer class="max-w-4xl mx-auto mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 text-sm text-slate-500 flex justify-between items-center mb-10">
                <p>&copy; 2026 Mobile Repair POS. Masterpiece Documentation.</p>
                <div class="flex gap-5 text-slate-400">
                    <a href="#" class="hover:text-blue-600 transition-colors"><i class="fab fa-github text-xl"></i></a>
                    <a href="#" class="hover:text-blue-600 transition-colors"><i class="fab fa-twitter text-xl"></i></a>
                </div>
            </footer>
        </main>
    </div>

    <!-- Floating Contact Us Button -->
    <a href="#" class="contact-floating fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-7 rounded-full shadow-xl shadow-blue-600/30 transition-all hover:-translate-y-1 hover:shadow-2xl flex items-center z-50">
        <i class="fas fa-headset mr-2 text-lg"></i> Technical Support
    </a>

    <!-- Scripts -->
    <script src="https://code.jquery.com/jquery-3.7.0.min.js"></script>
    <script src="${relPrefix}js/script.js"></script>
    <script>
      const themeToggleBtn = document.getElementById('theme-toggle');
      const darkIcon = document.getElementById('theme-toggle-dark-icon');
      const lightIcon = document.getElementById('theme-toggle-light-icon');

      if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          document.documentElement.classList.add('dark');
          lightIcon.classList.remove('hidden');
          darkIcon.classList.add('hidden');
      }

      themeToggleBtn.addEventListener('click', function() {
          darkIcon.classList.toggle('hidden');
          lightIcon.classList.toggle('hidden');
          if (document.documentElement.classList.contains('dark')) {
              document.documentElement.classList.remove('dark');
              localStorage.setItem('color-theme', 'light');
          } else {
              document.documentElement.classList.add('dark');
              localStorage.setItem('color-theme', 'dark');
          }
      });
    </script>
</body>
</html>`;

  fs.writeFileSync(path.join(__dirname, page.url), html);
  console.log(`Generated ${page.url}`);
});

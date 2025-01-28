# 🚀 Next Launch Starter Project

Welcome to **Next Launch** — a modern, feature-packed boilerplate to kickstart your Next.js projects with ease and style. 💻✨

---

## 🌟 Features

### 🖥️ Core Technologies

- **Next.js 15**: The latest version for blazing-fast web apps.
- **TypeScript**: Strict typing for robust and maintainable code.
- **Prisma**: Effortless database management with schema-based workflows.
- **Tailwind CSS**: Beautiful and responsive design made easy.

### 🔧 Developer Tools

- **ESLint** + **Prettier**: Keep your code clean and consistent.
- **Jest** + **Testing Library**: Write and run tests like a pro. ✅
- **Husky** + **Lint-Staged**: Ensure quality with pre-commit hooks.
- **MailDev**: Local email testing made simple. 📧
- **Docker**: Simplified database setup and management. 🐳

### 📂 Organized Structure

- Well-defined folder hierarchy for effortless scaling.
- Pre-configured scripts for development and production.

### 🚀 Ready-to-Use Scripts

- `dev`: Start the development server.
- `build`: Build the project for production.
- `start`: Start the production server.
- `lint` / `lint:fix`: Check and fix linting issues.
- `format` / `format:check`: Format code with Prettier.
- `database:up` / `database:down`: Manage your database with Docker.
- `db:init` / `db:generate` / `db:push`: Prisma database workflows.
- `email:dev`: Local email testing with MailDev.
- `test` / `test:watch`: Run tests with Jest.

---

## 🛠️ Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/pierregueroult/next-launch.git
   cd next-launch
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up your environment**
   Create a `.env` file with your configuration:

   ```env
   DATABASE_URL=your_database_url
   SMTP_USER=your_smtp_user
   SMTP_PASS=your_smtp_password
   ...
   ```

   You can use the `.env.sample` file as a template. It's showing the required environment variables.
   ⚠️ **Note**: You cannot use .env.local as it not supported by Prisma yet.

4. **Run the development server**
   ```bash
   pnpm dev
   ```

---

## 💡 Key Features in Detail

### ⚡ Next.js & TypeScript

Enjoy the power of **Next.js** for server-side rendering, static site generation, and a seamless development experience with **TypeScript**.

### 🎨 Tailwind CSS

Style your app effortlessly with a utility-first approach. Customize and extend Tailwind for your needs.

### 🗄️ Prisma

Manage your database schema with ease using Prisma. Includes:

- **Prisma Studio**: Visualize and interact with your database.
- **Database workflows**: Pre-configured scripts for initialization and migrations.

### 📤 MailDev

Test your email workflows locally with MailDev, simulating outgoing email with:

```bash
pnpm email:dev
```

### 🧪 Testing

Confidently ship bug-free code:

- Write component tests with **Testing Library**.
- Run tests via `jest`.

### 🐳 Docker-ized Database

Quickly spin up a database environment:

- Start: `pnpm database:up`
- Stop: `pnpm database:down`

---

## 📜 Contributing

We welcome contributions! Please open an issue or submit a pull request. 🙌

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 💬 Feedback

Have suggestions or ideas? Open an issue or reach out. Let's make **Next Launch** even better together! 💬

---

### 👨‍💻 Made with ❤️ by Pierre Gueroult

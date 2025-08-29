# Project Setup Guide

Follow these steps to get the project running locally on your machine.

## Prerequisites

- A PC (Windows, macOS, or Linux)
- Node.js (v12+)

## 1. Clone the Repository

```bash
git clone https://github.com/gccody/Better-Tabz.git
cd Better-Tabz
```

> If you already have the project folder, just `cd` into it.

## 2. Install Dependencies

```bash
npm install
```

This will install all required packages listed in `package.json`.

## 3. Available Scripts

### 3.1 Run in Development Mode

```bash
npm run dev
```

- Starts a development server
- Supports hot-reloading
- Good for active development

### 3.2 Build for Production

```bash
npm run build
```

- Bundles and optimizes files
- Outputs into the `dist/` folder

### 3.3 Create a Bundled Zip

```bash
npm run zip
```

- Runs the production build
- Packages the contents of `dist/` into a `.zip` archive

## 4. Inspect the Output

- After `npm run build`, check the `dist/` folder for your production-ready files.
- After `npm run zip`, you’ll find the archive in the project root (e.g. `bettertabz.zip`).

---

That’s it! You’re now ready to develop, build, and bundle the project locally. Happy coding!

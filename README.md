# Translation Checker

Translation Checker is a web application built with Next.js 14 for managing translations. The application allows you to edit translations directly on the web, identify missing fields in each language, generate translations with AI, and update them directly in Amazon S3.

## Features

- **Translation Editing:** Edit translations directly from the web interface.
- **Missing Fields Verification:** Identify and display missing fields in each language.
- **AI Translation Generation:** Use artificial intelligence to automatically generate translations.
- **S3 Update:** Update translations directly in an Amazon S3 bucket.

## Use the app

To use the app, just go to https://polyglot.vercel.app, set up your AWS and OpenAI keys in the settings and you are ready to go!

## Build the app

### Prerequisites

- Node.js (version 14 or higher)
- npm, yarn, pnpm, or bun
- AWS account with S3 access
- OpenAI API access (optional, to allow AI generations)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/translation-checker.git
   cd polyglot
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

### Usage

1. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

   The application will be available at [http://localhost:3000](http://localhost:3000).

2. Access the web interface to manage translations:

   - **Edit Translations:** Navigate to the translations section and select the language and field you want to edit.
   - **Verify Missing Fields:** The application will automatically show the missing fields for each language.
   - **Generate Translations with AI:** Use the AI translation generation feature to automatically complete fields.
   - **Update in S3:** Save changes and update the translations directly in your Amazon S3 bucket.

### Deployment

To deploy the application in production, follow these steps:

1. Build the application:

   ```bash
   npm run build
   # or
   yarn build
   # or
   pnpm build
   # or
   bun build
   ```

2. Start the application in production mode:

   ```bash
   npm start
   # or
   yarn start
   # or
   pnpm start
   # or
   bun start
   ```

## Contributing

Contributions are welcome. If you wish to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/new-feature`).
3. Make your changes and commit them (`git commit -am 'Add new feature'`).
4. Push your changes to the branch (`git push origin feature/new-feature`).
5. Create a Pull Request.

## License

This project is licensed under the MIT License.

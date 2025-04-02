# CarStonks

A platform for trading car options, similar to stock market options. Users can buy contracts (Calls = Higher, Puts = Lower) with time expiry and percentage change predictions.

## Features

- Browse luxury cars available for options trading
- Trade options with different expiry periods (1, 3, or 6 months)
- Choose from various percentage change predictions (1%, 2%, 5%, 10%, 15%, 30%)
- Track your portfolio of active contracts
- Modern, responsive UI with beautiful car images

## Tech Stack

- [Remix](https://remix.run/) with [Vercel](https://vercel.com/) deployment
- React
- TypeScript
- Tailwind CSS
- Vitest & Testing Library

## Prerequisites

- Node.js >= 18.0.0
- Yarn

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/car-stonks.git
   cd car-stonks
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Start the development server:

   ```bash
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

- `yarn dev` - Start the development server
- `yarn build` - Build the application
- `yarn start` - Start the production server
- `yarn test` - Run tests
- `yarn test:watch` - Run tests in watch mode
- `yarn test:ui` - Run tests with the UI
- `yarn test:coverage` - Generate test coverage report
- `yarn lint` - Run ESLint
- `yarn lint:fix` - Fix ESLint issues
- `yarn prettier:fix` - Fix code formatting
- `yarn format` - Format all files with Prettier
- `yarn vercel-build` - Build for Vercel deployment

## Testing

The project uses Vitest and Testing Library for running tests. The test suite covers components, data files, and routes.

### Running Tests

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with UI
yarn test:ui

# Generate test coverage report
yarn test:coverage
```

### Code Coverage

Test coverage reports are automatically generated when running `yarn test:coverage`. The report shows coverage for:

- Statements
- Branches
- Functions
- Lines

Current coverage:

- Components: ~95%
- Data files: 100%
- Routes: ~17%
- Overall: ~67%

The HTML coverage report is generated in the `coverage` directory and can be viewed by opening `coverage/index.html` in a browser.

## Deployment

The project is set up for easy deployment on Vercel.

```bash
./deploy.sh
```

This script runs all checks (TypeScript, ESLint, tests with coverage), builds the app, and deploys to Vercel.

## Git Hooks

The project uses Husky to run pre-commit hooks:

- Run Prettier to format code
- Fix linting issues
- Run tests

## License

MIT

# Contributing to Hindu Panchang

Thank you for your interest in contributing to the Hindu Panchang project! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please be respectful and considerate of others.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/hindu-panchang.git`
3. Create a new branch for your feature: `git checkout -b feature/your-feature-name`
4. Install dependencies: `npm install`
5. Start the development server: `npm run dev`

## Development Workflow

### Branch Naming Convention

- `feature/` - for new features
- `fix/` - for bug fixes
- `docs/` - for documentation changes
- `refactor/` - for code refactoring
- `test/` - for adding or updating tests

### Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - a new feature
- `fix:` - a bug fix
- `docs:` - documentation changes
- `style:` - changes that do not affect the meaning of the code (formatting, etc.)
- `refactor:` - code changes that neither fix a bug nor add a feature
- `test:` - adding or updating tests
- `chore:` - changes to the build process or auxiliary tools

Example: `feat: add celestial visualization component`

### Testing

All new features and bug fixes should include tests. Run tests with:

```bash
npm test
```

Make sure all tests pass before submitting a pull request.

### Code Style

We use ESLint and Prettier for code formatting. Run linting with:

```bash
npm run lint
```

## Pull Request Process

1. Update the README.md with details of changes if applicable
2. Update the documentation with details of any new features or changes
3. The PR should work with the latest version of the codebase
4. Make sure all tests pass
5. Include a clear description of the changes in your PR
6. Link any related issues in your PR description

## Branch Protection

The `main` branch is protected:

- All PRs require passing CI checks before merging
- Direct pushes to `main` are not allowed
- At least one review is required before merging

## Deployment

When changes are merged to `main`, they are automatically deployed to GitHub Pages. You can also manually deploy by running:

```bash
npm run deploy
```

## Documentation

Please update documentation when making changes:

- Update JSDoc comments for functions and components
- Update README.md for major changes
- Update any relevant documentation files

## Questions?

If you have any questions or need help, please open an issue or reach out to the maintainers.

Thank you for contributing! 
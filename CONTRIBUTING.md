# Contributing to RWAPACT SDK

Thank you for your interest in contributing to the **RWAPACT SDK**! We welcome contributions from developers, quantitative analysts, and Web3 security researchers.

---

## Development Setup

### Prerequisites
- Node.js >= 18.0.0
- npm or pnpm / yarn

### Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/RWAPACT/rwapact-sdk.git
   cd rwapact-sdk
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the build in development watch mode:
   ```bash
   npm run dev
   ```

4. Run the test suite:
   ```bash
   npm test
   ```

5. Check TypeScript types:
   ```bash
   npm run typecheck
   ```

---

## Contribution Workflow

1. **Create an Issue**: Before starting substantial work, open an issue to discuss your proposed feature or fix.
2. **Branch Naming**:
   - `feat/feature-name` for new capabilities.
   - `fix/bug-description` for bug fixes.
   - `docs/documentation-update` for documentation changes.
3. **Commit Messages**: Follow Conventional Commits format:
   - `feat: add slippage estimation helper`
   - `fix: correct ERC-8004 sessionId encoding`
   - `docs: update quickstart guide`
4. **Testing**: Add unit tests for any new functionality in `tests/`.
5. **Code Style**: Ensure clean code, TypeScript strict mode compliance, and zero linter warnings.

---

## Pull Request Guidelines

- Ensure your branch is rebased on `main`.
- Verify `npm run typecheck`, `npm test`, and `npm run build` succeed cleanly.
- Provide a concise PR description explaining the changes and linking related issues.

---

## Questions?

Feel free to open an issue or reach out via our community channels.

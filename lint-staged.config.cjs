module.exports = {
  "apps/back-end/**/*.{ts,tsx,js}": [
    "cd apps/back-end && npm run lint --if-present -- --fix",
    "cd apps/back-end && npm run format:fix --if-present",
  ],
  "apps/frontend/**/*.{ts,tsx,js}": [
    "cd apps/frontend && npm run lint --if-present -- --fix",
  ],
  "*.{json,md}": [
    "cd apps/frontend && npm run format:fix --if-present",
  ],
};

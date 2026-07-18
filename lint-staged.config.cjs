module.exports = {
  "apps/back-end/**/*.{ts,tsx,js}": [
    "cd apps/back-end && npm run lint --if-present -- --fix",
    "cd apps/back-end && npm run format:fix --if-present",
  ],
  "apps/front-end/**/*.{ts,tsx,js}": [
    "cd apps/front-end && npm run lint --if-present -- --fix",
  ],
  "*.{json,md}": [
    "cd apps/back-end && npm run format:fix --if-present",
    "cd apps/front-end && npm run format:fix --if-present",
  ],
};

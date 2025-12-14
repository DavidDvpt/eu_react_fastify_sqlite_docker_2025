module.exports = {
  "back-end/**/*.{ts,tsx,js}": [
    "cd back-end && npm run lint --if-present -- --fix",
    "cd back-end && npm run format:fix --if-present",
  ],
  "front-end/**/*.{ts,tsx,js}": [
    "cd front-end && npm run lint --if-present -- --fix",
  ],
  "*.{json,md}": [
    "cd back-end && npm run format:fix --if-present",
    "cd front-end && npm run format:fix --if-present",
  ],
};

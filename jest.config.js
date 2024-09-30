module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.js?$": "babel-jest",
  },
  transformIgnorePatterns: ["/node_modules/(?!axios/.*)"],
};

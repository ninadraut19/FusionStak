const PROXY_CONFIG = [
  {
    context: [
      "/weatherforecast",
    ],
    target: "https://localhost:7060",
    secure: false
  }
]

module.exports = PROXY_CONFIG;

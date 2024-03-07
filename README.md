# 🚀 TAP-DATA-SERVICE DEMO 🚀

This NestJS application processes 📊 .CSV files to aggregate tap data over specified intervals (daily 📅, weekly 📆, monthly 🗓️), returning the date range for each interval along with the total number of taps during that period. Access to the API requires an API key 🔑 associated with a team (`team_id` in `data/interview-tags.csv`). The association between API keys and teams is managed in `src/auth/auth.service.ts`. Note that the `teamId` used in requests must match a `team_id` in `interview-tags.csv`, and the `Authorization` header must contain a valid API key. The application uses `nestjs/throttler` to limit API users to 100 queries per hour ⏳.

## 🛠 Setup and Installation

**Clone the repository and install dependencies:**

```bash
git clone git@github.com:byennen/tap-data-service.git
cd tap-data-service
npm install
```

## 🚀 Running the Application

**Start the application in development mode:**

```bash
npm run start:dev
```

**Run tests:**

```bash
npm run test
```

## 📡 Making API Requests

Before making requests, ensure you have a valid API key. Replace `exampleKey1` in the curl commands with your actual API key.

### 📅 Daily Aggregation

```bash
curl --location 'localhost:3000/taps/aggregate?interval=day&start=2022-07-01&end=2022-07-31' \
--header 'Authorization: Bearer exampleKey1'
```

### 📆 Weekly Aggregation

```bash
curl --location 'localhost:3000/taps/aggregate?interval=week&start=2022-07-01&end=2022-07-31' \
--header 'Authorization: Bearer exampleKey1'
```

### 🗓️ Monthly Aggregation

```bash
curl --location 'localhost:3000/taps/aggregate?interval=month&start=2022-07-01&end=2022-07-31' \
--header 'Authorization: Bearer exampleKey1'
```

## 🛠️ Additional Information

### ❗ Error Handling

Be mindful of common errors such as exceeding rate limits or providing invalid API keys. The API responds with appropriate HTTP status codes and messages to guide you in resolving such issues.

### 🚦 Rate Limiting

The API limits users to 100 queries per hour to ensure fair usage and system stability. Exceeding this limit will result in a `429 Too Many Requests` response. It is advisable to implement retry mechanisms or handle this response gracefully in your client application.

---

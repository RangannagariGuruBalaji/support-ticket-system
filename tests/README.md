# Support Ticket System - Automated Test Suite Documentation

## Overview

The Support Ticket System includes automated unit and integration tests built with **Jest** and **Supertest**.

## Test File Locations

Automated test files are located in `backend/tests/`:
- `backend/tests/auth.test.js`: Authentication (Register, Login, Password validation, Duplicate email checks)
- `backend/tests/ticket.test.js`: Ticket CRUD, Customer ticket isolation, Agent permissions, JOIN query test
- `backend/tests/comment.test.js`: Comment creation, Retrieval, Ticket authorization
- `backend/tests/user.test.js`: Agent user listing, Customer role restriction (403 check)
- `backend/tests/health.test.js`: Health check API monitoring

## How to Run Tests

From the `backend/` directory:

```bash
npm test
```

All 39+ automated tests run in-memory without requiring an active MySQL connection.

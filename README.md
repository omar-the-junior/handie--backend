# Handie Backend API Documentation

## Overview

The Handie Backend API is a robust and well-structured backend service designed to handle various functionalities for the Handie application. This document highlights the key features, technologies, and best practices used in the development of this API.

## Startup Instructions

> [!note]
> This requires docker to be installed on your device


### Add the a `.env` file to the root directory and include the following vars:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/handie_dev?schema=public"
JWT_SECRET="aa7aebf630be3b088ceb51620c11e2b82a37b6280667be6285f7be729d4cc85f"
REFRESH_TOKEN_SECRET="3c8f01a4747e55835d25ae6c03dcc61590c498c2a84a0540ddad3cf250706126"
```

### Install required dependancies

```sh
pnpm install
```

### Run the backend
```
pnpm dev
```

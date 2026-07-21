# TradeSift Backend API Reference

## Base URL

All endpoints are mounted under:

- `POST /api/auth/...`

The backend uses JSON request bodies and returns JSON responses.

---

## Global response structure

Successful responses:

```json
{
  "success": true,
  "message": "...",
  "data": { ... }
}
```

Error responses:

```json
{
  "success": false,
  "message": "..."
}
```

---

## Authentication endpoints

### 1. Register user

- Endpoint: `POST /api/auth/register`
- Auth: no
- Purpose: start user registration and send OTP to email.

Request body:

```json
{
  "firstName": "string",
  "lastName": "string",
  "organisation": "string", // optional
  "email": "string",
  "password": "string",
  "passwordConfirmation": "string"
}
```

Response:

```json
{
  "success": true,
  "message": "OTP sent to your email.",
  "data": {
    "email": "user@example.com"
  }
}
```

Notes:
- Password must be at least 8 characters and include uppercase, number, and special character.
- `passwordConfirmation` must match `password`.

---

### 2. Resend registration OTP

- Endpoint: `POST /api/auth/register/resend-otp`
- Auth: no
- Purpose: resend the registration OTP if the previous code expired or was not received.

Request body:

```json
{
  "email": "string"
}
```

Response:

```json
{
  "success": true,
  "message": "OTP resent to your email.",
  "data": {
    "email": "user@example.com"
  }
}
```

---

### 3. Verify registration OTP

- Endpoint: `POST /api/auth/register/verify-otp`
- Auth: no
- Purpose: verify registration OTP and create the user account.

Request body:

```json
{
  "email": "string",
  "otp": "string"
}
```

Response:

```json
{
  "success": true,
  "message": "Registration complete.",
  "data": {
    "id": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "organisation": "string | null",
    "createdAt": "string"
  }
}
```

---

### 4. Login

- Endpoint: `POST /api/auth/login`
- Auth: no
- Purpose: authenticate user credentials and either log in immediately for a trusted device or begin OTP verification.

Request body:

```json
{
  "email": "string",
  "password": "string",
  "rememberDevice": true
}
```

Response cases:

1) Trusted device login success:

```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "user": {
      "id": "string",
      "email": "string"
    }
  }
}
```

Cookies set:
- `access_token`
- `refresh_token`

2) OTP required:

```json
{
  "success": true,
  "message": "OTP sent to your email.",
  "data": {
    "email": "string"
  }
}
```

Notes:
- If `rememberDevice` is `true`, the backend may later set a trusted device cookie on OTP verification.
- The login flow may require a second OTP verification step.

---

### 5. Resend login OTP

- Endpoint: `POST /api/auth/login/resend-otp`
- Auth: no
- Purpose: resend OTP for a login attempt that requires verification.

Request body:

```json
{
  "email": "string"
}
```

Response:

```json
{
  "success": true,
  "message": "OTP resent to your email.",
  "data": {
    "email": "string"
  }
}
```

---

### 6. Verify login OTP

- Endpoint: `POST /api/auth/login/verify-otp`
- Auth: no
- Purpose: complete login with OTP and set auth cookies.

Request body:

```json
{
  "email": "string",
  "otp": "string"
}
```

Response:

```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "user": {
      "id": "string",
      "email": "string"
    }
  }
}
```

Cookies set:
- `access_token`
- `refresh_token`
- `trusted_device_id` (only when the user chose to remember the device)

---

### 7. Logout

- Endpoint: `POST /api/auth/logout`
- Auth: no (uses refresh cookie if present)
- Purpose: clear auth session and cookies.

Request body: none

Response:

```json
{
  "success": true,
  "message": "Logged out successfully.",
  "data": null
}
```

Notes:
- The backend reads `refresh_token` cookie if present and then clears the auth cookies.

---

### 8. Change password

- Endpoint: `POST /api/auth/change-password`
- Auth: yes
- Purpose: change a logged-in user's password.

Request body:

```json
{
  "currentPassword": "string",
  "newPassword": "string",
  "newPasswordConfirmation": "string"
}
```

Response:

```json
{
  "success": true,
  "message": "Password changed successfully. Please log in again.",
  "data": null
}
```

Notes:
- This endpoint requires `access_token` cookie.
- After a successful password change, auth cookies are cleared and the user must log in again.

---

### 9. Forgot password request

- Endpoint: `POST /api/auth/forgot-password`
- Auth: no
- Purpose: start password reset by sending a reset OTP to email.

Request body:

```json
{
  "email": "string"
}
```

Response:

```json
{
  "success": true,
  "message": "If an account exists, a code has been sent.",
  "data": null
}
```

---

### 10. Resend forgot-password OTP

- Endpoint: `POST /api/auth/forgot-password/resend-otp`
- Auth: no
- Purpose: resend the password reset OTP.

Request body:

```json
{
  "email": "string"
}
```

Response:

```json
{
  "success": true,
  "message": "If an account exists, a new code has been sent.",
  "data": null
}
```
```

---

### 11. Verify forgot-password OTP

- Endpoint: `POST /api/auth/forgot-password/verify-otp`
- Auth: no
- Purpose: verify the reset OTP before allowing password reset.

Request body:

```json
{
  "email": "string",
  "otp": "string"
}
```

Response:

```json
{
  "success": true,
  "message": "OTP verified. You may now set a new password.",
  "data": null
}
```

---

### 12. Reset password

- Endpoint: `POST /api/auth/forgot-password/reset-password`
- Auth: no
- Purpose: finalize password reset with a new password.

Request body:

```json
{
  "email": "string",
  "newPassword": "string",
  "newPasswordConfirmation": "string"
}
```

Response:

```json
{
  "success": true,
  "message": "Password reset successfully. Please log in.",
  "data": null
}
```

---

## Cookies used by frontend

- `access_token` – HTTP-only auth access token
- `refresh_token` – HTTP-only refresh token
- `trusted_device_id` – HTTP-only trusted device identifier

Notes:
- `access_token` is required for `POST /api/auth/change-password`.
- Set `credentials: 'include'` on frontend requests to include cookies.
- All auth cookies are HTTP-only and cannot be read by client-side JavaScript.

---

## Frontend request guidance

- Use `Content-Type: application/json`.
- Use `credentials: 'include'` for requests that depend on cookies.
- Validate frontend forms to match backend input requirements:
  - email must be valid
  - password rules require uppercase, number, special character
  - OTP must be numeric and fixed length

---

## Notes for frontend developers

- The registration flow is two-step: `register` -> `register/verify-otp`.
- The login flow may be either direct or OTP-based depending on trusted device state.
- After `login/verify-otp`, the backend sets auth cookies automatically.
- The `change-password` route clears auth cookies, so the user should be redirected to login afterwards.

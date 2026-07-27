# TradeSift Backend API Reference

## Base URL

All authentication endpoints are mounted under `/api/auth`.

Most endpoints use `POST`; Google OAuth uses `GET`.

The backend uses JSON request bodies and returns JSON responses, except the Google callback route which redirects the browser.

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
  "passwordConfirmation": "string",
  "agreedToTerms": true
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
- Password must be at least 8 characters and include an uppercase letter, a number, and a special character.
- `passwordConfirmation` must match `password`.
- `agreedToTerms` must be `true`.
- The registration OTP expires in 5 minutes.

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

Notes:
- OTP resend requests are rate limited. Clients should wait at least 30 seconds between resend attempts.

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

Notes:
- Registration is finalized only after OTP verification.
- Incorrect OTP attempts are limited.

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
  "rememberDevice": false
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
- If a valid `trusted_device_id` cookie exists, login may complete immediately without OTP.
- If `rememberDevice` is `true`, the backend may later set a trusted device cookie during OTP verification.
- The login flow may require a second `login/verify-otp` step.
- The direct trusted-device login user object may include additional profile fields when available.

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

Notes:
- OTP resend requests are rate limited. Clients should wait at least 30 seconds between resend attempts.

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
- `trusted_device_id` (only when the login session requested device remember)

Notes:
- The cookie `trusted_device_id` is only created when `rememberDevice` was true during the initial `login` request.
- Incorrect OTP attempts are limited and can expire the pending login session.

---

### 7. Google OAuth redirect

- Endpoint: `GET /api/auth/google`
- Auth: no
- Purpose: redirect the browser to Google OAuth consent.

Response:
- Redirects the user to Google’s OAuth consent screen.

---

### 8. Google OAuth callback

- Endpoint: `GET /api/auth/google/callback`
- Auth: no
- Purpose: complete Google sign-in and create or sign in a user.

Behavior:
- On success, the backend sets `access_token` and `refresh_token` cookies and redirects the browser to the frontend dashboard.
- On error, the backend redirects to the frontend login page with an error query parameter.

Notes:
- Google sign-in bypasses the OTP/trusted-device flow.
- This endpoint does not return JSON in the current implementation; it uses redirects.

---

### 9. Logout

- Endpoint: `POST /api/auth/logout`
- Auth: no
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
- The backend reads the `refresh_token` cookie if present to revoke the session.
- It always clears auth cookies after logout.

---

### 10. Refresh token

- Endpoint: `POST /api/auth/refresh`
- Auth: no
- Purpose: renew the user's access session using the refresh token cookie.

Request body: none

Response:

```json
{
  "success": true,
  "message": "Token refreshed.",
  "data": null
}
```

Cookies set:
- `access_token`
- `refresh_token`

Notes:
- This endpoint requires the `refresh_token` cookie.
- It issues a new `access_token` and a new `refresh_token`.
- If the refresh token is invalid or expired, the session is revoked and the client must log in again.

---

### 11. Change password

- Endpoint: `POST /api/auth/change-password`
- Auth: yes
- Purpose: change a logged-in user's password.

Request body:

```json
{
  "currentPassword": "string", // optional if the account has no existing password
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
- This endpoint requires a valid `access_token` cookie.
- If the user has an existing password, `currentPassword` is required.
- After a successful password change, all sessions and trusted devices are revoked and auth cookies are cleared.

---

### 12. Forgot password request

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

Notes:
- The response is intentionally generic and does not reveal whether the email exists.

---

### 13. Resend forgot-password OTP

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

Notes:
- The response remains generic even if the email is not associated with an account.
- OTP resend is rate limited and may reject too-frequent requests.

---

### 14. Verify forgot-password OTP

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

Notes:
- OTP verification enables the next step and preserves the pending password reset session for a short time.

---

### 15. Reset password

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

Notes:
- This endpoint requires a previously verified forgot-password OTP session.
- After reset, all sessions and trusted devices for the account are revoked.

---

## User endpoints

### 1. Get current profile

- Endpoint: `GET /api/users/me`
- Auth: yes
- Purpose: fetch the authenticated user's profile.

Response:

```json
{
  "success": true,
  "message": "Profile fetched.",
  "data": {
    "id": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "organisation": "string | null"
  }
}
```

Notes:
- Requires a valid `access_token` cookie.
- Returns a sanitized user object without the password.

---

### 2. Update current profile

- Endpoint: `PATCH /api/users/me`
- Auth: yes
- Purpose: update the authenticated user's allowed profile fields.

Request body:

```json
{
  "firstName": "string", // optional
  "lastName": "string", // optional
  "organisation": "string" // optional
}
```

Response:

```json
{
  "success": true,
  "message": "Profile updated.",
  "data": {
    "id": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "organisation": "string | null"
  }
}
```

Notes:
- Requires a valid `access_token` cookie.
- Only the provided fields are updated.

---

### 3. Delete current account

- Endpoint: `DELETE /api/users/me`
- Auth: yes
- Purpose: delete the authenticated user's account and clear auth cookies.

Request body: none

Response:

```json
{
  "success": true,
  "message": "Account deleted.",
  "data": null
}
```

Notes:
- Requires a valid `access_token` cookie.
- Deletes the user account and associated sessions/trusted devices.
- Clears `access_token`, `refresh_token`, and `trusted_device_id` cookies.

---

### 4. Get all users (development only)

- Endpoint: `GET /api/users/`
- Auth: no
- Purpose: retrieve all user accounts for testing.

Response:

```json
{
  "success": true,
  "message": "All users fetched.",
  "data": [
    {
      "id": "string",
      "email": "string",
      "firstName": "string",
      "lastName": "string",
      "organisation": "string | null"
    }
  ]
}
```

Notes:
- Available only when `NODE_ENV !== 'production'`.
- This route is intended for development/testing only.

---

### 5. Delete all users (development only)

- Endpoint: `DELETE /api/users/`
- Auth: no
- Purpose: delete all user accounts and related test data.

Response:

```json
{
  "success": true,
  "message": "All users deleted.",
  "data": null
}
```

Notes:
- Available only when `NODE_ENV !== 'production'`.
- Deletes all users, sessions, trusted devices, and cooldown records.

---

## Cookies used by frontend

- `access_token` – HTTP-only auth access token
- `refresh_token` – HTTP-only refresh token
- `trusted_device_id` – HTTP-only trusted device identifier

Notes:
- `access_token` is required for `POST /api/auth/change-password`.
- `refresh_token` is required for `POST /api/auth/refresh` and is used by `POST /api/auth/logout` when present.
- `trusted_device_id` is used to skip OTP when the device is trusted.
- Set `credentials: 'include'` on frontend requests to include cookies.
- All auth cookies are HTTP-only and not readable by client-side JavaScript.
- Cookies are set with `SameSite=Lax` and `Secure` in production.

---

## Frontend request guidance

- Use `Content-Type: application/json`.
- Use `credentials: 'include'` for requests that depend on cookies.
- Required cookie-based requests include `login` when a trusted device login succeeds, `login/verify-otp`, `refresh`, `logout`, and `change-password`.
- Validate frontend forms to match backend input requirements:
  - email must be valid
  - password rules require uppercase, number, and special character
  - OTP must be numeric and fixed length

---

## Notes for frontend developers

- The registration flow is two-step: `register` -> `register/verify-otp`.
- The login flow may be either direct or OTP-based depending on trusted device state.
- If login does not complete immediately, the backend sends OTP and the user must call `login/verify-otp`.
- After successful `login/verify-otp`, the backend sets `access_token` and `refresh_token` cookies, and may also set `trusted_device_id` when device trust is granted.
- The `refresh` endpoint uses the `refresh_token` cookie to issue new `access_token` and `refresh_token` cookies.
- The `change-password` route requires authentication and clears `access_token`, `refresh_token`, and `trusted_device_id` cookies.
- After successful password change, the frontend should redirect the user to the login page.
- Google OAuth uses redirect-based completion; the callback does not return a JSON payload in the current code.

// // users.routes.ts
// import { Router } from 'express';
// import { requireAuth } from '../../middleware/auth.middleware.js';
// import { validate } from '../../middleware/validation.middleware.js';
// import { updateUserSchema } from './user.schema.js';
// import {
//   getMe,
//   updateMe,
//   deleteMe,
//   getAllUsers,
//   deleteAllUsers,
// } from './user.controller.js';
// import { env } from '../../config/env.js';

// const router = Router();

// router.get('/me', requireAuth, getMe);
// router.patch('/me', requireAuth, validate(updateUserSchema), updateMe);
// router.delete('/me', requireAuth, deleteMe);

// // TEMP: testing-only, no auth, disabled in production
// if (env.NODE_ENV !== 'production') {
//   router.get('/', getAllUsers);
//   router.delete('/', deleteAllUsers);
// }

// export default router;
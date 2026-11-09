# Authentication migration and release gates

The previous prototype accepted an email address without verifying a password and trusted an `x-user-id` request header. That is unsafe for real student data.

The new branch introduces salted scrypt password credentials, an 8-hour opaque HttpOnly SameSite=Strict session cookie, server-derived user identity for protected API routes, login and registration throttles, and logout revocation.

## Existing demo accounts

- Seed accounts **do not** have credentials, and must never be claimed by registering their email address.
- Existing seeded accounts are deliberately blocked from passwordless login. A migration must verify account ownership out-of-band and provision new credentials; do not copy seed records into the credential registry automatically.
- New registrations are students only. Do not grant admin roles from registration payloads.
- Private data remains under `data/`, which must not be committed or exposed as a static directory.

## Release checks

1. Confirm HTTPS termination and secure session cookies in production.
2. Run the full build, type-check and regression suite.
3. Verify unauthenticated requests to private APIs return 401 and forged `x-user-id` values cannot select another account.
4. Confirm CSRF defenses, rate limiting, session expiration, logout, account ownership and upload controls.
5. Configure durable shared session/rate-limit storage before scaling to multiple server instances.
6. Have an administrator approve and perform legacy account migration; there is no automatic password reset or email verification yet.

Do not deploy this branch as a production release until these checks are complete.

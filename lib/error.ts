// lib/errors.ts
export class ForbiddenError extends Error { kind = "toast"; status = 403; }
export class AuthRequiredError extends Error { kind = "redirect"; status = 401; redirectTo = "/login"; }
export class FatalError extends Error { kind = "page"; status = 500; }
export class NormalError extends Error { kind = "toast"; status = 400; }
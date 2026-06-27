/**
 * @file ai.service.js
 * @module ai/ai.service
 *
 * Public facade for the AI Decision Intelligence Platform layer.
 *
 * Responsibilities:
 * - Expose a stable, application-facing API for AI-powered operations
 * - Delegate workflow execution to the orchestrator and provider factory
 * - Translate domain inputs (interviews, topics, user context) into workflow requests
 * - Normalize outputs and errors for controllers and other service consumers
 *
 * This is the single integration point for the rest of the application;
 * callers should not import providers, prompts, or orchestrator modules directly.
 */

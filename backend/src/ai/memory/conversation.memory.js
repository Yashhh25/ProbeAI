/**
 * @file conversation.memory.js
 * @module ai/memory/conversation.memory
 *
 * Conversation state and context management for multi-turn AI workflows.
 *
 * Responsibilities:
 * - Persist and retrieve transcript history per interview or session
 * - Apply windowing, summarization, or truncation strategies for token limits
 * - Expose a consistent message format (role, content, metadata) to upstream layers
 * - Support read/write operations without coupling to a specific storage backend
 *
 * Memory concerns are isolated here so orchestrator and service layers
 * remain storage-agnostic.
 */

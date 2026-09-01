import { AsyncLocalStorage } from 'node:async_hooks';
import 'server-only';

export interface RequestContext {
  requestId: string;
  consumerId?: string;
  adminId?: string;
}

const storage = new AsyncLocalStorage<RequestContext>();

export function runWithRequestContext<T>(context: RequestContext, callback: () => T): T {
  return storage.run(context, callback);
}

export function getRequestContext(): RequestContext | undefined {
  return storage.getStore();
}

export function getRequestId(): string | undefined {
  return storage.getStore()?.requestId;
}

// Attach identifiers discovered after the context was opened (e.g. the
// authenticated consumer, resolved mid-request). Mutates the active store;
// no-op when called outside a request context.
export function setRequestActor(actor: { consumerId?: string; adminId?: string }): void {
  const store = storage.getStore();
  if (!store) {
    return;
  }

  if (actor.consumerId !== undefined) {
    store.consumerId = actor.consumerId;
  }
  if (actor.adminId !== undefined) {
    store.adminId = actor.adminId;
  }
}

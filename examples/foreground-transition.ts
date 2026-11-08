/** Copyable orchestration example, not an exported platform/SDK adapter.
 * Durable victory/rewards must be committed before requesting a transition.
 */
export class ForegroundTransition<Key, Target> {
  private pending: { ticket: Readonly<{ key: Key; target: Target }>; ready: boolean } | undefined;
  request(key: Key, target: Target): Readonly<{ key: Key; target: Target }> {
    const ticket = Object.freeze({ key, target });
    this.pending = { ticket, ready: false };
    return ticket;
  }
  complete(ticket: Readonly<{ key: Key; target: Target }>): void {
    if (this.pending?.ticket === ticket) this.pending.ready = true;
  }
  cancel(): void { this.pending = undefined; }
  /** Re-evaluate on both SDK settlement and every relevant activity change. */
  tryRun(key: Key, allowed: boolean, execute: (target: Target) => void): boolean {
    const request = this.pending;
    if (!request) return false;
    if (request.ticket.key !== key) { this.cancel(); return false; }
    if (!request.ready || !allowed) return false;
    this.cancel(); // Consume before navigation, including reentrant callbacks/errors.
    execute(request.ticket.target);
    return true;
  }
}

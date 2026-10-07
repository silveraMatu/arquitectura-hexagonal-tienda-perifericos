/** Serializes async tasks that share the same key, so concurrent writes to the same aggregate don't interleave. */
export class KeyedAsyncLock {
  private readonly tails = new Map<string, Promise<void>>();

  async runExclusive<T>(key: string, task: () => Promise<T> | T): Promise<T> {
    const previous = this.tails.get(key) ?? Promise.resolve();
    const result = previous.then(() => task());

    this.tails.set(
      key,
      result.then(
        () => undefined,
        () => undefined,
      ),
    );

    return result;
  }
}

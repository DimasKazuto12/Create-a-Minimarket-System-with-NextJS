export async function withRetry<T>(run: () => Promise<T>, attempts = 3): Promise<T> {
  for (let attempt = 1; ; attempt++) {
    try {
      return await run();
    } catch (error) {
      const source = error instanceof Error && error.cause ? error.cause : error;
      const code =
        typeof source === "object" && source && "sqlState" in source ? source.sqlState : null;
      // 40001 = serialization failure, 40P01 = deadlock
      if ((code !== "40001" && code !== "40P01") || attempt === attempts) throw error;
    }
  }
}
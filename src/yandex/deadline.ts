/** Bounds waiting only; never treats an SDK timeout as cancellation. */
export async function withDeadline<T>(task: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([task, new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error('Optional SDK deadline exceeded')), ms);
    })]);
  } finally { clearTimeout(timer); }
}

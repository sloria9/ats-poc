function ensurePromiseTry() {
  const PromiseWithTry = Promise as PromiseConstructor & {
    try?: <T, TArgs extends unknown[]>(
      callback: (...args: TArgs) => T | PromiseLike<T>,
      ...args: TArgs
    ) => Promise<Awaited<T>>;
  };

  if (!PromiseWithTry.try) {
    PromiseWithTry.try = async function <T, TArgs extends unknown[]>(
      callback: (...args: TArgs) => T | PromiseLike<T>,
      ...args: TArgs
    ): Promise<Awaited<T>> {
      return await callback(...args);
    };
  }
}

export async function extractCvText(buffer: ArrayBuffer) {
  ensurePromiseTry();

  const { extractText, getDocumentProxy } = await import("unpdf");

  const pdf = await getDocumentProxy(new Uint8Array(buffer));

  const { totalPages, text } = await extractText(pdf, {
    mergePages: true,
  });

  const normalizedText = Array.isArray(text) ? text.join("\n\n") : text;

  return {
    totalPages,
    text: normalizedText
      .replace(/\r/g, "")
      .replace(/[ \t]+/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim(),
  };
}

export function wrapKeyIfNeeded(key: string) {
  const validKey = /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key);
  return validKey ? key : `'${key}'`;
}

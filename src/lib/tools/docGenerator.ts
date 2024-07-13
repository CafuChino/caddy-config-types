// change a doc string to js doc
export function changeDocStringToJsDoc(doc: string) {
  if (!doc) return "";
  const prefix = "/**\n * ";
  const suffix = " */\n";
  // replace all '\n' with '\n * '
  const content = doc
    .split("\n")
    .filter((s) => s)
    .join("\n * ");
  return prefix + content + suffix;
}

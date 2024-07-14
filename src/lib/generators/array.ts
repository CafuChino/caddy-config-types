import { CaddyDocConfigStructureArray } from "../../../interfaces/index.ts";
import InterfaceGenerator, { GeneratorCtx } from "./index.ts";
import { getPlainTypeStr } from "../tools/getPlainTypeStr.ts";
import { wrapKeyIfNeeded } from "../tools/wrapKeyIfNeeded.ts";
import { changeDocStringToJsDoc } from "../tools/docGenerator.ts";

export default async function GeneratorArray(
  ctx: GeneratorCtx,
  path: string,
  key: string,
  s: CaddyDocConfigStructureArray,
) {
  let result = "";
  // Insert doc as multiline comment
  result += changeDocStringToJsDoc(s.doc);

  const { elems } = s;
  const typeName = getPlainTypeStr(elems);
  // if elems is a struct, we need to generate an interface for it
  if (
    elems.type === "struct" ||
    elems.type === "module" ||
    elems.type === "array" ||
    elems.type === "map" ||
    elems.type === "module_map"
  ) {
    await InterfaceGenerator(ctx, `${path}${key}/`, key, elems);
  }
  result += `  ${wrapKeyIfNeeded(key)}?: Array<${typeName}>;\n`;
  return result;
}

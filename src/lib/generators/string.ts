import { CaddyDocConfigStructureString } from "../../../interfaces/index.ts";
import { GeneratorCtx } from "./index.ts";
import { wrapKeyIfNeeded } from "../tools/wrapKeyIfNeeded.ts";
import { changeDocStringToJsDoc } from "../tools/docGenerator.ts";

export default async function GeneratorString(
  ctx: GeneratorCtx,
  path: string,
  key: string,
  s: CaddyDocConfigStructureString,
) {
  let result = "";
  // Insert doc as multiline comment
  result += changeDocStringToJsDoc(s.doc);

  // Insert key and type

  result += `  ${wrapKeyIfNeeded(key)}?: string;\n`;
  return result;
}

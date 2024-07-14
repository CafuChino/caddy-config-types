import {
  CaddyDocConfigStructureFloat,
  CaddyDocConfigStructureInt,
  CaddyDocConfigStructureUint,
} from "../../../interfaces/index.ts";
import { GeneratorCtx } from "./index.ts";
import { getInterfaceName } from "../tools/getInterfaceName.ts";
import { wrapKeyIfNeeded } from "../tools/wrapKeyIfNeeded.ts";
import { changeDocStringToJsDoc } from "../tools/docGenerator.ts";

export default async function GeneratorInt(
  ctx: GeneratorCtx,
  path: string,
  key: string,
  s:
    | CaddyDocConfigStructureInt
    | CaddyDocConfigStructureUint
    | CaddyDocConfigStructureFloat,
) {
  const { doc, type_name } = s;
  let result = "";
  result += changeDocStringToJsDoc(s.doc);
  if (type_name) {
    const typeName = getInterfaceName(type_name);
    // check if the interface is already generated
    if (!ctx.interfaceSet.has(typeName)) {
      let typeResult = "";
      // Add docs
      typeResult += changeDocStringToJsDoc(s.doc);
      // Add type alias
      typeResult += `export type ${typeName} = number;\n\n`;
      // Add it to the set
      ctx.interfaceSet.add(typeName);
      // set the interface to the map
      ctx.interfaceMap.set(typeName, typeResult);
    }
    result += `  ${wrapKeyIfNeeded(key)}?: ${typeName};\n`;
  } else {
    result += `  ${wrapKeyIfNeeded(key)}?: number;\n`;
  }
  return result;
}

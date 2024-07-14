import InterfaceGenerator, { GeneratorCtx } from "./index.ts";
import { CaddyDocConfigStructureStruct } from "../../../interfaces/index.ts";
import { getInterfaceName } from "../tools/getInterfaceName.ts";
import { join } from "jsr:@std/path";
import { wrapKeyIfNeeded } from "../tools/wrapKeyIfNeeded.ts";
import { changeDocStringToJsDoc } from "../tools/docGenerator.ts";

// A struct should be defined as an interface
export default async function GeneratorStruct(
  ctx: GeneratorCtx,
  path: string,
  key: string,
  s: CaddyDocConfigStructureStruct,
) {
  const interfaceName = getInterfaceName(s.type_name || key);
  // Check if the interface is already defined
  if (ctx.interfaceSet.has(interfaceName)) {
    // If it is, return
    return `  ${wrapKeyIfNeeded(key)}?: ${interfaceName};\n`;
  }

  let interfaceResult = "";

  // Add docs
  interfaceResult += changeDocStringToJsDoc(s.doc);

  // Add interface
  interfaceResult += `export interface ${interfaceName} {\n`;
  // Add it to the set
  ctx.interfaceSet.add(interfaceName);
  if (
    (!s.struct_fields || s.struct_fields?.length === 0) &&
    !s.module_inline_key
  ) {
    let interfaceResult = "";
    // add doc
    interfaceResult += `  /**\n`;
    interfaceResult += `   * ${s.doc}\n`;
    interfaceResult += `   */\n`;
    // add type alias to any record
    interfaceResult += `export type ${interfaceName} = Record<string, any>;\n`;
    ctx.interfaceMap.set(interfaceName, interfaceResult);
    return `  ${wrapKeyIfNeeded(key)}?: ${interfaceName};\n`;
  }
  // Add fields
  if (s.module_inline_key) {
    // module_inline_key is required
    interfaceResult += `  ${s.module_inline_key}: '${key}';\n`;
  }
  for (const field of s.struct_fields || []) {
    interfaceResult += await InterfaceGenerator(
      ctx,
      join(path, `/${key}/`),
      field.key,
      field.value,
    );
  }
  interfaceResult += `[key: string]: any;\n`;
  interfaceResult += `}\n\n`;

  // set the interface to the map
  ctx.interfaceMap.set(interfaceName, interfaceResult);
  return `  ${wrapKeyIfNeeded(key)}?: ${interfaceName};\n`;
}

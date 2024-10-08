import { CaddyDocConfigStructureInt } from "../../../interfaces/index.ts";
import { join } from "jsr:@std/path/join";
import InterfaceGenerator, { GeneratorCtx } from "./index.ts";
import { getInterfaceName } from "../tools/getInterfaceName.ts";
import { wrapKeyIfNeeded } from "../tools/wrapKeyIfNeeded.ts";
import { CaddyDocConfigStructureModuleMap } from "../../../interfaces/index.ts";
import { getDoc } from "../fetch.ts";
import { changeDocStringToJsDoc } from "../tools/docGenerator.ts";

export default async function GeneratorModuleMap(
  ctx: GeneratorCtx,
  path: string,
  key: string,
  s: CaddyDocConfigStructureModuleMap,
) {
  const { module_namespace } = s;

  const nameSpaceItem = ctx.namespaces[module_namespace];
  if (!nameSpaceItem) {
    console.error(
      `[GeneratorModuleMap]: namespace not found: ${module_namespace}`,
    );
    return `  ${
      wrapKeyIfNeeded(
        key,
      )
    }?: Record<string, any>; // namespace not found: ${module_namespace}\n`;
  }
  const namespaceInterfaceName = getInterfaceName(module_namespace || key);
  if (ctx.interfaceSet.has(namespaceInterfaceName)) {
    return `  ${key}: ${namespaceInterfaceName};\n`;
  }
  ctx.interfaceSet.add(namespaceInterfaceName);

  let result = "";
  result += changeDocStringToJsDoc(s.doc);
  result += `  ${wrapKeyIfNeeded(key)}?: ${namespaceInterfaceName};\n`;

  let interfaceResult = "";
  interfaceResult += `export interface ${namespaceInterfaceName} {\n`;

  const uniqueNames = new Set<string>();

  for (let item of nameSpaceItem) {
    if (uniqueNames.has(item.name)) {
      console.warn(
        `[GeneratorModuleMap]: duplicate interface name: ${item.name}`,
      );
      continue;
    }
    uniqueNames.add(item.name);
    const docApiPath = join(path, key, item.name, "/");
    console.log(`[GeneratorModuleMap]: Generating interface ${item.name}`);
    const { result } = await getDoc(docApiPath);
    ctx.namespaces = {
      ...ctx.namespaces,
      ...result.namespaces,
    };
    const name = getInterfaceName(result.structure.type_name);
    await InterfaceGenerator(ctx, docApiPath, item.name, result.structure);
    interfaceResult += `  ${item.name}?: ${name};\n`;
  }
  interfaceResult += `  [key: string]: any;\n`;
  interfaceResult += `}\n`;
  ctx.interfaceMap.set(namespaceInterfaceName, interfaceResult);
  return result;
}

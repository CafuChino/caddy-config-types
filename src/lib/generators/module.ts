import InterfaceGenerator, { GeneratorCtx } from "./index.ts";
import { CaddyDocConfigStructureModule } from "../../../interfaces/index.ts";
import { getDoc } from "../fetch.ts";
import { getInterfaceName } from "../tools/getInterfaceName.ts";
import { join } from "jsr:@std/path";
import { wrapKeyIfNeeded } from "../tools/wrapKeyIfNeeded.ts";
import { changeDocStringToJsDoc } from "../tools/docGenerator.ts";

// A module should be defined as a bunch of interfaces, and a type unions of them. Type of the key should be the union of the interfaces
export default async function GeneratorModule(
  ctx: GeneratorCtx,
  path: string,
  key: string,
  s: CaddyDocConfigStructureModule
) {
  let result = "";
  // Insert doc as multiline comment
  result += changeDocStringToJsDoc(s.doc);
  const { module_namespace } = s;
  const namespace = ctx.namespaces[module_namespace];
  // target namespace not found
  if (!namespace) {
    console.warn(
      `Namespace "${module_namespace}" required by module ${path}${key} not found`
    );
    // type of the key defaults to unknown as a fallback
    return `  ${wrapKeyIfNeeded(key)}?: Record<string, any>;\n`;
  }
  const namespaceInterfaceName = getInterfaceName(module_namespace);
  if (ctx.interfaceSet.has(namespaceInterfaceName)) {
    return `  ${wrapKeyIfNeeded(key)}?: ${namespaceInterfaceName};\n`;
  }
  ctx.interfaceSet.add(namespaceInterfaceName);

  console.log(
    `[Module ${path}${key}] Generating namespace interface ${namespaceInterfaceName}`
  );

  const interfaceNames = new Set<string>();

  // fetch each interface in the namespace
  for (const item of namespace) {
    try {
      const lastPath = path
        .split("/")
        .filter((item) => item)
        .pop();
      const docApiPath =
        lastPath === key
          ? join(path, item.name, "/")
          : join(path, key, item.name, "/");
      console.log(`[Module ${path}${key}] Generating interface ${item.name}`);
      const res = await getDoc(docApiPath);
      const { result } = res;
      ctx.namespaces = {
        ...ctx.namespaces,
        ...result.namespaces,
      };
      const name = getInterfaceName(result.structure.type_name);
      interfaceNames.add(name);
      await InterfaceGenerator(ctx, docApiPath, item.name, result.structure);
    } catch (e) {
      console.error(
        `[Module ${path}${key}] Error fetching interface ${item.name}:`,
        e
      );
      const name = getInterfaceName(item.name);
      interfaceNames.add(name);
      ctx.interfaceMap.set(name, `export type ${name} = Record<string, any>;`);
      console.error(
        `[Module ${path}${key}] Fallback: Generating interface ${name} as unknown`
      );
    }
  }

  // Add type union
  const typeUnion = `export type ${namespaceInterfaceName} = ${
    Array.from(interfaceNames)
      .filter((item) => item !== namespaceInterfaceName)
      .join(" | ") || "Record<string, any>"
  };\n`;
  ctx.interfaceMap.set(namespaceInterfaceName, typeUnion);
  result += `  ${wrapKeyIfNeeded(key)}?: ${namespaceInterfaceName};\n`;
  return result;
}

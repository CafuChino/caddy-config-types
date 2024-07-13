import InterfaceGenerator, {GeneratorCtx} from './index.ts';
import {
  CaddyDocConfigStructureStruct,
} from '../../../interfaces/index.ts';
import {getInterfaceName} from '../tools/getInterfaceName.ts';
import {join} from 'jsr:@std/path';
import {wrapKeyIfNeeded} from '../tools/wrapKeyIfNeeded.ts';

// A struct should be defined as an interface
export default async function GeneratorStruct (ctx: GeneratorCtx, path: string, key:string, s: CaddyDocConfigStructureStruct) {
  const interfaceName = getInterfaceName(s.type_name || key);
  // Check if the interface is already defined
  if (ctx.interfaceSet.has(interfaceName)) {
    // If it is, return
    return `  ${wrapKeyIfNeeded(key)}: ${interfaceName};\n`
  }

  let interfaceResult = '';

  // Add docs
  interfaceResult += `  /**\n`;
  interfaceResult += `   * ${s.doc}\n`;
  interfaceResult += `   */\n`;

  // Add interface
  interfaceResult += `export interface ${interfaceName} {\n`;
  // Add it to the set
  ctx.interfaceSet.add(interfaceName);
  if (!s.struct_fields || s.struct_fields?.length === 0) {
    let interfaceResult = '';
    // add doc
    interfaceResult += `  /**\n`;
    interfaceResult += `   * ${s.doc}\n`;
    interfaceResult += `   */\n`;
    // add type alias to any
    interfaceResult += `export type ${interfaceName} = any;\n`;
    ctx.interfaceMap.set(interfaceName, interfaceResult);
    return `  ${wrapKeyIfNeeded(key)}: ${interfaceName};\n`
  }
  // Add fields
  for (const field of s.struct_fields) {
    interfaceResult += await InterfaceGenerator(ctx, join(path, `/${key}/`), field.key, field.value);
  }
  interfaceResult += `}\n\n`;

  // set the interface to the map
  ctx.interfaceMap.set(interfaceName, interfaceResult);
  return `  ${wrapKeyIfNeeded(key)}: ${interfaceName};\n`
}

import {
  CaddyDocConfigStructureMap,
} from '../../../interfaces/index.ts';
import InterfaceGenerator, {GeneratorCtx} from './index.ts';
import {getPlainTypeStr} from '../tools/getPlainTypeStr.ts';
import {wrapKeyIfNeeded} from '../tools/wrapKeyIfNeeded.ts';

export default async function GeneratorMap (ctx: GeneratorCtx, path: string, key:string, s: CaddyDocConfigStructureMap) {
  /**
   * A map should be defined as a Record
   */
  const {map_keys, type_name, elems} = s;
  const recordValueTypeName = getPlainTypeStr(elems);
  // if elems is a struct, we need to generate an interface for it
  if (elems.type === 'struct') {
    await InterfaceGenerator(ctx, `${path}${key}/`, key, elems);
  }

  let result = '';
  // Insert doc as multiline comment
  result += `  /**\n`;
  result += `   * ${s.doc}\n`;
  result += `   */\n`;
  result += `  ${wrapKeyIfNeeded(key)}: Record<string, ${recordValueTypeName}>;\n`;
  return result;
}

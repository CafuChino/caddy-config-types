import {
  CaddyDocConfigStructureArray,
} from '../../../interfaces/index.ts';
import InterfaceGenerator, {GeneratorCtx} from './index.ts';
import {getPlainTypeStr} from '../tools/getPlainTypeStr.ts';
import {wrapKeyIfNeeded} from '../tools/wrapKeyIfNeeded.ts';

export default async function GeneratorArray (ctx: GeneratorCtx, path: string, key:string, s: CaddyDocConfigStructureArray) {
  let result = '';
  // Insert doc as multiline comment
  if (s.doc) {
    result += `  /**\n`;
    result += `   * ${s.doc}\n`;
    result += `   */\n`;
  }

  const { elems} = s;
  const typeName = getPlainTypeStr(elems);
  // if elems is a struct, we need to generate an interface for it
  if (elems.type === 'struct') {
    await InterfaceGenerator(ctx, `${path}${key}/`, key, elems);
  }
  result += `  ${wrapKeyIfNeeded(key)}: Array<${typeName}>;\n`
  return result;
}

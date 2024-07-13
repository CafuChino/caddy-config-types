import {CaddyDocConfigStructureBool} from '../../../interfaces/index.ts';
import {GeneratorCtx} from './index.ts';
import {wrapKeyIfNeeded} from '../tools/wrapKeyIfNeeded.ts';

export default async function GeneratorBoolean (ctx: GeneratorCtx, path: string, key:string, s: CaddyDocConfigStructureBool) {
  let result = '';
  // Insert doc as multiline comment
  result += `  /**\n`;
  result += `   * ${s.doc}\n`;
  result += `   */\n`;

  // Insert key and type

  result += `  ${wrapKeyIfNeeded(key)}: boolean;\n`;

  return result;
}

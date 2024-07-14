import {
  CaddyDocConfigStructure,
  CaddyDocConfigStructureType,
  DocsConfigCaddyApiResponse,
} from "../../../interfaces/index.ts";
import GeneratorBoolean from "./boolean.ts";
import GeneratorString from "./string.ts";
import GeneratorStruct from "./struct.ts";
import GeneratorModule from "./module.ts";
import GeneratorMap from "./map.ts";
import GeneratorInt from "./int.ts";
import GeneratorArray from "./array.ts";
import GeneratorModuleMap from "./moduleMap.ts";

/**
 * We can`t define interface inside interface definition, so we need to store them in a map.
 */
export interface GeneratorCtx {
  // store result
  result: string;
  // reduce circular references
  interfaceSet: Set<string>;
  // store interfaces
  interfaceMap: Map<string, string>;
  // namespaces
  namespaces: DocsConfigCaddyApiResponse["result"]["namespaces"];
}

export default function InterfaceGenerator(
  ctx: GeneratorCtx,
  path: string,
  key: string,
  s: CaddyDocConfigStructure,
) {
  switch (s.type) {
    case CaddyDocConfigStructureType.BOOL: {
      return GeneratorBoolean(ctx, path, key, s);
    }
    case CaddyDocConfigStructureType.STRING: {
      return GeneratorString(ctx, path, key, s);
    }
    case CaddyDocConfigStructureType.STRUCT: {
      return GeneratorStruct(ctx, path, key, s);
    }
    case CaddyDocConfigStructureType.MODULE: {
      return GeneratorModule(ctx, path, key, s);
    }
    case CaddyDocConfigStructureType.MODULE_MAP: {
      return GeneratorModuleMap(ctx, path, key, s);
    }
    case CaddyDocConfigStructureType.ARRAY:
      return GeneratorArray(ctx, path, key, s);
    case CaddyDocConfigStructureType.MAP:
      return GeneratorMap(ctx, path, key, s);
    case CaddyDocConfigStructureType.INT:
      return GeneratorInt(ctx, path, key, s);
    case CaddyDocConfigStructureType.UINT:
      return GeneratorInt(ctx, path, key, s);
    case CaddyDocConfigStructureType.FLOAT:
      return GeneratorInt(ctx, path, key, s);
    default:
      throw new Error(`Unknown type: ${JSON.stringify(s)}`);
  }
}

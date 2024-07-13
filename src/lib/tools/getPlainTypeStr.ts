import { CaddyDocConfigStructure } from "../../../interfaces/index.ts";
import { getInterfaceName } from "./getInterfaceName.ts";

export function getPlainTypeStr(type: CaddyDocConfigStructure): string {
  const { type: t } = type;
  switch (t) {
    case "int":
      const { type_name } = type;
      return type_name ? getInterfaceName(type_name) : "number";
    case "uint":
      return "number";
    case "float":
      return "number";
    case "string":
      return "string";
    case "bool":
      return "boolean";
    case "map":
      return "Record<string, unknown>";
    case "array":
      return `Array<${getPlainTypeStr(type.elems)}>`;
    case "struct":
      return getInterfaceName(type.type_name);
    default:
      return "unknown";
  }
}

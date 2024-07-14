export interface BasicCaddyApiResponse {
  status_code: number;
  result: unknown;
}

export enum CaddyDocConfigStructureType {
  STRUCT = "struct",
  BOOL = "bool",
  STRING = "string",
  ARRAY = "array",
  MODULE = "module",
  MAP = "map",
  MODULE_MAP = "module_map",
  INT = "int",
  UINT = "uint",
  FLOAT = "float",
}

export interface CaddyDocConfigStructureBase {
  type: CaddyDocConfigStructureType;
  doc: string;
}

export type CaddyDocConfigStructure =
  | CaddyDocConfigStructureStruct
  | CaddyDocConfigStructureInt
  | CaddyDocConfigStructureUint
  | CaddyDocConfigStructureFloat
  | CaddyDocConfigStructureBool
  | CaddyDocConfigStructureString
  | CaddyDocConfigStructureArray
  | CaddyDocConfigStructureModule
  | CaddyDocConfigStructureMap
  | CaddyDocConfigStructureModuleMap;

export interface CaddyDocConfigStructureBool
  extends CaddyDocConfigStructureBase {
  type: CaddyDocConfigStructureType.BOOL;
}

export interface CaddyDocConfigStructureInt
  extends CaddyDocConfigStructureBase {
  type: CaddyDocConfigStructureType.INT;
  type_name?: string;
}
export interface CaddyDocConfigStructureUint
  extends CaddyDocConfigStructureBase {
  type: CaddyDocConfigStructureType.UINT;
  type_name?: string;
}

export interface CaddyDocConfigStructureFloat
  extends CaddyDocConfigStructureBase {
  type: CaddyDocConfigStructureType.FLOAT;
  type_name?: string;
}

export interface CaddyDocConfigStructureStruct
  extends CaddyDocConfigStructureBase {
  type: CaddyDocConfigStructureType.STRUCT;
  type_name: string;
  struct_fields: CaddyDocConfigStructureFiled[];
  module_inline_key?: string;
}

export interface CaddyDocConfigStructureString
  extends CaddyDocConfigStructureBase {
  type: CaddyDocConfigStructureType.STRING;
}

export interface CaddyDocConfigStructureArray
  extends CaddyDocConfigStructureBase {
  type: CaddyDocConfigStructureType.ARRAY;
  elems: CaddyDocConfigStructure;
}

export interface CaddyDocConfigStructureModule
  extends CaddyDocConfigStructureBase {
  type: CaddyDocConfigStructureType.MODULE;
  module_namespace: string;
  module_inline_key: string;
}

export interface CaddyDocConfigStructureMap
  extends CaddyDocConfigStructureBase {
  type: CaddyDocConfigStructureType.MAP;
  type_name?: string;
  map_keys: {
    type: CaddyDocConfigStructureType.STRING;
  };
  elems: CaddyDocConfigStructure;
}

export interface CaddyDocConfigStructureModuleMap
  extends CaddyDocConfigStructureBase {
  type: CaddyDocConfigStructureType.MODULE_MAP;
  type_name: string;
  module_namespace: string;
}

interface CaddyDocConfigStructureFiled {
  key: string;
  doc: string;
  value: CaddyDocConfigStructure;
}

export interface DocsConfigCaddyApiResponse extends BasicCaddyApiResponse {
  result: {
    repo: string;
    structure: CaddyDocConfigStructureStruct;
    namespaces: Record<
      string,
      {
        name: string;
        docs: string;
        package: string;
        repo: string;
        data?: DocsConfigCaddyApiResponse;
      }[]
    >;
  };
}

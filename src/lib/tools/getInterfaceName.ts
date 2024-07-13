import * as changeCase from 'npm:change-case';

/**
 * Get interface name from type name like	"github.com/caddyserver/caddy/v2.Config"
 * @param typeName Type name like	"github.com/caddyserver/caddy/v2.Config"
 * @returns Interface name like "IConfig": "I" stands for "Interface" and "Config" is the type name excluding the package name
 */
export function getInterfaceName (typeName: string) {
  return `I${changeCase.pascalCase(typeName?.split('.').pop() || typeName)}`;
}

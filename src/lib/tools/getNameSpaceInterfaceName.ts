import * as changeCase from 'npm:change-case';

/**
 * Get the interface name for a namespace like "caddy.config_loaders"
 * @param namespace Namespace like "caddy.config_loaders"
 * @returns Interface name like "ICaddyConfigLoaders": "I" stands for "Interface" and "CaddyConfigLoaders" is the namespace transformed to PascalCase
 */
export function getNameSpaceInterfaceName (namespace: string) {
  return `I${changeCase.pascalCase(namespace?.split('.').pop() || namespace)}`;
}

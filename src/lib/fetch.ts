import got from "npm:got";
import { join } from "jsr:@std/path";
import { CADDY_DOC_ROOT } from "./config.ts";
import { DocsConfigCaddyApiResponse } from "../../interfaces/index.ts";
import logger from "./logger.ts";

export function getDoc(path?: string): Promise<DocsConfigCaddyApiResponse> {
  let _path = join(CADDY_DOC_ROOT, path || "");
  // if path contains adjacent duplicate path like '/http/http' then keep only one
  const splitPath = _path.split("/");
  let lastPart = "";
  splitPath.forEach((part, index) => {
    if (part === lastPart && lastPart !== "storage") {
      splitPath[index] = "";
    }
    lastPart = part;
  });
  const newPath = splitPath.filter((part) => part !== "").join("/") + "/";
  if (newPath !== _path) {
    logger.warn(`[getDoc]: duplicate path found: ${_path} -> ${newPath}`);
  }
  _path = newPath;
  logger.info(`[getDoc]: fetching: ${_path}`);
  return got.get(_path).json<
    DocsConfigCaddyApiResponse
  >() as unknown as Promise<DocsConfigCaddyApiResponse>;
}

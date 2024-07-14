import got from "npm:got";
import { join } from "jsr:@std/path";
import { CADDY_DOC_ROOT } from "./config.ts";
import { DocsConfigCaddyApiResponse } from "../../interfaces/index.ts";

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
    console.log(`[getDoc]: duplicate path found: ${_path} -> ${newPath}`);
  }
  _path = newPath;
  console.log(`[getDoc]: fetching: ${_path}`);
  // return got.get(CADDY_DOC_ROOT + _path).json<DocsConfigCaddyApiResponse>().then(async res => {
  //   if (res.result.namespaces) {
  //     for (let namespaceKey in res.result.namespaces) {
  //       const namespace = res.result.namespaces[namespaceKey];
  //       for (let item of namespace) {
  //         item.data = await getDoc(_path + `${item.name}/`)
  //       }
  //     }
  //   }
  //   return res;
  // })
  return got.get(_path).json<
    DocsConfigCaddyApiResponse
  >() as unknown as Promise<DocsConfigCaddyApiResponse>;
}

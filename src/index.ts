import {getDoc} from './lib/fetch.ts';
import InterfaceGenerator, {GeneratorCtx} from './lib/generators/index.ts';


getDoc().then(async res => {
  const { result } = res;
  const ctx: GeneratorCtx = {
    result: '',
    interfaceSet: new Set<string>(),
    interfaceMap: new Map<string, string>(),
    namespaces: result.namespaces,
  }
  await InterfaceGenerator(ctx, '', '', result.structure);
  let generatedInterfaces = Array.from(ctx.interfaceMap.values()).join('\n\n');
  // prettify the generated interfaces
  //generatedInterfaces = await prettier.format(generatedInterfaces, { parser: 'typescript' });
  // create the types folder if it doesn't exist
  await Deno.mkdir('types/', { recursive: true }); 
  // write the generated interfaces to a index.d.ts file
  await Deno.writeTextFile('types/index.d.ts', generatedInterfaces);
});

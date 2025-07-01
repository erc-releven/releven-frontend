import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { assert, log } from "@acdh-oeaw/lib";
import openapi, { astToString } from "openapi-typescript";

import { env } from "@/config/env.config";

async function generate() {
	const url = env.RDFPROXY_ENDPOINT;
	assert(url, "RDFPROXY_ENDPOINT environment variable not provided.");

	const ast = await openapi(join(url, "openapi.json"), {
		arrayLength: true,
	});
	const content = astToString(ast);
	const folderPath = join(process.cwd(), "lib", "api-client");
	await mkdir(folderPath, { recursive: true });
	await writeFile(join(folderPath, "api.ts"), content, { encoding: "utf-8" });

	return { isOverriden: true, api: url };
}

generate()
	.then(({ isOverriden, api }) => {
		if (isOverriden) {
			log.success("Successfully generated api client from ", api);
		} else {
			log.info(
				"Used default api client from the demo data, because no other database is provided.",
			);
		}
	})
	.catch((error: unknown) => {
		log.error("Failed to generate api client.\n", String(error));
		process.exitCode = 1;
	});

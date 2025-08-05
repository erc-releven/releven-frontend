import type { paths } from "@/lib/api-client/api";
import { client } from "@/lib/data";

interface DataCountProps {
	path: keyof paths;
}

export async function DataCount(props: Readonly<DataCountProps>) {
	const { path } = props;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
	const data = (await client.GET(path, { cache: "force-cache" })).data as any;
	// eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
	return data ? `${data!.total} records` : null;
}

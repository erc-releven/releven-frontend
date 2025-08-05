import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { LoadingIndicator } from "@/components/ui/loading-indicator";

export function LoadingDiv(): ReactNode {
	const t = useTranslations("Loading");

	return (
		<div className="grid place-content-center place-items-center py-16 xs:py-24">
			<LoadingIndicator aria-label={t("loading")} />
		</div>
	);
}

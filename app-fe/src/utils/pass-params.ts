export const passParams = <T extends object>(
	url: string,
	params?: Partial<T>
): string => {
	if (!params) return url;

	const paramsArray = Object.entries(params)
		.filter(([, value]) => value !== undefined)
		.map(
			([key, value]) =>
				`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
		);

	const paramsString = paramsArray.join("&");
	const separator = url.includes("?") ? "&" : "?";

	return paramsString ? `${url}${separator}${paramsString}` : url;
};

// ***DO NOT REMOVE THIS ENTRY - START ***
export * as engines from '.';
// ***DO NOT REMOVE THIS ENTRY - END ***

// Lazy wrappers to avoid eager importing engine modules (prevents unused deps like 'fs-extra' from throwing)
export const patternIq = (
	...args: any[]
) => {
	// Defer require until actually invoked
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const mod = require('./patternIq/patternIqEngine');
	return mod.patternIq?.(...args);
};

export const smartAi = (
	...args: any[]
) => {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const mod = require('./smartAi/smartAiEngine');
	return mod.smartAi?.(...args);
};


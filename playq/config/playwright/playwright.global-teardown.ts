// Keep teardown minimal to avoid heavy imports; Playwright closes browsers itself.
export default async () => {
  console.log('🧹 Playwright global teardown');
};

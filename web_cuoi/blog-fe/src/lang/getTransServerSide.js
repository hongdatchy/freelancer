// import 'server-only';

// const dictionaries = {
//   en: () => import('./en.json').then((module) => module.default),
//   nl: () => import('./vi.json').then((module) => module.default),
// };

// export const getTransServerSide = async (locale) => {
//   if (!dictionaries[locale]) {
//     throw new Error(`Locale '${locale}' is not supported.`);
//   }
//   return dictionaries[locale]();
// };

// export default getTransServerSide;

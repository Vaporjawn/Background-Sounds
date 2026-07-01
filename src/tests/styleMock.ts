// Jest (via ts-jest/Babel) can't parse raw CSS. Component-level CSS imports
// (e.g. `import './App.css'`) are side-effect-only in this project (plain
// stylesheets, not CSS Modules), so mapping them to an empty module is a
// safe, standard stub - see the moduleNameMapper entry in jest.config.cjs.
export default {};

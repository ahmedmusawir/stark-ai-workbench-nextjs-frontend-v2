// QA-owned TS loader for the QA harness (same transpile-only approach; independent copy).
const ts = require('typescript');
module.exports = function (source) { return ts.transpileModule(source, { fileName: this.resourcePath, compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020, esModuleInterop: true } }).outputText; };

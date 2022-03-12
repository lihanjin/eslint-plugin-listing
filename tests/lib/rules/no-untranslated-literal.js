/**
 * @fileoverview 不允许使用中文硬编码
 * @author hanjinli
 */
"use strict";

const rule = require("../../../lib/rules/no-untranslated-literal");
const RuleTester = require("eslint").RuleTester;
//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
const tests = {
  valid: [
    {
      code: `
         import 标识符0 from 'xyz';
         标识符1 = { 标识符2: 0 };
         var 标识符3 = function 标识符4() {};
         this.标识符5 = 0;
         a[标识符6] = 0;
         export default 标识符7;
       `,
      parserOptions: {
        ecmaVersion: 6,
        sourceType: "module",
      },
    },
  ],
  invalid: [
    {
      code: "var tpl = <Hello title='你好'>组件</Hello>",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      errors: [
        {
          message: "Using Chinese characters: '你好'",
          type: "Literal",
        },
        {
          message: "Using Chinese characters: 组件",
          type: "JSXText",
        },
      ],
    },
    {
      code: "var str = `樣板字串`; console.log(`${str}、模板字符串`);",
      env: { es6: true },
      errors: [
        {
          message: "Using Chinese characters: 樣板字串",
          type: "TemplateElement",
        },
        {
          message: "Using Chinese characters: 、模板字符串",
          type: "TemplateElement",
        },
      ],
    },
  ],
};

const config = {
  options: [
    {
      functionNames: "GtIntl",
      localesPath: "tests/lib/locales/zh.json",
    },
  ],
};

tests.valid.forEach((t) => Object.assign(t, config));
tests.invalid.forEach((t) => Object.assign(t, config));
ruleTester.run("no-untranslated-literal", rule, tests);

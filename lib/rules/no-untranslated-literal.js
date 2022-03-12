/**
 * @fileoverview 不允许使用已经翻译过中文硬编码，需要用多语言方法转换
 * @author hanjinli
 */
"use strict";

const requireNoCache = (path) => {
  delete require.cache[path];
  return require(path);
};

const getLocales = (localesPath) => {
  const localesFullPath = `${process.cwd()}/${localesPath}`;
  try {
    const locales = requireNoCache(localesFullPath);
    return { locales }; //eslint-disable-line
  } catch (e) {
    return {
      errors: {
        message: `\n Error parsing or retrieving key structure comparison file from\n "${localesFullPath}".\n Check the "filePath" option for this rule.\n ${e}`,
        loc: {
          start: {
            line: 0,
            col: 0,
          },
        },
      },
    };
  }
};

/**
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: "suggestion", // `problem`, `suggestion`, or `layout`
    docs: {
      description: "no-untranslated-literal",
      recommended: true,
      url: null, // URL to the documentation page for this rule
    },
    fixable: "code",
    hasSuggestions: true,
    schema: [
      {
        type: "object",
        properties: {
          localesPath: {
            type: "string",
          },
          functionNames: {
            type: "string",
          },
        },
      },
    ], // Add a schema if the rule has options
  },

  create(context) {
    const { options } = context;
    const { functionNames, localesPath } = options[0];

    const { errors, locales } = getLocales(localesPath);

    if (errors) {
      context.report(errors);
      return;
    }

    const regex = /[\u4E00-\u9FFF]/;

    const report = function (node, val) {
      if (!locales) return;
      Object.keys(locales).forEach((key) => {
        if (locales[key] === val.trim()) {
          context.report({
            node: node,
            message: `代码中的"${val}"已有翻译文案，使用多语言${functionNames}("${key}")方法替换`,
            data: {
              character: val,
            },
            suggest: [
              {
                desc: `立即修复：{${functionNames}("${key}")}`,
                fix(fixer) {
                  return fixer.replaceTextRange(
                    node.range,
                    `{${functionNames}("${key}")}`
                  );
                },
              },
              {
                desc: `立即修复：${functionNames}("${key}")`,
                fix(fixer) {
                  return fixer.replaceTextRange(
                    node.range,
                    `${functionNames}("${key}")`
                  );
                },
              },
            ],
          });
        }
      });
    };

    return {
      "JSXElement,Literal, JSXText": function (node) {
        if (typeof node.value === "string" && regex.exec(node.raw)) {
          report(node, node.value);
        }
      },
      TemplateElement: function (node) {
        const v = node.value;
        if (v && v.raw && regex.exec(v.raw)) {
          report(node, v.raw);
        }
      },
    };
  },
};

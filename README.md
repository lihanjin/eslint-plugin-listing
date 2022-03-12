# eslint-plugin-listing

ginee-listing eslint rule

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-listing`:

```sh
npm install eslint-plugin-listing --save-dev
```

## Usage

Add `ginee-listing` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "ginee-listing"
    ]
}
```


Then configure the rules you want to use under the rules section.

检测多语言文案中文硬编码已有翻译文案，未进行i18n方法转换处理

```json
{
    "rules": {
        "ginee-listing/no-untranslated-literal": [
            2,
            {
                localesPath: "src/locales/zh-CN/index.json", // 中文多语言文案路径
                functionNames: "GtIntl", // 多语言转换方法名称
            },
        ]
    }
}
```

## Supported Rules

* Fill in provided rules here



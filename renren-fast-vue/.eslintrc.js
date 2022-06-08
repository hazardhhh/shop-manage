// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': '',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? '2' : '0',
    //关闭行末分号提示/报错
    'semi': 0,
    //关闭定义变量未使用提示/报错
    'no-unused-vars':0
  }
}

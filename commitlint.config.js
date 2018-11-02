/* eslint-disable */
const Configuration = {
    extends: ['@commitlint/config-conventional'],
  
    rules: {
      'body-leading-blank': [2, 'always'],
      'footer-leading-blank': [2, 'always'],
      'header-max-length': [2, 'always', 72],
      'scope-case': [2, 'always', 'lower-case'],
      'subject-case': [2, 'always', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
      'subject-empty': [2, 'never'],
      'subject-full-stop': [2, 'never', '.'],
      'subject-max-length': [2, 'always', 70],
      'type-case': [2, 'always', 'lower-case'],
      'type-empty': [2, 'never'],
      'type-enum': [2, 'always', [
        'feat', // 新 feature
        'fix', // 修复 bug
        'docs', // 修改 Documentation
        'style', // 格式，无关代码含义
        'refactor', // 重构，即非修复 bug，也非增加 feature
        'perf', // 性能改进
        'test', // 增加或修改测试用例
        'chore' // 修改 build 过程或辅助脚本
        ],
      ],
    },
  };
  
  module.exports = Configuration;
  
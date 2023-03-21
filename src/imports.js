module.exports = {
  'no-imports': {
    create(context) {
      return {
        ImportDeclaration(node) {
          context.report({
            node,
            message: 'Do not use `import` in this file. Use `require()` instead.',
          })
        },
      }
    },
  },
  'no-namespaced-imports': {
    create(context) {
      return {
        ImportNamespaceSpecifier(node) {
          context.report({
            node: node.parent,
            message:
              'Do not use namespaced imports in this file. Import only items actually required.',
          })
        },
      }
    },
  },
}

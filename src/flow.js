module.exports = {
  'flow-no-shorthand-exact-object': {
    create(context) {
      return {
        ObjectTypeAnnotation(node) {
          if (node.exact) {
            context.report({
              node,
              message: `Please use $Exact<{ foo: Bar }> instead of {| foo: Bar |}`,
              fix: (fixer) => {
                return [
                  fixer.replaceTextRange([node.start, node.start + 2], '$Exact<{'),
                  fixer.replaceTextRange([node.end - 2, node.end], '}>'),
                ]
              },
            })
          }
        },
      }
    },
  },
  'flow-no-ambiguous-object-exactness': {
    create(context) {
      const flags = context.options[0] || {}
      const { exactByDefault } = flags
      const message = (() => {
        if (exactByDefault) {
          return `Object's exactness is ambiguous, use {| a: T |} or { a: T, ... } instead`
        } else if (exactByDefault === false) {
          return `Object's exactness is ambiguous, use { a: T, ... } instead`
        }
        return `Object's exactness is ambiguous, use $Exact<{ a: T }> or {| a: T |} or { a: T, ... } instead`
      })()
      return {
        ObjectTypeAnnotation(node) {
          if (
            node.parent.type === 'InterfaceDeclaration' ||
            node.parent.type === 'InterfaceTypeAnnotation'
          ) {
            return
          }

          const isDollarExact =
            node.parent.type === 'TypeParameterInstantiation' &&
            node.parent.parent.type === 'GenericTypeAnnotation' &&
            node.parent.parent.id.name === '$Exact'

          if (node.exact || node.inexact || isDollarExact || node.indexers.length) {
            return
          }
          context.report({
            node,
            message,
            fix: (fixer) => {
              if (exactByDefault) {
                return [
                  fixer.replaceTextRange([node.start, node.start + 1], '{|'),
                  fixer.replaceTextRange([node.end - 1, node.end], '|}'),
                ]
              } else if (exactByDefault === false) {
                return !node.properties.length
                  ? fixer.replaceTextRange([node.end - 1, node.end], ' ... }')
                  : fixer.replaceTextRange([node.end - 1, node.end], ', ... }')
              }
              return null
            },
          })
        },
      }
    },
  },
}

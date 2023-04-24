module.exports = {
  'no-catch-without-param': {
    meta: {
      fixable: 'code',
    },
    create(context) {
      return {
        CatchClause(node) {
          if (!node.param) {
            context.report({
              node,
              message: 'Add parameter to catch clause, e.g. `(_error)`',
              fix: (fixer) => fixer.insertTextBefore(node.body, '(_error) '),
            })
          }
        },
      }
    },
  },
  'no-arg-spread': {
    create(context) {
      return {
        CallExpression(node) {
          node.arguments
            .filter((arg) => arg.type === 'SpreadElement')
            .forEach((spread) => {
              context.report({
                node: spread,
                message:
                  'Spreading arguments is not allowed here. Pass an array as a single argument instead.',
              })
            })
        },
      }
    },
  },
  'no-in-expression': {
    create(context) {
      return {
        BinaryExpression(node) {
          if (node.operator !== 'in') {
            return
          }
          context.report({
            node,
            message: `'in' operator is usually unsafe on user-provided data, add a \`Object.prototype.hasOwnProperty.call(obj, prop)\` check and/or silence this rule if you're sure it's safe`,
          })
        },
      }
    },
  },
  'max-lines': {
    create(context) {
      const flags = context.options[0] || {}
      const { max: maxLines = 500 } = flags
      return {
        Program(node) {
          const loc = context.getSourceLines().length
          if (loc > maxLines) {
            context.report({
              node: node.body[0],
              message: `This file is long (${loc} lines). Try to keep files below ${maxLines} lines`,
            })
          }
        },
      }
    },
  },
  'no-invariant-without-message': {
    create(context) {
      return {
        CallExpression(node) {
          if (node.callee.name !== 'invariant') {
            return
          }

          if (node.arguments.length === 1) {
            context.report({
              node,
              message: 'invariant() must have an error message',
            })
          }
        },
      }
    },
  },
  'no-overdue-todos': {
    create(context) {
      return {
        Program(_node) {
          context
            .getSourceCode()
            .getAllComments()
            .forEach((comment) => {
              const match = comment.value.match(/(TODO|FIXME)\(([^)]+)\):/)
              if (!match) {
                return
              }
              const [, , dateText] = match
              const dateMatch = dateText.match(/(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?/)
              if (!dateMatch) {
                return
              }
              const [, yearStr, monthStr, dayStr] = dateMatch
              const [year, month, day] = [yearStr, monthStr, dayStr].map(
                (str) => parseInt(str, 10) || 1,
              )
              const dayOverdue = new Date(year, month - 1, day)

              if (dayOverdue < new Date()) {
                context.report({
                  node: null,
                  loc: comment.loc,
                  message: `Overdue ${comment.value.trim()}`,
                })
              }
            })
        },
      }
    },
  },
}

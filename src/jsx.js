module.exports = {
  "no-jsx-andand": {
    create(context) {
      return {
        JSXExpressionContainer(node) {
          if (
            node.expression &&
            node.expression.type === "LogicalExpression" &&
            node.expression.operator === "&&" &&
            // don't correct `foo={x&&y}`
            node.parent &&
            node.parent.type === "JSXElement"
          ) {
            context.report({
              node,
              message: "Do not use `condition && <Component>` in JSX",
              fix(fixer) {
                return [
                  fixer.replaceTextRange(
                    [node.expression.left.end, node.expression.right.start],
                    " ? "
                  ),
                  fixer.replaceTextRange(
                    [node.expression.right.end, node.end - 1],
                    " : null"
                  ),
                ];
              },
            });
          }
        },
      };
    },
  },
};

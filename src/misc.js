module.exports = {
  "no-catch-without-param": {
    create(context) {
      return {
        CatchClause(node) {
          if (!node.param) {
            context.report({
              node,
              message: "Add parameter to catch clause, e.g. `(_error)`",
              fix: (fixer) => fixer.insertTextBefore(node.body, "(_error) "),
            });
          }
        },
      };
    },
  },
  "no-arg-spread": {
    create(context) {
      return {
        CallExpression(node) {
          node.arguments
            .filter((arg) => arg.type === "SpreadElement")
            .forEach((spread) => {
              context.report({
                node: spread,
                message:
                  "Spreading arguments is not allowed here. Pass an array as a single argument instead.",
              });
            });
        },
      };
    },
  },
};

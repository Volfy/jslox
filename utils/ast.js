const Ast = {}

Ast.Literal = (value) => {
  return value
}

Ast.Grouping = (expression) => {
  return expression
}

Ast.Unary = (operator, right) => {
  return {
    [operator]: [null, right]
  }
}

Ast.Binary = (left, operator, right) => {
  return {
    [operator]: [left, right]
  }
}

module.exports = Ast
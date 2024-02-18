const Ast = {}

let x = 0;

Ast.Literal = (value) => {
  return value
}

Ast.Grouping = (expression) => {
  return expression
}

Ast.Unary = (operator, right) => {
  x++
  return [operator, right]
}

Ast.Binary = (left, operator, right) => {
  x++
  return [operator, left, right]
}

Ast.Ternary = (operator, test, then, else_st) => {
  x++
  return [operator, test, then, else_st]
}

Ast.refreshX = () => x = 0;

module.exports = Ast
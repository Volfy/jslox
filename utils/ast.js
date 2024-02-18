const Ast = {}

let x = 0;

// maybe this should return the token in full
Ast.Literal = (value) => {
  return value
}

Ast.Grouping = (expression) => {
  return expression
}

Ast.Unary = (operator, right) => {
  x++
  return [operator, null, right]
}

Ast.Binary = (left, operator, right) => {
  x++
  return [operator, left, right]
}

Ast.Ternary = (test, then, else_st) => {
  x++
  return [test, then, else_st]
}

Ast.refreshX = () => x = 0;

module.exports = Ast
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
  return {
    [x]: [operator, null, right]
  }
}

Ast.Binary = (left, operator, right) => {
  x++
  return {
    [x]: [operator, left, right]
  }
}

Ast.refreshX = () => x = 0;

module.exports = Ast
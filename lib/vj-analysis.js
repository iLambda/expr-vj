// require all modules
var _ = require('lodash')
var expr = require('expr-tree')
var t = require('t')


// exports
module.exports = {
  // variablify expression
  variablify: function(expression) {
    // get expression tree
    if (_.isString(expression)) {
      // convert rpn to tree
      expression = expr.fromRPN(expression)
    } else if (!expr.isExpressionTree(expression)) {
      // error : nor tree or rpn
      throw "Parameter 'expression' is nor a tree or a RPN."
    }

    // dimension
    var dim = 0;
    // go thru tree
    t.bfs(expression, function (node, parent) {
      // check type
      if (node.type === 'var') {
        // rename var
        node.label = 'x' + dim++
      } else if (node.type === 'number') {
        // add parameter
        node.type = 'var'
        node.label = 'x' + dim++
      }
    })
    // return tree variablified, along with other data
    return {
      output: expression,
      dim: dim
      varlabel: 'x'
    }
  },

  // return list of names of individual coordinates in the parameter space of expression
  parameters: function(expression) {
    // get expression tree
    if (_.isString(expression)) {
      // convert rpn to tree
      expression = expr.fromRPN(expression)
    } else if (!expr.isExpressionTree(expression)) {
      // error : nor tree or rpn
      throw "Parameter 'expression' is nor a tree or a RPN."
    }
    // dimension
    var params = []
    // go thru tree
    t.bfs(expression, function (node, parent) {
      // if new var, add to list
      if (node.type == 'var' && !_.contains(params, node.label)) {
        params.push(node.label)
      }
    })
    // return params
    return params
  },

  // return dimension of parameter space
  dimension: function(expression) {
    return this.parameters(expression).length || 0
  }

}

// require all modules
var _ = require('lodash')
var expr = require('expr-tree')
var helpers = require('./vj_infix.js')
var analysis = require('./vj_analysis.js')

/*
* VJSession class
*/
function VJSession(expression, settings) {
  // check type
  if (_.isString(expression)) {
    // check if notation is infix or prefix
    var infix = expression
  	var infixrpn = shuntingYard(tokenize(expression))
  	expression = infixrpn || expression
    // does it checks out ?
    if (expr.isExpressionTree(expression)) {
      // import tree
      this.expression = expr.fromRPN(expression)
    } else {
      // error
      throw "Invalid string 'expression'"
    }
  } else if (expr.isExpressionTree(expression)) {
    // set the tree
    this.expression = expression
  } else {
    // error
    throw "Invalid parameter 'expression'"
  }
  // get eval function
  this.eval = expr.toFunction(rpn, ['t', 'x', 'y'])

  // set palette
  this.palette = ["#000", "#FFF"]
  // check settings
  this.settings = settings || {
    width: 320,
    height: 240
  }
}

VJSession.unpack = function() {

}

// exports
module.exports = VJSession

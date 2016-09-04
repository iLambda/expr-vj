// require all modules
var _ = require('lodash')
var expr = require('expr-tree')
var analysis = require('./vj-analysis.js')
var infx = require('./vj-infix.js')

// adding expr operators
expr.operators['/'] = { n:2, js:'(function(x,y) { return x / y })({0}, {1})' }
expr.operators['^'] = { n:2, js:'(function(x,y) { return Math.pow(x, y) })({0}, {1})' }

// mod operator
function mod(x, y) {
  return x - y * Math.floor(x / y)
}


/*
* VJSession class
*/
function VJSession(expression, settings) {
  // check type
  if (_.isString(expression)) {
    // check if notation is infix or prefix
    var infix = expression
  	var infixrpn = infx.shuntingYard(infx.tokenize(expression))
    var rpn = infixrpn || expression
  	expression = expr.fromRPN(rpn)
    // does it checks out ?
    if (expr.isExpressionTree(expression)) {
      // import tree
      this.expression = expression
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
  // variablify tree
  var result = analysis.variablify(this.expression)
  this.dimension = result.dim
  this.parameters = _.map(_.range(this.dimension), function (i) { return result.varlabel + i })
  this.state = _.map(result.initialstate, function (value) { return _.isNumber(value) ? value : 0 })
  // get eval function
  this.eval = _.curry(expr.toFunction(this.expression, ['x', 'y'].concat(this.parameters)))
  // set palette
  this.palette = ["#000", "#FFF"]
  this.background = "#000"
  // check settings
  this.settings = settings || {
    width: 320,
    height: 240
  }
}

VJSession.prototype.draw = function(ctx) {
  var x = 0, y = 0
  for(x = -this.settings.width/2; x < this.settings.width/2; x++) {
    for(y = -this.settings.height/2; y < this.settings.height/2; y++) {
      var id = mod(Math.abs(Math.floor( this.state.length > 0 ? this.eval(x, y).apply(this, this.state) : this.eval(x, y) )), this.palette.length)
      ctx.fillStyle = (!isNaN(id) && isFinite(id)) ? this.palette[id] : this.background
      ctx.fillRect(x+(this.settings.width/2), y+(this.settings.height/2), 1, 1)
    }
  }
}

// exports
module.exports = VJSession

function AI(grid) {
  this.grid = grid;
}

AI.prototype.evaluation = function() {
  var emptyCells = this.grid.availableCells().length;
  var max = this.grid.findMax();
  var edgeScore = 0;
  if(this.grid.largestTileInEdge()) {
    edgeScore = 100000;
  }
  return this.grid.clustering() * 5 + this.grid.monotonicity() + Math.log(emptyCells) * 3 + (Math.log(max) / Math.log(2));
};

//minimax search with alpha-beta pruning:
AI.prototype.minimax = function(alpha, beta, depth, player) {
  var bestEval;
  var bestMove = -1;
  var directions = [1, 2, 3, 0];
  var result;
  /*if(this.grid.isGameTerminated()) {
    if(this.gird.hasWon()) {
      //bestEval = Infinity;
      return {eval: Infinity, move: bestMove};
    }
  }*/
  /*else if(depth == 0) {
    //bestEval = this.evaluation();
    return {eval: this.evaluation(), move: bestMove};
  }*/
  //else {
    //player's turn:
    if(player == this.grid.playerTurn) {
      bestEval = -Infinity;
      for(var direction in [1, 2, 3]) {
        var newGrid = this.grid.clone();
        if(newGrid.move(direction).moved) {
          if(newGrid.isGamePaused()) {
            return {eval: Infinity, move: 3};
          }
          //if(newGrid.isGameTerminated()) {
            if(newGrid.hasWon()) {
              return {eval: Infinity, move: direction};
            }
          //}
          var newAI = new AI(newGrid);
          if(depth == 0) {
            return {eval: newAI.evaluation(), move: direction};
          }
          else {
            result = newAI.minimax(alpha, beta, depth-1, false);
          }
          if(result.eval > alpha) {
            alpha = result.eval;
            bestMove = direction;
          }
          // * β cut-off *
          if(beta <= alpha) {
            //break;
            return {eval: beta, move: bestMove};
          }
        }
      }
      if(newGrid.isGamePaused()) {
        return {eval: Infinity, move: 3};
      }
      bestEval = alpha;
    }
    //computer's turn:
    else {
      bestEval = beta;
      var possibleScores = [];
      var cells = this.grid.availableCells();
      //put 2 and 4 in each empty cell:
        for(var val in [2, 4]) {
          for(var x in cells) {
            possibleScores.push({position: cells[x], value: val});
          }
        }
        //for each case, minimize the eval:
        for(var j = 0; j < possibleScores.length; j++) {
          var newGrid2 = this.gird.clone();
          var tile = new Tile(possibleScores[j].position, possibleScores[j].value);
          newGrid2.insertTile(tile);
          var AI2 = new AI(newGrid2);
          result = AI2.minimax(alpha, beta, depth-1, true);
          newGrid2.removeTile(tile);
          if(result.eval < beta) {
            beta = result.eval;
          }
        // * α cut-off *
        if(beta <= alpha) {
          //break;
          return {eval: alpha, move: -1};
        }
      }
      bestEval = beta;
      if(cells.length == 0) {
        bestEval = 0;
      }
    }
  //}
  return {eval: bestEval, move: bestMove};
};


AI.prototype.nextMove = function() {
  return this.minimax(-Infinity, Infinity, 5, true);
};

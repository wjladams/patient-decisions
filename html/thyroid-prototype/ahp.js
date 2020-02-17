
/*****************************************/
/**  The basic mathematical functions   **/
/*****************************************/

function isNumber(n) { return !isNaN(parseFloat(n)) && !isNaN(n - 0) }

function vInit(size, def_val=0) {
  let rval = []
  for(let i=0; i < size; i++)
      rval.push(def_val)
  return rval
}

/*Creates an identity matrix*/
function mId(size) {
  let rval = mInit(size, size)
  for(let p=0; p < size; p++) {
      rval[p][p]=1.0
  }
  return rval
}
/*Checks if all entries of a vector are 0*/
function allZero(vec) {
for(let i=0; i < vec.length; i++) {
  if (vec[i] != 0) {
    return false;
  }
}
return true;
}
function mInit(rows, cols, init_val=0) {
  let rval = []
  for(let row=0; row < rows; row++) {
      rval[row] = Array(cols)
      for(let col=0; col < cols; col++) {
          rval[row][col]=init_val
      }
  }
  return rval;
}

function mPairwise(mat, row, col, val) {
  if (row == col) {
      //We cannot pairwise row == col
      throw "Row cannot equal column for pairwise exception"
  }
  if (val == 0) {
      mat[row][col]=0
      mat[col][row]=0
  } else {
      mat[row][col]=val
      mat[col][row]=1.0/val
  }
}

function mMultVec(mat, vec) {
  let nrows = mat.length
  let ncols = mat[0].length
  let rval = vInit(nrows)
  if (vec.length != ncols) {
      throw "Array dimension mismatch"
  }
  for(let row=0; row < nrows; row++) {
      rval[row] = 0
      for(let col=0; col < ncols; col++) {
          rval[row]+=mat[row][col] * vec[col]
      }
  }
  return rval
}

function vSum(v) {
  let rval = 0
  for(let i=0; i < v.length; i++) {
      rval += v[i]
  }
  return rval
}

function vDist(v1, v2) {
  let rval = 0
  let diff = 0
  let size = Math.min(v1.length, v2.length)
  for(let i=0; i < size; i++) {
      diff = Math.abs(v1[i] - v2[i])
      if (diff > rval) {
          rval = diff
      }
  }
  return rval
}

function mLargestEigen(mat, return_val=false, error=1e-10, maxcount=10000) {
  if ((mat == null) || (mat.length == 0)) {
      return []
  }
  let v1 = vInit(mat.length, 1.0/mat.length)
  for(let i=0; i<maxcount; i++) {
      let v2 = mMultVec(mat, v1)
      vNormalize(v2, true)
      let myerr = vDist(v1, v2)
      if (myerr < error) {
          if (return_val) {
              v2 = mMultVec(mat, v2)
              return vSum(v2)
          } else {
              return v2
          }
      }
      v1 = v2
  }
  throw "Convergence Exception"
}
function vNormalize(vec, inline=true) {
 let sum = 0
 let rval = null
 if (inline) {
     rval = vec
 } else {
     rval = vInit(vec.length)
 }

 for(let i=0; i < vec.length; i++) {
     sum += vec[i]
 }
 if (sum != 0.0) {
     for(let i=0; i < vec.length; i++) {
         rval[i] = vec[i] / sum
     }
 }
 if (inline) {
     return
 } else {
     return rval
 }
}

function vIdealize(vec, inline=true) {
   let maxv = Math.max(...vec)
   let rval = null
   if (inline) {
       rval = vec
   } else {
       rval = vInit(vec.length)
   }

   if (maxv != 0.0) {
       for(let i=0; i < vec.length; i++) {
           rval[i] = vec[i] / maxv
       }
   }
   if (inline) {
       return
   } else {
       return rval
   }
}

function mSquareAddPos(mat) {
  let size = mat.length
  let newRow = []
  for(let i=0; i < size; i++) {
      newRow.push(0)
      mat[i].push(0)
  }
  newRow.push(1)
  mat.push(newRow)
}

/**
Returns the index of the maximum value in the array.
If there is a tie, the winning indices are returned
*/
function argmax(data, always_array=false) {
if ((data == null) || (data.length == 0)) {
  return -1
}
let rval = 0
let max = data[0]
for(let i=1; i < data.length; i++) {
  if (data[i] > max) {
    max = data[i]
    rval = i
  }
}
//Check each index to see if it is a winner
let rvalArray=[]
for(let i=0; i < data.length; i++) {
  if (data[i] == max) {
    rvalArray.push(i)
  }
}
if ((rvalArray.length == 1) && (!always_array)) {
  return rvalArray[0]
} else {
  return rvalArray
}
}
/**
* Returns -2, -1, 0, 1, 2 describing how much better val1 is than val2
* -2 means val1 is much worse than val1
* -1 means val1 is worse than val1
* 0 means val1 is approximately equal to val1
* 1 means val1 is better than val1
* 2 means val1 is much better than val1
* @param {*} val1
* @param {*} val2
*/
function prefHML(val1, val2, lowCutoff=1.1, medCutoff=2.1) {
  if (val1 == 0) {
      if (val2 == 0) {
          return 0
      } else {
          //val1=0 and val2!=0
          //they are not comparable
          return null
      }
  } else if (val2 == 0) {
      //val2=0 and val1!=0
      //not comparable
      return null
  } else {
      let ratio = Math.abs(val1 / val2)
      if (ratio < 1/medCutoff) {
          //val1 is much worse than val2
          return -2
      } else if (ratio < 1/lowCutoff) {
          //val1 is worse than val2
          return -1
      } else if (ratio < lowCutoff) {
          //val1 is approx the same as val2
          return 0
      } else if (ratio < medCutoff) {
          //val1 is better than val2
          return 1
      } else {
          //val1 is much better than val2
          return 2
      }
  }
}

/**
* Returns a list of 2 items.  The first item is the index of the best
* alternative (if there is a tie, it returns the first index that was
* maximum).  The second thing it returns is the strength of that "best"
* 0=essentially the same as the 2nd best
* 1=somewhat better than the 2nd best
* 2=much better than the 2nd best
*/
function bestHMLIndex(priority) {
  let nalts = priority.length
  if (nalts == 0) {
      return null
  } else if (nalts == 1) {
      return [0, 0]
  }
  //Okay we handled the edge cases, now let's look
  //for the best and second best index
  let bestIndex=0
  let bestValue=priority[0]
  let secondIndex=1
  let secondValue=priority[1]
  for(let i=1; i < priority.length; i++) {
      if (priority[i] > bestValue) {
          secondIndex = bestIndex
          secondValue = bestValue
          bestIndex = i
          bestValue = priority[i]
      }
  }
  let pref = prefHML(bestValue, secondValue)
  return [bestIndex, pref]
}





/**********************************************/
/** Prioritizers ******************************/
/**********************************************/

class Prioritizer {
  constructor(size, altNames=null) {
      this.size = size
      this.alts = []
      this.alt_descriptions = []
      this.direct_data = []
      for(let i=0; i < size; i++) {
          this.alts[i] = "Alternative "+(i+1)
          this.direct_data[i] = 0
          this.alt_descriptions[i] = "Default description for Alternative "+(i+1)
      }
      if (altNames != null) {
        if (altNames.length == size) {
          this.alts = altNames
        }
      }
  }

  setdirect(position, value) {
      this.direct_data[position] = value
  }

  firstFreeName() {
      for(let i=1; i < this.alts.length+2; i++) {
          let name = "Alternative "+i
          if (!this.alts.includes(name)) {
              return name
          }
      }
      throw "Could not find a free name, this makes no sense"
  }

  addAlt(name, description="No description given") {
      this.size += 1
      if (name == null) {
          name = this.firstFreeName()
      }
      this.alts.push(name)
      this.alt_descriptions.push(description)
      this.direct_data.push(0)
  }

  nalts() {
      return this.alts.length
  }

  priority() {
      return vNormalize(this.direct_data, false)
  }

  indexOf(alt) {
      if (Number.isInteger(alt)) {
          //We are asking the index of something already an index, just return that
          return alt
      } else {
          let rval = this.alts.indexOf(alt)
          return rval
      }
  }

  /**
   * Returns a list of 2 items.  The first item is the index of the best
   * alternative (if there is a tie, it returns the first index that was
   * maximum).  The second thing it returns is the strength of that "best"
   * 0=essentially the same as the 2nd best
   * 1=somewhat better than the 2nd best
   * 2=much better than the 2nd best
   */
  bestAltIndex() {
      return bestHMLIndex(this.priority())
  }
}

/*******************************************************/
/**** Pairwise Prioritizer  ****************************/
/*******************************************************/

class Pairwise extends Prioritizer {
  constructor(size) {
      super(size)
      this.matrix =  mId(size)
  }

  set(row, col, val) {
      let rrow = this.indexOf(row)
      let rcol = this.indexOf(col)
      mPairwise(this.matrix, rrow, rcol, val)
  }

  get(row, col, val) {
      let rrow = this.indexOf(row)
      let rcol = this.indexOf(col)
      return this.matrix[rrow][rcol]
  }

  addAlt(name) {
      super.addAlt(name)
      mSquareAddPos(this.matrix)
  }

  priority() {
      return mLargestEigen(this.matrix)
  }
}

class AHPTreeNode extends Prioritizer {
  constructor(parentNode, size, name=null, description=null, altNames=null, id=null) {
      super(size, altNames)
      this.children = []
      this.sensitivity_weights_locked = []
      this.name = name
      this.description = description
      this.childPrioritizer = new Pairwise(0)
      this.sensitivity_weights = []
      this.sensitivity_scores = []
      //this.altPrioritizer = null
      this.parentNode = parentNode
      this.id = id
  }
  getChildWithIndex(index) {
    return this.children[index]
  }

  getChildWithName(name) {
    for(let i=0; i < this.children.length; i++) {
      let child = this.children[i]
      if (child.name == name) {
        return child
      } else {
        //Okay check this fellow's children for the given name
        let rval = child.getChildWithName(name)
        if (rval != null) {
          //One of the children had this name
          return rval
        }
      }
    }
    return null
  }

  getChildIndexWithName(name) {
    for(let i=0; i < this.children.length; i++) {
      let child = this.children[i]
      if (child.name == name) {
        return i
      }
    }
    return -1
  }


  getChildWithId(id) {
    for(let i=0; i < this.children.length; i++) {
      let child = this.children[i]
      if (child.id == id) {
        return child
      } else {
        //Okay check this fellow's children for the given name
        let rval = child.getChildWithId(id)
        if (rval != null) {
          //One of the children had this name
          return rval
        }
      }
    }
    return null
  }

  addChildName(name, description=null, id=null) {
    let childNode = new AHPTreeNode(this, this.alts.length, name, description, null, id)
    return this.addChild(childNode)
  }

  addChild(childNode=null) {
      if (childNode == null) {
          childNode = new AHPTreeNode(this.parentNode, this.alts.length)
      }
      this.children.push(childNode)
      this.childPrioritizer.addAlt(null)
      this.sensitivity_weights.push(0)
      this.sensitivity_weights_locked.push(false)
      return childNode
  }

  pairwise(child1, child2, value) {
      this.childPrioritizer.set(child1, child2, value)
  }

  pairwiseId(rowId, colId, value) {
    let top = this.topParentNode()
    let rowNode = this.getChildWithId(rowId)
    let colNode = this.getChildWithId(colId)
    let rowParentNode = rowNode.parentNode
    let colParentNode = colNode.parentNode
    let rowNodeName = rowNode.name
    let colNodeName = colNode.name
    let rowIndex = rowParentNode.getChildIndexWithName(rowNodeName)
    let colIndex = colParentNode.getChildIndexWithName(colNodeName)
    if (rowParentNode != colParentNode) {
      throw "Row node and column node do not have the same parent"
    }
    rowParentNode.pairwise(rowIndex, colIndex, value)
  }

  getPairwiseId(rowId, colId) {
    let top = this.topParentNode()
    let rowNode = this.getChildWithId(rowId)
    let colNode = this.getChildWithId(colId)
    let rowParentNode = rowNode.parentNode
    let colParentNode = colNode.parentNode
    let rowNodeName = rowNode.name
    let colNodeName = colNode.name
    let rowIndex = rowParentNode.getChildIndexWithName(rowNodeName)
    let colIndex = colParentNode.getChildIndexWithName(colNodeName)
    if (rowParentNode != colParentNode) {
      throw "Row node and column node do not have the same parent"
    }
    return rowParentNode.getPairwise(rowIndex, colIndex)
  }

  topParentNode() {
    if (this.parentNode == null) {
      //We are the top parent
      return this
    } else {
      //We have a parent, which may or may not be the top, ask her
      return this.parentNode.topParentNode()
    }
  }

  pairwiseAll(pwArray) {
    let nkids = this.nchildren()
    for (let row=0; row < nkids; row++) {
        for (let col=0; col < nkids; col++) {
            if (row != col) {
                let val = pwArray[row][col]
                if (val >= 1) {
                    //Only set for values >= 1, the others are reciprocals
                    this.childPrioritizer.set(row, col, val)
                }
            }
        }
    }
  }
  getPairwise(child1, child2) {
    return this.childPrioritizer.get(child1, child2)
  }

  setAltScore(alt, score) {
      if (Number.isInteger(alt)) {
          //We were passed the alternative as an integer position
          if (alt < 0) {
              throw "Alt index cannot be negative"
          } else if (alt >= this.nalts()) {
              throw "Alt index cannot be larger than the number of alternatives"
          }
          this.direct_data[alt] = score
      } else {
          //For now we do not allow non-integer refs to alternatives
          throw "Alternative must be indexed by position"
      }
  }

  addAlt(name) {
      super.addAlt(name)
      //console.log(this.children)
      for(var i=0; i<this.children.length; i++) {
        let child = this.children[i]
        console.log(child);
        child.addAlt(name)
      }
      if (this.altPrioritizer != null) {
        this.altPrioritizer.addAlt(name)
      }
  }


  nchildren() {
      return this.children.length
  }

  childrenNames() {
      if (this.children == null) {
          return null
      } else if (this.children.length == 0) {
          return []
      } else {
          let rval = []
          for(let i=0; i < this.children.length; i++) {
              rval.push(this.children[i].name)
          }
          return rval
      }
  }

  childrenDescriptions() {
      if (this.children == null) {
          return null
      } else if (this.children.length == 0) {
          return []
      } else {
          let rval = []
          for(let i=0; i < this.children.length; i++) {
              rval.push(this.children[i].description)
          }
          return rval
      }
  }

  synthesize() {
      if (this.children.length == 0) {
          //No children, simply return altScores upwards
          return this.direct_data
      }
      //Alright, let's synthesize, first I need to zero out the scores
      let nalts = this.direct_data.length
      for(let i=0; i < nalts; i++) {
          this.direct_data[i] = 0
      }
      //Now let's synthesize each child
      let childScores = this.childPrioritizer.priority()
      for(let i=0; i < this.children.length; i++) {
          let vals = this.children[i].synthesize()
          for(let alt=0; alt < nalts; alt++) {
              this.direct_data[alt] += childScores[i] * vals[alt]
          }
      }
      return this.direct_data
  }

  getSensitivityWeights() {
    if ((this.sensitivity_weights == null) ||
      (this.children.length != this.sensitivity_weights.length)
      || (allZero(this.sensitivity_weights))) {
      this.sensitivity_weights = this.childPrioritizer.priority();
    }
    //Make sure the sensitivity weights are normalized
    vNormalize(this.sensitivity_weights)
    return this.sensitivity_weights;
  }

  getLockedSensitivityWeightSum() {
    this.getSensitivityWeights();
    let unlockedSum = 0
    let lockedSum = 0
    for(let i=0; i < this.sensitivity_weights.length; i++) {
      if ((! this.sensitivity_weights_locked[i]) || (i == alt)) {
        unlockedSum += this.sensitivity_weights[i];
      } else {
        lockedSum += this.sensitivity_weights[i];
      }
    }
    return lockedSum
  }

  setSensitivityWeight(alt, newValue) {
    this.getSensitivityWeights();
    let epsilon = 0.0001
    // Let's get the sum of the sensitivity locked criteria
    let unlockedSum = 0
    let lockedSum = 0
    for(let i=0; i < this.sensitivity_weights.length; i++) {
      if ((! this.sensitivity_weights_locked[i]) || (i == alt)) {
        unlockedSum += this.sensitivity_weights[i];
      } else {
        lockedSum += this.sensitivity_weights[i];
      }
    }
    if (newValue < 0) {
      newValue = 0
    } else if (newValue > (unlockedSum-epsilon)) {
      newValue = unlockedSum-epsilon
    }
    let origVal = this.sensitivity_weights[alt]
    this.sensitivity_weights[alt] = newValue
    let oldSumOthers = unlockedSum-origVal
    let newSumOthers = unlockedSum-newValue
    if (oldSumOthers == 0) {
      //We only had a value at this alt, make the value 1 and move on
      this.sensitivity_weights[alt] = 0
      for(let i=0; i < this.sensitivity_weights.length; i++) {
        if ((!this.sensitivity_weights_locked[i]) && (i != alt)) {
          this.sensitivity_weights[i] = 0
        }
      }
    } else {
      //We can rescale
      for(let i=0; i < this.sensitivity_weights.length; i++) {
        if ((!this.sensitivity_weights_locked[i]) && (i != alt)) {
          this.sensitivity_weights[i] *= (newSumOthers / oldSumOthers)
        }
      }
    }
  }

  setSensitivityWeights(newValues) {
    this.sensitivity_weights = newValues
  }

  sensitivityLock(alt) {
    this.sensitivity_weights_locked[alt] = true
  }

  sensitivityUnlock(alt) {
    this.sensitivity_weights_locked[alt] = false
  }

  sensitivity(startAlt=0, endAlt=-1) {
    let nalts = this.nalts();
    if (endAlt < 0) {
      endAlt = nalts
    }
    /**Handle bottom level first*/
    if (this.children.length == 0) {
        //No children, simply return altScores upwards
        this.sensitivity_scores = this.direct_data.slice(startAlt, endAlt)
        return this.sensitivity_scores
    }
    //Now let's synthesize each child
    let childScores = this.getSensitivityWeights()
    let rval = Array(endAlt-startAlt)
    for(let i=0; i < rval.length; i++) {
      rval[i] = 0
    }
    let childrenAltScoresArray = [];
    for(let i=0; i < this.children.length; i++) {
      childrenAltScoresArray.push(this.children[i].sensitivity(startAlt, endAlt));
    }
    let altScore=0;
    for(let alt=0; alt < nalts; alt++) {
      let totalPriorityForAlt = 0;
      for(let kid=0; kid < this.children.length; kid++) {
        altScore = childrenAltScoresArray[kid][alt];
        if (isNumber(altScore)) {
          rval[alt] += childScores[kid] * altScore;
          totalPriorityForAlt += childScores[kid];
        }
      }
      if (totalPriorityForAlt != 0) {
        rval[alt] = rval[alt] / totalPriorityForAlt;
      }
    }
    this.sensitivity_scores = rval
    return rval
  }

  /**
  Returns the sensitivity scores, plus the children sensitivity scores
  that add up to these scores.  For instance, if you have 2 children with
  3 alts, and example result would look like
  {
    "alt_scores": [0.75, 0.5, 0.9],
    "alt_breakdowns": [
      [0.55, 0.20],
      [0.45, 0.05],
      [0.3, 0.6]
    ]
  }
  where alt_breakdowns[0] is the the scores for alt[0] relative to the
  2 children with the scores weighted by criteria scores.  So alt_breakdowns[0]
  sums to 0.75.
  */
  sensitivityFull(startAlt=0, endAlt=-1) {
    let nalts = this.nalts()
    let nkids = this.nchildren()
    let rval = {}
    rval["alt_scores"] = this.sensitivity(startAlt=startAlt, endAlt=endAlt)
    let breakdowns = []
    let childScores = this.getSensitivityWeights()
    for (let alt=0; alt < nalts; alt++) {
      let breakdown =[]
      for (let child=0; child < nkids; child++) {
        let c = this.getChildWithIndex(child)
        breakdown.push(childScores[child] * c.sensitivity_scores[alt])
      }
      breakdowns.push(breakdown)
    }
    rval["alt_breakdowns"] = breakdowns
    return rval
  }
  monteCarloAdjust(fromNode, pw_base=2, direct_base=0.1) {
    let nalts = this.nalts();
    let nkids = this.nchildren();
    if (this.nchildren() == 0) {
      //Direct data tweakign on the Bottom
      for(let alt=0; alt < nalts; alt++) {
        this.direct_data[alt] = fromNode.direct_data[alt] + direct_base * randn_bm(-1, 1)
        if (this.direct_data[alt] < 0) {
          this.direct_data[alt] = 0
        } else if (this.direct_data[alt] > 1) {
          this.direct_data[alt] = 1
        }
      }
    } else {
      //Tweaking pairwise comparisons, and all children
      for(let rowChild=0; rowChild < nkids; rowChild++) {
        let src = fromNode.children[rowChild]
        let dest = this.children[rowChild]
        //Adjust on the child
        dest.monteCarloAdjust(src, pw_base, direct_base)
        //Now adjust all pairwise comparisons for this row
        for(let colChild=(rowChild+1); colChild < nkids; colChild++) {
          let val = fromNode.getPairwise(rowChild, colChild)
          if (val == 0) {
            //set uncompared to 1
            val = 1
          }
          val = val * Math.pow(pw_base, randn_bm(-1, 1))
          this.pairwise(rowChild, colChild, val)
        }
      }
    }
  }
  monteCarlo(pw_base=2, direct_base=0.1, count=100) {
    let tempAHP = Object.create(this)
    let experiments = []
    let nalts = this.nalts()
    let winCounts = vInit(nalts)
    let winPercents = vInit(nalts)
    for(let i=0; i < count; i++) {
      //First do the adjustment
      tempAHP.monteCarloAdjust(this, pw_base, direct_base)
      //Now we Synthesize
      let scores = tempAHP.synthesize()
      experiments.push(scores.slice(0))
      let winner = argmax(scores, true)
      for(let j=0; j < winner.length; j++) {
        winCounts[winner[j]] += 1
      }
    }
    //Calcualte winning percentages
    for(let j=0; j < nalts; j++) {
      winPercents[j] = winCounts[j] / count
    }
    return {
      "experiments":experiments,
      "winCounts":winCounts,
      "winPercents":winPercents
    }
  }

  static fromJSONObject(obj, parentNode) {
      let size = 0
      if (parentNode == null) {
        //We are the first parent, so we have alts
        size = obj.alts.length
      } else {
        //Get the size from the parent
        size = parentNode.nalts()
      }
      let rval = new AHPTreeNode(parentNode, size, obj.name, obj.description, null, obj.id)
      if (parentNode != null) {
          //We have a parent node, we should use their alternative names
          rval.alts = parentNode.alts
      } else {
          //We need alt names from the object
          rval.alts = obj.alts
          if (obj.alt_descriptions != null) {
            rval.alt_descriptions = obj.alt_descriptions
          } else {
            rval.alt_descriptions = []
            for(let i=0; i < rval.alts.length; i++) {
              rval.alt_descriptions.push(null)
            }
          }
      }
      // Get children
      if ((obj.children != null) && (obj.children.length > 0)) {
          for (let i=0; i < obj.children.length; i++) {
              let kid = AHPTreeNode.fromJSONObject(obj.children[i], rval)
              rval.addChild(kid)
          }
          //Bottom level ones should probably have a pairwise matrix
          var pw
          if (obj.pairwise == null) {
            if (obj.childPrioritizer == null) {
              throw "For node "+obj.name+" we need a pairwise matrix either from pairwise property, or inside a Pairwise childPrioritizer"
            } else if (obj.childPrioritizer.matrix == null) {
              throw "For node "+obj.name+" you did not provide a pairwise property, but did provide a childPrioritizer, but that object had no matrix"
            } else {
              pw = obj.childPrioritizer.matrix
            }
          } else {
            pw = obj.pairwise
          }
          let nkids = obj.children.length
          for (let row=0; row < nkids; row++) {
              for (let col=0; col < nkids; col++) {
                  if (row != col) {
                      let val = pw[row][col]
                      if (val >= 1) {
                          //Only set for values >= 1, the others are reciprocals
                          rval.childPrioritizer.set(row, col, val)
                      }
                  }
              }
          }
      } else {
          //Bottom level alts can have scores
          if (obj.alt_scores != null) {
              if (obj.alt_scores.length != rval.nalts()) {
                throw "For node "+obj.name+" alt scores set as alt_scores are of the wrong length";
              }
              rval.direct_data = obj.alt_scores
          } else if (obj.direct_data != null) {
            if (obj.direct_data.length != rval.nalts()) {
              throw "For node "+obj.name+" alt scores set as direct_data are of the wrong length";
            }
            rval.direct_data = obj.direct_data
          }
      }
      // Check for sensitivity weights
      if (obj.sensitivity_weights != null) {
        if (obj.sensitivity_weights.length != obj.children.length) {
          throw "Sensitivity scores wrong length"
        }
        rval.sensitivity_weights = obj.sensitivity_weights
        vNormalize(rval.sensitivity_weights)
      } else {
        rval.sensitivity_weights = null
        rval.getSensitivityWeights()
        //console.log(rval.sensitivity_weights)
      }
      //Add in the pairwiseOrderByIds
      rval.pairwiseOrderByIds = obj.pairwiseOrderByIds
      return rval
    }

    /*
    Performs the VROI calculation with column / costs. If column is
    null, we call sensitivity first to get the column and then perform the
    calculation.  This returns an dictionary of lists.  The element["vroiRaw"] is the
    raw vroi score vector.  The element["vroiIdeal"] is the idealized vroi (the
    raw vroi divided by the max raw vroi, so that the largest element is 1
    in that vector).  The element["popRaw"] is the raw Price of Priority
    which is cost / (score * 100).  The element["popIdeal"] is the same
    except idealized
    */
    vroiCalc(costs, column=null, undefinedValue=null) {
      if (column == null) {
        column = this.sensitivity();
      }
      if (costs.length != this.nalts()) {
        throw "Costs length="+costs.length+" must equal number of alts="+this.nalts();
      } else if (column.length != this.nalts()) {
        throw "Column of values length must equal number of alts"
      }
      let vroiRaw = Array(costs.length)
      let vroiIdeal = Array(costs.length)
      let maxvroi = 0
      let popRaw = Array(costs.length)
      let popIdeal = Array(costs.length)
      let maxpop = 0
      for(let i=0; i < costs.length; i++) {
        if (costs[i] != 0) {
          vroiRaw[i] = column[i] / costs[i];
          if (maxvroi < vroiRaw[i]) {
            maxvroi = vroiRaw[i]
          }
        } else {
          vroiRaw[i] = undefinedValue;
        }
        if (column[i] != 0) {
          popRaw[i] = costs[i] / (100*column[i])
          if (maxpop < popRaw[i]) {
            maxpop = popRaw[i]
          }
        } else {
          popRaw[i] = undefinedValue
        }
      }
      //Create ideal vectors
      for(let i=0; i < costs.length; i++) {
        if (maxvroi!=0) {
          if (vroiRaw[i]!=undefinedValue) {
            vroiIdeal[i]=vroiRaw[i]/maxvroi
          } else {
            vroiIdeal[i]=undefinedValue
          }
        } else {
          vroiIdeal[i]=vroiRaw[i]
        }
        if (maxpop != 0) {
          if (popRaw[i] != undefinedValue) {
            popIdeal[i] = popRaw[i] / maxpop;
          } else {
            popIdeal[i] = undefinedValue
          }
        } else {
          popIdeal[i] = popRaw[i]
        }
      }
      //Our return value
      return {
        "vroiRaw" : vroiRaw,
        "vroiIdeal" : vroiIdeal,
        "popRaw" : popRaw,
        "popIdeal" : popIdeal
      }
    }

    /**
     * Returns an HTML element that represents the criteria
     * with descriptions:
     */
    getCriteriaTreeHtml(classText=null) {
      let rval = "";
      if (classText==null) {
        rval = "<ol>\n";
      } else {
        rval = "<ol class=\""+classText+"\">\n";
      }
      for(let i=0; i < this.children.length; i++) {
        let child = this.children[i]
        rval += "<li><span class=\"list-definition-term\">"+child.name+":</span> <span class=\"list-definition-definition\">"+child.description+"</span>\n";
        rval += child.getCriteriaTreeHtml(classText)
      }
      rval+="</ol>\n";
      return rval;
    }
}

/**
Creates a random number between min and max, normally
distributed, skew=1 means the mean = max - min.
Gotten from https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
*/
function randn_bm(min, max, skew=1) {
  var u = 0, v = 0;
  while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while(v === 0) v = Math.random();
  let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );

  num = num / 10.0 + 0.5; // Translate to 0 -> 1
  if (num > 1 || num < 0) num = randn_bm(min, max, skew); // resample between 0 and 1 if out of range
  num = Math.pow(num, skew); // Skew
  num *= max - min; // Stretch to fill range
  num += min; // offset to min
  return num;
}

/**
 * Converts an integer vote of 2, 1, 0, -1, -2 to values of
 * much_better, better, 1, 1/better, 1/much_better.
 */
function convertIntegerSymbolicVote(vote, better=2, much_better=5) {
  switch(vote) {
    case 0:
      //They are equal
      return 1;
    case 1:
      //Row is better
      return better;
    case 2:
      //Row is much Better
      return much_better;
    case -1:
      //col is better
      return 1.0/better;
    case -2:
      //col is much better
      return 1.0/much_better;
    default:
      throw "Unknown symbolic vote "+vote
  }
}

/**
 * Converts a numeric vote to a symbolic one, based on the
 * values of better and much better given.  If:
 * * vote is 0 that means no vote and we return undefined
 * * vote is within epsilon of much_better we return 2
 * * vote is within epsilon of better we return 1
 * * vote is within epsilon of 1 we return 0
 * * 1/vote is within epsilon of better we return -1
 * * 1/vote is within epsilon of much_better we return -2
 * * otherwise we return undefined.
 */
function convertNumericVoteToIntegerSymbolic(vote, better=2, much_better=5, epsilon=0.1) {
  if (vote == null) {
    //No vote given, none sent back
    return undefined
  } else if (vote == 0) {
    //No vote for this return undefined
    return undefined
  } else if (Math.abs(vote - much_better) < epsilon) {
    //A much better vote
    return 2
  } else if (Math.abs(vote - better) < epsilon) {
    //A better vote
    return 1
  } else if (Math.abs(vote - 1) < epsilon) {
    //An equals
    return 0
  } else if (Math.abs(1.0/vote - better) < epsilon) {
    //A better vote in the opposite directon
    return -1
  } else if (Math.abs(1.0/vote - much_better) < epsilon) {
    //A better vote in the opposite directon
    return -2
  } else {
    //I don't know what kind of vote this is, log it and return undef
    console.log("Unknown symbolic vote "+vote)
  }
}

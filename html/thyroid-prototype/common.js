var NRESPONSES_KEY = 'nresposes';
var RESPONSE_KEY = 'response-';
var CURRENT_RESPONSE_KEY = 'currentResponse';



function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function addResponse(values=null) {
  if (values === null) {
    values = {};
  }
  var current = numberOfCurrentResponses();
  let newKey = RESPONSE_KEY+current;
  localStorage.setItem(newKey, JSON.stringify(values));
  localStorage.setItem(NRESPONSES_KEY, Number(current)+1);
  setCurrentResponseKey(newKey);
  return newKey
}

function setACurrentResponseValue(forKey, newValue) {
  let responseKey = getCurrentResponseKey();
  let vals = getCurrentResponseValues();
  vals[forKey] = newValue;
  localStorage.setItem(responseKey, JSON.stringify(vals));
}

function setCurrentResponseKey(newKey) {
  sessionStorage.setItem(CURRENT_RESPONSE_KEY, newKey);
}

function getCurrentResponseValues() {
  let key = getCurrentResponseKey();
  if ((key === undefined) || (key === null)) {
    //alert("Current Response Key is null");
    return {};
  } else {
    return JSON.parse(localStorage.getItem(key));
  }
}

function getResponseValues(responseId) {
  return JSON.parse(localStorage.getItem(responseId))
}

function getNameOfCurrentRespondent() {
  let currentValues = getCurrentResponseValues();
  //alert(currentValues['name']);
  return currentValues['name'];
}

function getNameOfRespondent(respondentKey) {
  var response = getResponseValues(responseKey);
  return response['name']
}

function getCurrentResponseKey() {
  //alert("In current response key fetcher");
  return sessionStorage.getItem(CURRENT_RESPONSE_KEY);
}

function numberOfCurrentResponses() {
  var current = localStorage.getItem(NRESPONSES_KEY);
  if ((current === undefined) || (current === null)) {
    //alert("Nothing yet defined");
    current = 0;
    localStorage.setItem(NRESPONSES_KEY, 0);
  } else {
    //alert("We have "+current+" number of responses");
  }
  return current;
}

function storeDemographics() {
  let result = {}
  let demographic;
  for (demographic of DEMOGRAPHICS) {
    result[demographic] = document.getElementById(demographic).value
  }
  let nr = numberOfCurrentResponses();
  //alert("Current number of responses="+nr);
  addResponse(result);
  window.location.href = "walk1.html";
}


function insertResponseIntoClass(className, responseKey) {
  let elts = document.getElementsByClassName(className);
  //alert("You have "+elts.length+" elements for participantName");
  let currentValues = getCurrentResponseValues();
  let name = currentValues[responseKey];
  for (elt of elts) {
    elt.innerHTML = name;
  }
}

function insertStringIntoClass(className, stringValue) {
  let elts = document.getElementsByClassName(className);
  //alert("You have "+elts.length+" elements for participantName");
  for (elt of elts) {
    elt.innerHTML = stringValue;
  }
}

function getResponseValue(keyName) {
  let responses = getCurrentResponseValues();
  return responses[keyName];
}

function getResponseValueWithResponseId(responseId, keyName) {
  let responses = getResponseValues(responseId);
  return responses[keyName];
}



function getResponseAHPModelOld() {
  var ahpjsonString = getResponseValue("ahpmodel");
  var ahpjson;
  if (ahpjsonString == null) {
    ahpjson = AHP_MODEL_JSON;
  } else {
    ahpjson = JSON.parse(ahpjsonString);
  }
  let ahpmodel = AHPTreeNode.fromJSONObject(ahpjson);
  return ahpmodel
}

function getResponseAHPModel() {
  var ahpmodel = AHP_MODEL;
  var votesjsonString = getResponseValue("ahpvotes");
  if (votesjsonString == null) {
    //No votes yet, do nothing
  } else {
    votesDictionary = JSON.parse(votesjsonString);
    setAHPModelAllSymbolicPairwise(ahpmodel, votesDictionary)
  }
  return ahpmodel
}

function getResponseAHPModelWithResponseId(responseKey) {
  var ahpmodel = AHP_MODEL;
  var votesjsonString = getResponseValueWithResponseId(responseKey, "ahpvotes");
  if (votesjsonString == null) {
    //No votes yet, do nothing
  } else {
    votesDictionary = JSON.parse(votesjsonString);
    setAHPModelAllSymbolicPairwise(ahpmodel, votesDictionary)
  }
  return ahpmodel
}

/**
This function gets all of the pairwise comparisons in symbolic form.
The returned result is a dictionary whose keys are [rowId,colId] and
values are the symbolic (-2, -1, 0, 1, 2) vote for that comparison.
*/
function getAHPModelAllSymbolicPairwise(ahpmodel) {
  //First we need to get that list of pw votes
  var voteLocations = ahpmodel.pairwiseOrderByIds;
  var rval = {};
  var numericVote;
  var symbolicVote;
  var locationInfo;
  for (var location of voteLocations) {
    locationInfo = location.join(" ")
    numericVote = ahpmodel.getPairwiseId(location[0], location[1])
    if (numericVote != 0) {
      //Only need to store non-zero votes
      symbolicVote = convertNumericVoteToIntegerSymbolic(numericVote)
      rval[locationInfo] = symbolicVote
    }
  }
  return rval;
}

/**
Sets all the pairwise data using the pwDictionary generated from
getAHPModelAllSymbolicPairwise()
*/
function setAHPModelAllSymbolicPairwise(ahpmodel, pwDictionary) {
  var symbolicVote
  var numericVote
  var location
  for (var locationInfo in pwDictionary) {
    location = locationInfo.split(" ")
    symbolicVote = pwDictionary[locationInfo]
    numericVote = convertIntegerSymbolicVote(symbolicVote)
    ahpmodel.pairwiseId(location[0], location[1], numericVote)
  }
}


function setResponseAHPModelOld(ahpmodel) {
  //There is a problem with circular refs, don't store parent node
  var ahpjson = JSON.stringify(ahpmodel, function(key, value) {
    if (key == "parentNode") {
      return undefined;
    } else {
      return value;
    }
  });
  setACurrentResponseValue("ahpmodel", ahpjson);
}

/**
This one only fetches all of the pw, as ordered by pairwiseOrderByIds
and sets into a dictionary
*/
function setResponseAHPModel(ahpmodel) {
  var pw = getAHPModelAllSymbolicPairwise(ahpmodel)
  var pwjson = JSON.stringify(pw);
  setACurrentResponseValue("ahpvotes", pwjson);
}



/**
If the URL has a responseKey= value, we grab it and set the
current response to that.
*/
function setResponseKeyFromURL() {
  var url = new URL(window.location.href)
  var responseKey = url.searchParams.get("responseKey");
  console.log(responseKey)
  if (responseKey == null) {
    //We have nothing to do, there was no responseKey
  } else {
    //Let's make sure the response exists
    if (localStorage.getItem(responseKey) != null) {
      setCurrentResponseKey(responseKey);
    } else {
      alert("Invalid response key sent, nothing done.");
    }
  }
}
//Checks if the url has a responseKey item sets
function hasResponseKeyFromURL() {
  var url = new URL(window.location.href)
  var responseKey = url.searchParams.get("responseKey");
  return responseKey != null;
}

//Simple function to go back one page of history
function goBack() {
  window.history.back();
}

function ahpModelSortedAlts(ahpModel) {
  var priorities = ahpModel.synthesize();
  var alts = ahpModel.alts.slice(0);
  var altsSorted = alts.slice(0);
  var altScoresDict = {};
  for(var i=0; i < alts.length; i++) {
    altScoresDict[alts[i]] = priorities[i];
  }
  altsSorted.sort(function(a, b) {
    var cmp = altScoresDict[b]-altScoresDict[a];
    // alert("Comparing "+a+" to "+b+ " compare value = "+cmp)
    return cmp
  })
  return altsSorted
}


// Handles inserting the navigation into each page
// must be called in the page, of course :)
function insertNAVIntoHTML() {
  let navstring=`
    <li><a href="demographics.html">Demographics</a></li>
    <li><a href="walk1.html">Patient Information Walkthrough</a></li>
    <li><a href="pairwise.html">Compare Criteria</a></li>
    <li><a href="results.html">Patient Summary</a></li>
    <li><a href="dr.html">Doctor Summary</a></li>
    <li><a href="notes.html">Doctor's Notes</a></li>
    `
  insertStringIntoClass('main-nav', navstring)
}


/**This is a poor mans dataframe.*/
class DF {
  constructor() {
    this.rowNames = []
    this.colNames = []
    this.data = []
  }

  nCols() {
    return this.colNames.length;
  }

  addRow(rowName) {
    var rval = this.rowNames.indexOf(rowName)
    if (rval >= 0) {
      //Row already existed, give up
    } else {
      this.rowNames.push(rowName)
      this.data.push(new Array(this.nCols()))
      rval = this.rowNames.length - 1
    }
    return rval
  }

  addCol(colName) {
    var rval = this.colNames.indexOf(colName)
    if (rval >= 0) {
      //Column already existed
    } else {
      this.colNames.push(colName)
      for(var row of this.data) {
        row.push(null)
      }
      rval = this.colNames.length - 1
    }
    return rval
  }

  set(rowName, colName, val) {
    var row = this.addRow(rowName)
    var col = this.addCol(colName)
    this.data[row][col] = val
  }

  toCSV() {
    var colsep = "\t"
    var rowsep = "\n"
    var rval = colsep+this.colNames.join(colsep)+rowsep
    for (var rowIndex=0; rowIndex < this.data.length; rowIndex++) {
      rval += this.rowNames[rowIndex]+colsep
      rval += this.data[rowIndex].join(colsep)
      rval += rowsep
    }
    return rval;
  }
}
var CURRENT_RESPONDENT_NAME = getNameOfCurrentRespondent();

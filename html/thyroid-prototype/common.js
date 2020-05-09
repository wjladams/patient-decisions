var NRESPONSES_KEY = 'nresposes';
var RESPONSE_KEY = 'response-';
var CURRENT_RESPONSE_KEY = 'currentResponse';
var BETHESDA_CANCER_RISK_TEXT = {
  'I':'1% to 4%',
  'II':'0% to 3%',
  'III':'5% to 15%',
  'IV':'15% to 30%',
  'V':'60% to 75%',
  'IV':'97% to 99%'
};

var AFIRMA_PPV_BY_BETHESDA = {
  'I': '?',
  'II': '?',
  'III': '38%',
  'IV': '37%',
  'V': '76%',
  'VI': '?%'
}

var THYROSEQ_PPV_BY_BETHESDA = {
  'I': '?',
  'II': '?',
  'III': '64%',
  'IV': '68%',
  'V': '?%',
  'VI': '?%'
}

var AFIRMA_ONE_MINUS_NPV_BY_BETHESDA = {
  'I': '?',
  'II' : '?',
  'III' : '5%',
  'IV' : '6%',
  'V' : '15%',
  'VI' : '?'
}

var THYROSEQ_ONE_MINUS_NPV_BY_BETHESDA = {
  'I': '?',
  'II' : '?',
  'III' : '3%',
  'IV' : '2%',
  'V' : '?',
  'VI' : '?'
}

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

function getResponseValues(key) {
  return JSON.parse(localStorage.getItem(key))
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
  let dresult = {}
  let demographic;
  for (demographic of DEMOGRAPHICS) {
    dresult[demographic] = document.getElementById(demographic).value
  }
  let name = document.getElementById("name").value;
  let age = document.getElementById("age").value;
  let sex = document.getElementById("sex").value;
  let bethesda = document.getElementById("bethesda").value;
  let afirma = document.getElementById("afirma").value;
  let thyroseq = document.getElementById("thyroseq").value;
  let result = {
    name:name,
    age:age,
    sex:sex,
    bethesda:bethesda,
    afirma:afirma,
    thyroseq:thyroseq
  };
  //Let's just call it out for now
//			alert("Hello "+JSON.stringify(result));
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

function insertResponsesIntoHTML() {
  /**
  Inserts the standard variables into the spans with the appropriate
  names.  Uses the fucntion insertResponseIntoClass() to do the actual work.
  */
  insertResponseIntoClass('participantName', 'name');
  insertResponseIntoClass('bethesdaScore', 'bethesda');
  let responses = getCurrentResponseValues();
  let bethesda = responses['bethesda'];
  insertStringIntoClass('bethesdaScoreRiskRange', BETHESDA_CANCER_RISK_TEXT[bethesda]);
  let molecularTestName = getResponseMolecularTestName();
  molecularTestName = capitalizeFirstLetter(molecularTestName);
  insertStringIntoClass('molecularTestName', molecularTestName);
  let adjustedCancerRisk = getResponseAdjustCancerRisk();
  insertStringIntoClass('adjustedCancerRisk', adjustedCancerRisk);
}

function getResponseAdjustCancerRisk() {
  //This is based on Bethesda and Molecular testing
  let bethesda = getResponseValue('bethesda');
  let afirma = getResponseValue('afirma');
  let thyroseq = getResponseValue('thyroseq');
  if (afirma != "") {
    //We have afirma for the adjusted cancer risk
    if (afirma > 0) {
      //We have an afirma positive, use our ppv value
      return AFIRMA_PPV_BY_BETHESDA[bethesda];
    } else if (afirma < 0) {
      //We have an afirma negative, use AFIRMA_ONE_MINUS_NPV_BY_BETHESDA
      return AFIRMA_ONE_MINUS_NPV_BY_BETHESDA[bethesda];
    } else {
      //This shouldn't have happened
      return 'Misunderstood afirma score of '+afirma;
    }
  } else if (thyroseq != "") {
    if (thyroseq > 0) {
      //We have a thyroseq postivie, use ppv
      return THYROSEQ_PPV_BY_BETHESDA[bethesda];
    } else if (thyroseq < 0) {
      return THYROSEQ_ONE_MINUS_NPV_BY_BETHESDA[bethesda];
    } else {
      return "Misunderstood thyroseq score of "+thyroseq;
    }
  } else {
    return "no adjustment because no molecular testing was performed";
  }
}
function getResponseValue(keyName) {
  let responses = getCurrentResponseValues();
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


function getResponseHasUsefulMolecularTesting() {
  let afirma = getResponseValue("afirma");
  let thyroseq = getResponseValue("thyroseq");
  let bethesda = getResponseValue('bethesda');
  if (afirma != 0){
    switch(bethesda) {
      //Molecular testing is useful for bethesda 3,4,5
      case 'III':
      case 'IV':
      case 'V':
        return true;
        break;
      default:
        return false;
        break;
    }
  } else if (thyroseq != 0) {
    switch(bethesda) {
      //Molecular testing is useful for bethesda 3,4
      case 'III':
      case 'IV':
        return true;
      default:
        return false;
    }
  } else {
    return false;
  }
}

function getResponseMolecularTestName() {
  let afirma = getResponseValue("afirma");
  let thyroseq = getResponseValue("thyroseq");
  if (afirma != "") {
    return "afirma";
  } else if (thyroseq != "") {
    return "thyroseq";
  } else {
    return "";
  }
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

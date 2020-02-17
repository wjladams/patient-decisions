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
    alert("Current Response Key is null");
    return {};
  } else {
    return JSON.parse(localStorage.getItem(key));
  }
}

function getNameOfCurrentRespondent() {
  let currentValues = getCurrentResponseValues();
  //alert(currentValues['name']);
  return currentValues['name'];
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
  let name = document.getElementById("pname").value;
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

function getResponseAHPModel() {
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

function setResponseAHPModel(ahpmodel) {
  //There is a problem with circular refs, don't store parent node
  let ahpjson = JSON.stringify(ahpmodel, function(key, value) {
    if (key == "parentNode") {
      return undefined;
    } else {
      return value;
    }
  });
  setACurrentResponseValue("ahpmodel", ahpjson);
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

var CURRENT_RESPONDENT_NAME = getNameOfCurrentRespondent();

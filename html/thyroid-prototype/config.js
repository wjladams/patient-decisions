// This file contains configuration for the specific
// patient decision we are doing.

//The demographic variable names / ids in demographics.html
DEMOGRAPHICS = ["name", "age", "sex", "bethesda", "afirma", "thyroseq"]

// Configure this yourself
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

////////////////////////////////////////////////////
// Global variables specific to this application  //
// of We WeDecide                                 //
////////////////////////////////////////////////////
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
////////////////////////////////////////////////////
// End Global Variables Specific to application  //
////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////
/// Additional functions needed until the end of this file//////
/// These are only functions that are used in this config.js ///
////////////////////////////////////////////////////////////////
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

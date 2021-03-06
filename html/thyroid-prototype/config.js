// This file contains configuration for the specific
// patient decision we are doing.

//The demographic variable names / ids in demographics.html
DEMOGRAPHICS = ["name", "age", "sex", "bethesda", "afirma", "thyroseq"]

// Configure this function yourself.  This is used to insert Demographics
// and other information into html elements.  See this example to understand
// how to use it.
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
/// Additional functions needed                              ///
/// These are only functions that are used in this config.js ///
/// You could also put walkthrough functions needed across   ///
/// multiple walkthroughs in here.                           ///
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

////////////////////////////////////////////////////////////////
////  End of additional function section                   /////
////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////
//// The AHP Model JSON and creating it                       //////
////////////////////////////////////////////////////////////////////

var AHP_MODEL_JSON = {
  "name" : "Thyroid Cancer Model",
  "description" : "Our first attempt at the Thyroid Cancer Model.",
  "alts" : ["Observation", "Hemi-Thyroidectomy", "Total Thyroidectomy"],
  "alt_descriptions" : ["Remain vigilant", "Better explanation", "Remove all of the thyroid"],
  "children": [
      {
        "name": "Not Knowing if I Have Cancer",
        "id" : 0,
        "description": "Making Sure I Know if I Have Cancer",
        "alt_scores": [0, 0.8, 1.0]
      },
      {
        "name" : "Having Surgery",
        "id" : 1,
        "description" : "Concerns About Having Surgery",
        "children" : [
          {
            "name": "Having a Scar",
            "id": 2,
            "description" : "The different options have differing scarring effects.",
            "alt_scores" : [1.0, 0.2, 0.1]
          },
          {
            "name": "Potential Low Calcium",
            "id":3,
            "description" : "Some options could require you to take a calcium supplement.",
            "alt_scores" : [1.0, 0.3, 0.1]
          },
          {
            "name": "Voice Complications",
            "id": 4,
            "description" : "Some options could effect your voice.",
            "alt_scores" : [1.0, 0.2, 0.1]
          },
          {
            "name": "Need for Thyroid Supplemenatation",
            "id":5,
            "description" : "Some options may require lifelong thyroid medication.",
            "alt_scores" : [1.0, 0.9, 0.5]
          },
          {
            "name": "Recovery from Surgery",
            "id":6,
            "description" : "Some options have longer recovery times.",
            "alt_scores" : [1.0, 0.9, 0.5]
          },
        ],
        "pairwise" : [
          [1, 0, 0, 0, 0],
          [0, 1, 0, 0, 0],
          [0, 0, 1, 0, 0],
          [0, 0, 0, 1, 0],
          [0, 0, 0, 0, 1]
        ]
      }
  ],

  "pairwise": [
    [1, 0],
    [0, 1],
  ],

  "pairwiseOrderByIds": [
    [2, 3],
    [3, 4],
    [4, 5],
    [5, 6],
    [2, 4],
    [2, 5],
    [2, 6],
    [3, 5],
    [3, 6],
    [4, 6],
    [0, 1]
  ]

}

var AHP_MODEL = AHPTreeNode.fromJSONObject(AHP_MODEL_JSON)

var RESULTS_END_TEXT = "Please return the tablet to the front desk"

////////////////////////////////////////////////////////////////////
//// End of the AHP Model definition section                  //////
////////////////////////////////////////////////////////////////////

// This file contains configuration for the specific
// patient decision we are doing.

//The demographic variable names / ids in demographics.html
DEMOGRAPHICS = ["name", "age", "gender", "surprised"]

// Configure this function yourself.  This is used to insert Demographics
// and other information into html elements.  See this example to understand
// how to use it.
function insertResponsesIntoHTML() {
  /**
  Inserts the standard variables into the spans with the appropriate
  names.  Uses the fucntion insertResponseIntoClass() to do the actual work.
  */
  insertResponseIntoClass('participantName', 'name');
  insertStringIntoClass('numberOfSteps', NUMBER_OF_WALKTHROUGH_STEPS)
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



////////////////////////////////////////////////////////////////
////  End of additional function section                   /////
////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////
//// The AHP Model JSON and creating it                       //////
////////////////////////////////////////////////////////////////////

var AHP_MODEL_JSON_41 = {
  "name" : "Otosclerosis Model",
  "description" : "Version 4.1 of the Otosclerosis Model.",
  "alts" : ["Watchful Waiting", "Hearing Aid", "Surgery"],
  "alt_descriptions" : ["Remain vigilant", "Hearing aid", "Surgery of inner ear"],
  "children": [
      {
        "name": "Hearing Improvement",
        "id" : 0,
        "description": "",
        "alt_scores": [0, 0.5, 1.0]
      },
      {
        "name" : "Risks to Overall Health and Hearing",
        "id" : 1,
        "description" : "both temporary and permanent risks to health.",
        "children" : [
          {
            "name": "Hearing Risks",
            "id": 2,
            "description": "hearing loss (1 in 200 chance) or hearing distortion",
            "children":
            [
              {
                "name": "Permanent Hearing Reduction",
                "description": "1 in 200 people who have this treatment are at risk of permanently reduced hearing in the treated ear.",
                "id":3,
                "alt_scores": [1.0, 1.0, 0]
              },
              {
                "name": "Hearing Distortion",
                "description": "1 in 100 hearing aid users report distortion.",
                "id":4,
                "alt_scores": [1.0, 0.0, 1.0]
              }
            ],
            "pairwise" : [
              [1, 0],
              [0, 1]
            ]
          },
          {
            "name":"Health Risks",
            "id":5,
            "description":"overall risks to health based on treatment option chosen",
            "children":
            [
              {
                "name": "Increase Chance of Ear Infections",
                "id":6,
                "description":"This treatment increases the chance of recurring ear infections whilst it is being used (1% versus 10%)",
                "alt_scores":[1.0, 0.0, 1.0]
              },
              {
                "name": "Balance disturbance ",
                "description":"1 in 200 people who receive this treatment report a long lasting balance disturbance that can be quite debilitating in the first few weeks",
                "id":7,
                "alt_scores":[1.0, 1.0, 0.0]
              },
              {
                "name": "Temporary risk of taste disturbance",
                "description":"1 in 5 people who receive this treatment report a temporary change to the taste sensation on a small segment of their tongue (a few weeks)",
                "id":8,
                "alt_scores":[1.0, 1.0, 0.0]
              }
            ],
            "pairwise" : [
              [1, 0, 0],
              [0, 1, 0],
              [0, 0, 1]
            ]
          }
        ],
        "pairwise" : [
          [1, 0],
          [0, 1]
        ]
      },
      {
        "name": "Inconvenience",
        "id":9,
        "description":"A quarter of people who chose this treatment reported stopping because of the following inconveniences: <ul><li>Requires regular maintenance and upkeep <li>Cosmetic impact of treatment visible to others <li>Sound quality that was not perfect in all environments</ul>",
        "children":
        [
          {
            "name": "Short Term Inconveniences (less than a month)",
            "id":10,
            "description":"These are inconveniences that last for last than a month, without long term impacts.",
            "alt_scores":[1.0, 0.7, 0.1],
          },
          {
            "name": "Long Term Inconveniences (a month or longer)",
            "id":11,
            "description":"These are inconveniences that last longer than a month.",
            "alt_scores":[0.4, 0.1, 1.0]
          }
        ],
        "pairwise" : [
          [1, 0],
          [0, 1]
        ]
      }
    ],

    "pairwise": [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1]
    ],

  "pairwiseOrderByIds": [
    [0, 1],
    [1, 9],
    [0, 9],
    [2, 5],
    [3, 4],
    [6, 7],
    [7, 8],
    [6, 8],
    [10, 11]
  ]

}

var AHP_MODEL_JSON_50 = {
  "name" : "Otosclerosis Model",
  "description" : "Nish's version of the Otosclerosis Model.",
  "alts" : ["Watchful Waiting", "Hearing Aid", "Surgery"],
  "alt_descriptions" : ["Remain vigilant", "Hearing aid", "Surgery of inner ear"],
  "children": [
    {
      "name": "Hearing Improvement",
      "id": 5,
      "description": "Make this option more important if improving your hearing is more important",
      "alt_scores": [0, 0.5, 1],
    },
    {
      "name": "Procedure Risks",
      "id": 6,
      "description": "Make this option more important if you are more concerned about procedural risks than improving your hearing.",
      "children": [
        {
          "name": "Inconvenience",
          "id":0,
          "description":"A quarter of people who chose this treatment reported stopping because of the following inconveniences: <ul><li>Requires regular maintenance and upkeep <li>Cosmetic impact of treatment visible to others <li>Sound quality that was not perfect in all environments</ul>",
          "alt_scores": [0, 0.5, 1.0]
        },
        {
          "name": "Recurring ear infections",
          "id" : 1,
          "description": "Hearing aids increase the chance of recurring ear infections whilst they are being used (1% versus 10%)",
          "alt_scores": [0, 0.5, 1.0]
        },
        {
          "name": "Permanent hearing reduction",
          "id": 2,
          "description": "1 in 200 people who have this treatment are at risk of permanently reduced hearing in the treated ear",
          "alt_scores": [0, 0, 0]
        },
        {
          "name": "Temporary risk of taste disturbance",
          "id": 3,
          "description": "1 in 5 people who receive this treatment report a temporary change to the taste sensation on a small segment of their tongue (a few weeks)",
          "alt_scores": [0, 0, 0]
        },
        {
          "name": "Balance disturbance",
          "id": 4,
          "description": "1 in 200 people who receive this treatment report a long lasting balance disturbance that can be quite debilitating in the first few weeks",
          "alt_scores": [0, 0, 0]
        }
      ],
      "pairwise": [
        [1, 0, 0, 0, 0],
        [0, 1, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0 ,0, 1, 0],
        [0, 0, 0, 0, 1]
      ],
    }
  ],
  "pairwise": [
    [1, 0],
    [0, 1]
  ],

  "pairwiseOrderByIds": [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [0, 2],
    [1, 3],
    [2, 4],
    [5, 6]
  ]

}

var AHP_MODEL_JSON_51 = {
  "name" : "Otosclerosis Model",
  "description" : "Nish's version of the Otosclerosis Model Simplified.",
  "alts" : ["Hearing Aid", "Surgery"],
  "alt_descriptions" : ["Hearing aid", "Surgery of inner ear"],
  "children": [
    {
      "name": "Inconvenience",
      "id":0,
      "description":"A quarter of people who chose this treatment reported stopping because of the following inconveniences: <ul><li>Requires regular maintenance and upkeep <li>Cosmetic impact of treatment visible to others <li>Sound quality that was not perfect in all environments</ul>",
      "alt_scores": [0, 1.0]
    },
    {
      "name": "Recurring ear infections",
      "id" : 1,
      "description": "Hearing aids increase the chance of recurring ear infections whilst they are being used (1% versus 10%)",
      "alt_scores": [0, 1.0]
    },
    {
      "name": "Permanent hearing reduction",
      "id": 2,
      "description": "1 in 200 people who have this treatment are at risk of permanently reduced hearing in the treated ear",
      "alt_scores": [.66, 0]
    },
    {
      "name": "Temporary risk of taste disturbance",
      "id": 3,
      "description": "1 in 5 people who receive this treatment report a temporary change to the taste sensation on a small segment of their tongue (a few weeks)",
      "alt_scores": [.66, 0]
    },
    {
      "name": "Balance disturbance",
      "id": 4,
      "description": "1 in 200 people who receive this treatment report a long lasting balance disturbance that can be quite debilitating in the first few weeks",
      "alt_scores": [.66, 0]
    }
  ],
  "pairwise": [
    [1, 0, 0, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0 ,0, 1, 0],
    [0, 0, 0, 0, 1]
  ],
  "pairwiseOrderByIds": [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [0, 2],
    [1, 3],
    [2, 4],
    [0, 3],
    [1, 4],
    [0, 4]
  ]

}

var NUMBER_OF_WALKTHROUGH_STEPS=17
var AHP_MODEL = AHPTreeNode.fromJSONObject(AHP_MODEL_JSON_51)

////////////////////////////////////////////////////////////////////
//// End of the AHP Model definition section                  //////
////////////////////////////////////////////////////////////////////

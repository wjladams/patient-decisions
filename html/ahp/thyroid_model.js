var AHP_MODEL_JSON = {
  "name" : "Thyroid Cancer Model",
  "description" : "Our first attempt at the Thyroid Cancer Model.",
  "alts" : ["Observation", "Hemi-Thyroidectomy", "Total Thyroidectomy"],
  "alt_descriptions" : ["Remain vigilant", "Better explanation", "Remove all of the thyroid"],
  "children": [
      {
        "name": "Certain about Having Cancer",
        "id" : 0,
        "description": "Making Sure I Know if I Have Cancer",
        "alt_scores": [0, 0.8, 1.0]
      },
      {
        "name" : "Surgical Concerns",
        "id" : 1,
        "description" : "Concerns About Having Surgery",
        "children" : [
          {
            "name": "Scar",
            "id": 2,
            "description" : "The different options have differing scarring effects.",
            "alt_scores" : [1.0, 0.2, 0.1]
          },
          {
            "name": "Low Calcium",
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
            "name": "Need for Medication",
            "id":5,
            "description" : "Some options may require lifelong medication.",
            "alt_scores" : [1.0, 0.9, 0.5]
          },
          {
            "name": "Recovery",
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

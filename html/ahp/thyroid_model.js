var AHP_MODEL_JSON = {
  "name" : "Thyroid Cancer Model",
  "description" : "Our first attempt at the Thyroid Cancer Model.",
  "alt_names" : ["Observation", "Hemi-Thyroidectomy", "Total Thyroidectomy"],
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
            "name": "No Scar",
            "id": 2,
            "description" : "Not having a scar",
            "alt_scores" : [1.0, 0.2, 0.1]
          },
          {
            "name": "Medication forever",
            "id":3,
            "description" : "The possible need to take medication forever",
            "alt_scores" : [1.0, 0.3, 0.1]
          },
          {
            "name": "Avoid surgery",
            "id": 4,
            "description" : "Not having surgery if I don't have to",
            "alt_scores" : [1.0, 0.2, 0.1]
          },
          {
            "name": "Risk to voice",
            "id":5,
            "description" : "Avoiding risks to my voice at all costs",
            "alt_scores" : [1.0, 0.9, 0.5]
          },
          {
            "name": "Another option",
            "id":6,
            "description" : "Just here",
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

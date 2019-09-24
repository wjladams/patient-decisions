AHP_MODEL_JSON = {
  "name" : "Thyroid Cancer Model",
  "description" : "Our first attempt at the Thyroid Cancer Model.",
  "alt_names" : ["Watchful Waiting", "Remove 1/2 Thyroid", "Remove Thyroid"],
  "alt_descriptions" : ["Remain vigilant", "Better explanation", "Remove all of the thyroid"],
  "children": [
      {
        "name": "Certain about Having Cancer",
        "description": "Making Sure I Know if I Have Cancer",
        "alt_scores": [0, 0.8, 1.0]
      },
      {
        "name" : "Surgical Concerns",
        "description" : "Concerns About Having Surgery",
        "children" : [
          {
            "name": "No scar",
            "description" : "Not having a scar",
            "alt_scores" : [1.0, 0.2, 0.1]
          },
          {
            "name": "Medication forever",
            "description" : "The possible need to take medication forever",
            "alt_scores" : [1.0, 0.3, 0.1]
          },
          {
            "name": "Avoid surgery",
            "description" : "Not having surgery if I don't have to",
            "alt_scores" : [1.0, 0.2, 0.1]
          },
          {
            "name": "Risk to voice",
            "description" : "Avoiding risks to my voice at all costs",
            "alt_scores" : [1.0, 0.9, 0.5]
          },
        ]
      }
  ],

  "pairwise": [
    [1, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0 ,0],
    [0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0 ,0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 1]
  ]

}

AHP_MODEL = AHPTreeNode.fromJSONObject(AHP_MODEL_JSON)

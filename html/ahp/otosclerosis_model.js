
AHP_MODEL_JSON = {
    "name" : "Otosclerosis Model",
    "description" : "The Otosclerosis Model",
    "alt_names" : ['Watchful Waiting', 'Surgery', 'Hearing Aids'],
    "alt_descriptions" : [
      'Remain vigilant',
      'Removing the 4 bones of the ear and inserting a prosthesis (refashioning the small bones of the ear to improve hearing)',
      'Increasing the sound picked up by the ear to compensate for the difficulty in hearing.'
    ],
    "pairwise" : [
      [1, 4, 4],
      [0, 1, 2],
      [0, 0, 1]
    ],
    "children": [
        {
          "name": "Hearing",
          "description" : "Ability to hear sounds which may range from loud to quiet speech",
          "alt_scores": [0, 1.0, 0.5]
        },
        {
          "name": "Side-effects",
          "description" : "Side effects only",
          "pairwise" :[
            [1, 2, 2],
            [0, 1, 2],
            [0, 0, 1]
          ],
          "children":[
            {
              "name" : "Ability to maintain balance",
              "description" : "Surgery may affect some nerves which impacts your ability to maintain their balance. This may afect your ability to walk or contribute to dizziness",
              "alt_scores": [1.0, 0.2, 1.0]
            },
            {
              "name" : "Discomfort",
              "description" : "Discomfort in the ears occasionally and are associated with an increased risk of ear infection",
              "alt_scores" : [1.0, 0.2, 0.2]
            },
            {
              "name" : "Ability to taste",
              "description" : "Surgery may affect some nerves which impact on your ability to taste food",
              "alt_scores" : [1.0, 0.2, 1.0]
            }
          ]
        },
        {
          "name": "Temporary/Cosmetic effects",
          "description" : "Effects that are only temporary, or cosmetic.",
          "pairwise":
          [
            [1, 4, 4],
            [0, 1, 2],
            [0, 0, 1]
          ],
          "children" : [
            {
              "name":"Perecption & Self-esteem",
              "description" : "Hearing aids can occasionally make patients feel more self conscious or less able than patients with non-visble probl",
              "alt_scores": [1, 1, 0.2]
            },
            {
              "name": "Time off the work",
              "description" : "Surgery will require you to take some time off work to recover",
              "alt_scores" : [1.0, 0.2, 1.0]
            },
            {
              "name": "Ability to drive",
              "description": "Following surgery, you may need to contact the DVLA to determine whether you are still able to drive for some time",
              "alt_scores":[1, 0.2, 1.0]
            }
          ]
        }
    ],

    "pairwise": [
        [1, 2, 6, 24],
        [0, 1, 3, 12],
        [0, 0, 1, 4],
        [0, 0, 0, 1]
    ]
}

AHP_MODEL = AHPTreeNode.fromJSONObject(AHP_MODEL_JSON)

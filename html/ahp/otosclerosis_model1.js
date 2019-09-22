

AHP_MODEL = new AHPTreeNode(null, 0, "Otosclerosis Model", "The Otosclerosis Model")
let alts = [
  ['Watchful Waiting', 'Remain vigilant'],
  ['Surgery', 'Removing the 4 bones of the ear and inserting a prosthesis (refashioning the small bones of the ear to improve hearing)'],
  ['Hearing Aids', 'Increasing the sound picked up by the ear to compensate for the difficulty in hearing.']
]

let crits = [
  ["Hearing", "Ability to hear sounds which may range from loud to quiet speech", [0, 1.0, 0.5]],
  ["Side-effects", "Side effects only",
    [
      ["Discomfort", "Discomfort in the ears occasionally and are associated with an increased risk of ear infection", [1.0, 0.2, 0.2]],
      ["Ability to taste", "Surgery may affect some nerves which impact on your ability to taste food", [1.0, 0.2, 1.0]],
      ["Ability to maintain balance", "Surgery may affect some nerves which impacts your ability to maintain their balance. This may afect your ability to walk or contribute to dizziness", [1.0, 0.2, 1.0]]
    ]
  ],
  ["Temporary/Cosmetic effects", "",
  [
    ["Time off the work", "Surgery will require you to take some time off work to recover", [1.0, 0.2, 1.0]],
    ["Ability to drive", "Following surgery, you may need to contact the DVLA to determine whether you are still able to drive for some time", [1, 0.2, 1.0]],
    ["Perecption & Self-esteem", "Hearing aids can occasionally make patients feel more self conscious or less able than patients with non-visble probl", [1, 1, 0.2]]
  ]]
]

//Create the alternatives
for(var i=0; i < alts.length; i++) {
  let alt_name = alts[i][0]
  let alt_description = alts[i][1]
  AHP_MODEL.addAlt(alt_name, alt_description)
}

//Create the criteria
for(var i=0; i < crits.length; i++) {
  let crit_name = crits[i][0]
  let crit_description = crits[i][1]
  let child = AHP_MODEL.addChildName(crit_name, crit_description)
  child.direct_data = crits[i][2]
}

AHP_MEDIUM_VOTE = 3
AHP_BIG_VOTE = 9
let m = AHP_MEDIUM_VOTE
let b = AHP_BIG_VOTE
let e = 1
let pwArray = [
  [1, b, b, b, b, b, b],
  [0, 1, m, m, m, m, m],
  [0, 0, 1, e, e, e, e],
  [0, 0, 0, 1, e, e, e],
  [0, 0, 0, 0, 1, e, e],
  [0, 0, 0, 0, 0 ,1, e],
  [0, 0, 0, 0, 0, 0, 1]
]

AHP_MODEL.pairwiseAll(pwArray)

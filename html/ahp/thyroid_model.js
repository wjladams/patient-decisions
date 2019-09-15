

AHP_MODEL = new AHPTreeNode(null, 0, "Thyroid Root", "The Thyroid Model")
let alts = [['Watchful Waiting', 'Remain vigilant'],
  ['Remove 1/2 Thyroid', 'Better explanation'],
  ['Remove Thyroid', 'Remove all of the thyroid']]

let crits = [
  ["Certain about cancer", "Making sure I know if I have cancer", [0, 0.2, 1.0]],
  ["Doctor rec", "Whatever my doctor thinks I should do", [0.1, 0.5, 1.0]],
  ["No scar", "Not having a scar", [1.0, 0.2, 0.1]],
  ["Medication forever", "The possible need to take medication forever", [1.0, 0.5, 0.1]],
  ["Avoid surgery", "Not having surgery if I don't have to", [1.0, 0.0, 0.0]],
  ["Risk to voice", "Risk to my voice", [1.0, 0.0, 0.0]],
  ["Other health issues", "Concern related to other health problems", [1.0, 0.0, 0.0]]
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

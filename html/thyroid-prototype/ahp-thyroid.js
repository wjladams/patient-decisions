//A file for ahp settings for the Thyroid cancer setup.
function insertStringIntoClass(className, stringValue) {
  let elts = document.getElementsByClassName(className);
  //alert("You have "+elts.length+" elements for participantName");
  for (elt of elts) {
    elt.innerHTML = stringValue;
  }
}


ALTERNATIVES_TECHNICAL = [
  "Observation",
  "Hemi-Thyroidectomy",
  "Total Thyroidectomy"
]

ALTERNATIVES_LAYMAN = [
  "Watchful Waiting",
  "Remove half thyroid",
  "Remove thyroid"
]

ALTERNATIVES_DESCRIPTIONS = [
  "Keep close tabs on the condition, prepared to make another judgment when the time comes.",
  "Removal of half the thyroid that contains the growth",
  "Removal of the entire thyroid."
]

ALTERNATIVES = ALTERNATIVES_LAYMAN;

function getAlternativesListHTML() {
  let rval = "<ul>\n";
  for (let i=0; i < ALTERNATIVES.length; i++) {
    rval+='\t<li><span class="listdefinition">'+ALTERNATIVES[i]+":</span>"+" "+ALTERNATIVES_DESCRIPTIONS[i]
    rval+="\n"
  }

  rval += "</ul>";
  return rval;
}

function insertAHPInfoIntoHTML() {
  let altsList = getAlternativesListHTML();
  insertStringIntoClass("ahpAlternativeDescriptions", altsList);
}

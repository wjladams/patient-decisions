# AHP Javascript library
This is a browser based AHP javascript library, for general AHP usage.

## Files
* `ahp.js`: The AHP calculation library
* `myexpect.js`: A simple browser based library for doing unit tests.
* `thyroid_model.js`: Defines a global variable `AHP_MODEL` with the data needed for analyzing **thyroid cancer information**.

## Usage
```javascript
<html>
<head>
  ...
  <script src="../ahp.js"></script>
  ...
</head>
<body>
  <script>
    //Creates a new root node (parent = null) with no alts
    let ahp = new AHPTreeNode();
    ahp.addChildName("crit1", "the first criterion")
    ahp.addChildName("crit2", "second crit")
    ahp.addAlt("alt1", "the first alternative")
    ahp.addAlt("alt2", "the second alt")
    //Pairwise compares alt1 to alt2, saying it is 2 times better
    ahp.pairwise(0, 1, 3)
    //Get an array of children node names
    let kidNamesArray = ahp.childernNames()
    //Get an array of children node descriptions
    let kidDescrArray = ahp.childernDescriptions()
    //The alternatives are stored in the alts class variable
    let altNamesArray = ahp.alts
    //The alternative descriptions are stored:
    let altDescrsArray = ahp.alt_descriptions


    ...
  </script>
</body>

```

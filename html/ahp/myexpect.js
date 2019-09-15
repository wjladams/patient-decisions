function appendResult(result) {
  $( "#results" ).append(result)
  $( "#results" ).append("\n")
}
function test(description, fx) {
  try {
    fx()
    appendResult("Passed: "+description);
  } catch (error) {
    appendResult("Failed:" + description+": with error : "+error)
  }
}

class Expect {
  constructor(trueVal) {
    this.trueValue = trueVal
  }
  toBe(x) {
    if (x != this.trueValue) {
      throw this.trueValue+" was not "+x
    }
  }
  toEqual(x) {
    if (JSON.stringify(this.trueValue) === JSON.stringify(x)) {

    } else {
      throw this.trueValue+" was not equal to "+x
    }
  }
  toBeLessThan(x) {
    if (this.trueValue < x) {

    } else {
      throw this.trueValue+" was not less than "+x
    }
  }
  toBeCloseTo(x, delta=7) {
    let diff = Math.abs(x - this.trueValue)
    let err = Math.pow(10, -delta)
    if (diff < err) {

    } else {
      throw this.trueValue+" was not close enough to "+x+ " with err="+err+" and delta="+delta
    }
  }
  toBeNull() {
    this.toBe(null)
  }
  toThrow() {
    try {
      this.trueValue()
      throw "function was expected to throw an error and did not"
    } catch (error) {
      //We expected this, it should happen
    }
  }
  toBeDefined() {
    if (this.trueValue == null) {
      throw "The value was not defined"
    }
  }
}
function expect(trueVal) {
  return new Expect(trueVal)
}

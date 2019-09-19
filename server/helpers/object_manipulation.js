function isInArray(value, array) {
  return array.indexOf(value) > -1;
}

/**
 * 
 * @param {Array} ArraySrc
 * @param {Object} ObjectSrc
 * 
 * Goal: Generate a new object from ObjectSrc with onlythe keys
 * That are in ArraySrc
 */

function objectInnerMerge (ObjectSrc, ArraySrc) {
  ObjectDst = {}

  Object.entries(ObjectSrc).forEach(([key, val]) => {
    if (isInArray(key, ArraySrc)) {
      ObjectDst[key] = val
    }
  })
  return ObjectDst
}

//objectInnerMerge({"firstname": 5}, ["fir"])


module.exports = {
  objectInnerMerge,
  isInArray
}

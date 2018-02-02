(function(){

  var map = L.map('map', {
    center: [39.9522, -75.1639],
    zoom: 14
  });
  var Stamen_TonerLite = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 20,
    ext: 'png'
  }).addTo(map);

  /* =====================

  # Lab 2, Part 4 — (Optional, stretch goal)

  ## Introduction

    You've already seen this file organized and refactored. In this lab, you will
    try to refactor this code to be cleaner and clearer - you should use the
    utilities and functions provided by underscore.js. Eliminate loops where possible.

  ===================== */

  // Mock user input
  // Filter out according to these zip codes:
  var acceptedZipcodes = [19106, 19107, 19124, 19111, 19118];
  // Filter according to enrollment that is greater than this variable:
  var minEnrollment = 300;


  // clean data
  // My new codes
_.each(schools, function(obj) {
    if (_.isString(obj.ZIPCODE)){
      var split;
      var normalized_zip;
      split = obj.ZIPCODE.split(' ');
      normalized_zip = parseInt(split[0]);
      obj.ZIPCODE = normalized_zip;
    }

    if (_.isNumber(obj.GRADE_ORG)) {
      obj.HAS_KINDERGARTEN = obj.GRADE_LEVEL < 1;
      obj.HAS_ELEMENTARY = 1 < obj.GRADE_LEVEL < 6;
      obj.HAS_MIDDLE_SCHOOL = 5 < obj.GRADE_LEVEL < 9;
      obj.HAS_HIGH_SCHOOL = 8 < obj.GRADE_LEVEL < 13;
    } else {
      obj.HAS_KINDERGARTEN = obj.GRADE_LEVEL.toUpperCase().indexOf('K') >= 0;
      obj.HAS_ELEMENTARY = obj.GRADE_LEVEL.toUpperCase().indexOf('ELEM') >= 0;
      obj.HAS_MIDDLE_SCHOOL = obj.GRADE_LEVEL.toUpperCase().indexOf('MID') >= 0;
      obj.HAS_HIGH_SCHOOL = obj.GRADE_LEVEL.toUpperCase().indexOf('HIGH') >= 0;
    }
    return obj;
  })


  // filter data
  var filtered_data = [];
  var filtered_out = [];

// My new codes
_.each(schools, function(obj) {
  isOpen = obj.ACTIVE.toUpperCase() == 'OPEN';
  isPublic = (obj.TYPE.toUpperCase() !== 'CHARTER' ||
              obj.TYPE.toUpperCase() !== 'PRIVATE');
  isSchool = (obj.HAS_KINDERGARTEN ||
              obj.HAS_ELEMENTARY ||
              obj.HAS_MIDDLE_SCHOOL ||
              obj.HAS_HIGH_SCHOOL);
  meetsMinimumEnrollment = obj.ENROLLMENT > minEnrollment;
  meetsZipCondition = acceptedZipcodes.indexOf(obj.ZIPCODE) >= 0;
  filter_condition = (isOpen &&
                      isSchool &&
                      meetsMinimumEnrollment &&
                      !meetsZipCondition);

  if (filter_condition) {
    filtered_data.push(obj);
  } else {
    filtered_out.push(obj);
  }
})

console.log('Included:', filtered_data.length);
console.log('Excluded:', filtered_out.length);


  // main loop
  var color;

  // My new codes
_.each(filtered_data, function(obj) {
  isOpen = obj.ACTIVE.toUpperCase() == 'OPEN';
  isPublic = obj.TYPE.toUpperCase() !== 'CHARTER' || obj.TYPE.toUpperCase() !== 'PRIVATE';
  meetsMinimumEnrollment = obj.ENROLLMENT > minEnrollment;

  if (obj.HAS_HIGH_SCHOOL){
    color = '#0000FF';
  } else if (obj.HAS_MIDDLE_SCHOOL) {
    color = '#00FF00';
  } else {
    color = '##FF0000';
  }
  // The style options
  var pathOpts = {'radius': obj.ENROLLMENT / 30,
                  'fillColor': color};
  return L.circleMarker([obj.Y, obj.X], pathOpts).bindPopup(obj.FACILNAME_LABEL).addTo(map);
})


})();

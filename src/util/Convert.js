//
// UNIT CONVERSION FUNCTIONS FOR USE BY MODELER
//

const pi = 3.1415926535;

const convert = {

  latToFt: function (lat) {
    let km = this.degToKm(lat);
    return this.kmToFt(km);
  },

  lonToFt: function (lon, lat) {
    let rad = this.degToRad(lat);
    let mod = Math.cos(rad);
    let mi = this.degToMi(lon);
    return this.miToFt(mod*mi);
  },

  sfToHect: function (sf) { return sf/107639; },
  hectToSf: function (hect) { return hect*107639; },

  kmToFt: function (km) { return km*3280.84; },
  ftToKm: function (ft) { return ft/3280.84; },

  degToKm: function (lat) { return lat*111.321; },
  degToRad: function (lat) { return lat*pi/180; },
  degToMi: function (lat) { return lat*69.172; },
  
  miToFt: function (mi) { return mi*5280; },
  miToKm: function (mi) { return mi*1.60934; },
  mToFt: function (m) { return m*3.28084; },

}

export default convert;
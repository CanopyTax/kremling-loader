/**
 * Kremling Id
 * instantiated function for getting the id and selector name
 */
function KremId() {
  this.id = 0;
  this.increment = function() {
      this.id = this.id + 1;
  };
}

module.exports = new KremId();
var Service, Characteristic;
var exec = require("child_process").exec;

const DEF_MIN_LUX = 0,
      DEF_MAX_LUX = 10000,
      
var temperatureService;
var command;
var temperature = 0;

module.exports = function (homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerAccessory("homebridge-symo-cmd", "SymoCMD", SymoCMD);
}

function SymoCMD(log, config) {
    this.log = log;

    // url info
    this.name = config["name"];
    this.manufacturer = config["manufacturer"] || "@magnerholt";
    this.model = config["model"] || "Fronius Symo";
    this.serial = config["serial"] || "1228";
    this.command = config["command"];
    this.minLux = config["min_lux"] || DEF_MIN_LUX;
    this.maxLux = config["max_lux"] || DEF_MAX_LUX;
}

SymoCMD.prototype = {
    cmdRequest: function(cmd, callback) {
        exec(cmd,function(error, stdout, stderr) {
            callback(error, stdout, stderr)
        })
    },

    getState: function (callback) {
        var cmd = this.command;
        this.cmdRequest(cmd, function(error, stdout, stderr) {
            if (error) {
                this.log('command function failed: %s', stderr);
                callback(error);
            } else {
                this.log('command function succeeded!');
                var res =  Math.round(stdout * 100) /100;
                this.log(res);
                callback(null, res);
            }
        }.bind(this));
    },

    identify: function(callback) {
        this.log("Identify requested!");
        callback(); // success
    },

getServices: function () {
      this.informationService = new Service.AccessoryInformation();
      this.informationService
      .setCharacteristic(Characteristic.Manufacturer, this.manufacturer)
      .setCharacteristic(Characteristic.Model, this.model)
      .setCharacteristic(Characteristic.SerialNumber, this.serial);

      this.lightLevelService = new Service.LightSensor(this.name);
      this.lightLevelService
         .getCharacteristic(Characteristic.CurrentAmbientLightLevel)
         .on('get', this.getState.bind(this))
         .setProps({
             minValue: this.minLux,
             maxValue: this.maxLux
         });
      return [this.informationService, this.lightLevelService];
   }
};

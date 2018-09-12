# homebridge-symo-cmd
homebridge-plugin for Your PC Command with Apple-Homekit.(by node.js child_process.exec())

Inspired by homebridge-temperature-cmd

# Installation

1. Install homebridge using: sudo npm install -g homebridge
2. Install this plugin using: sudo npm install -g homebridge-symo-cmd
3. Update your configuration file. See sample-config.json in this repository for a sample.

# Configuration
Configuration sample:

```
"accessories": [
    {
        "accessory": "SymoCMD",
        "name": "Current kWh",
        "command": "curl -sb -H http://localhost/watt.php"
    }
]


Also! Needs php and/or other script that works as bridge from the Fronius inverter. I used som dirty-simple PHP;

<?php
$inverterDataURL = "http://192.168.x.x/solar_api/v1/GetPowerFlowRealtimeData.fcgi";
$inverterJSON = file_get_contents($inverterDataURL);
$inverterData = json_decode($inverterJSON, true);
$total = $inverterData["Body"]["Data"]["Site"]["E_Total"]/1000;
$current = $inverterData["Body"]["Data"]["Site"]["P_PV"]/1000;
$day = $inverterData["Body"]["Data"]["Site"]["E_Day"];
echo '' . print_r($current, true) . '';
?>

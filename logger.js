let appconfig  = require('./appconfig.js');

// Centralized control for silence
let silenced = appconfig.silence;
let log = function(input) {
    if(!silenced){
        console.log(input);
    }
}

module.exports =  {
    log : log
};

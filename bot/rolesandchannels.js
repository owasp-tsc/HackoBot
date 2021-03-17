const { prefix } = require("./config");


function makeChannel(message){
    var server = message.guild;
    var name = message.author.username;

    server.createChannel(name, "");
}

module.exports = {
    
}
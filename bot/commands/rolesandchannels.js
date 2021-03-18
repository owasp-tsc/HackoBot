const { prefix } = require("../config");

module.exports = {
    name : 'register',
    discription : 'Lets you register for discord!',
    usage : `${process.env.prefix}register`,
    aliases:["reg"],
    execute(message,args) {
      if(!args.length){
        return message.reply("You can't keep the team name blank!");
        
    }

        const team = args.join(" ");  
        var ID;   
       try{
            message.guild.channels.create(team, {
              name: team,
              type: 'category',
            }) .then((channel) =>{
                ID = channel.id;
          })
           
          console.log( `${team}`);
            // creating text channel

            message.guild.channels.create(team, {
              name: team,
              type: 'text', 
              permissionsOverwrites: [{
                id: message.guild.id,
                deny: ['MANAGE_MESSAGES'],
                allow: ['SEND_MESSAGES'],
              }]
            }).then((channel) => {
                channel.setParent(ID);
            })
        
            // creating voice channel
            message.guild.channels.create(team, {
              name: team,
              type: 'voice', 
              permissionsOverwrites: [{
                id: message.guild.id,
              }]
            })
            .then((channel) => {
                channel.setParent(ID);
            })
          

       } catch(error)
        {
            console.error(error);
            message.reply("Error: Invalid command or Team can't be created!");
        };
   
}
}

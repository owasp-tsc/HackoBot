module.exports = {
  name: "ping",
  description: "Ping!",
  execute(message, args) {
    const msg= {
      color: 0x0099ff,
      title : "Hello World",
      description : "Pong ."
    }
    message.channel.send({embed : msg});
  },
};

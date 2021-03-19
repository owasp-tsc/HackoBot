module.exports = (allowedChannel) => (message, args, next) => {
  if (message.channel.id !== allowedChannel.id)
    return message.channel.send(
      `This command is only allowed in ${allowedChannel.name}` //!
    );
  next();
};

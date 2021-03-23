module.exports = (allowedChannel, allowedChannelPrefix = "") => (
  message,
  args,
  next
) => {
  if (allowedChannelPrefix !== "") {
    const ch = message.channel.name?.includes(
      allowedChannelPrefix.toLowerCase()
    );

    if (ch) return next();
  }

  if (message.channel.id !== allowedChannel.id)
    return message.channel.send(
      `This command is only allowed in ${allowedChannel.name} or your private team channel ` //!
    );
  next();
};

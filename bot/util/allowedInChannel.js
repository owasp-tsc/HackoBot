module.exports = (allowedChannel, allowedChannelPrefix = "") => (
  message,
  args,
  next
) => {
  let msg = `This command is only allowed in ${allowedChannel.name}`; //!

  if (allowedChannelPrefix !== "") {
    const ch = message.channel.name?.includes(
      allowedChannelPrefix.toLowerCase()
    );
    msg += " or your private team channel ";
    if (ch) return next();
  }
  if (message.channel.id !== allowedChannel.id)
    return message.channel.send(msg);
  next();
};

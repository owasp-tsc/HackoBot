const {
  prefix,
  adminChannel,
  participantTeamNamePrefix,
} = require("../config");

const Faq = require("../../models/faq");

const { validateMongooseId } = require("../validators");

const {
  createMiddlewarePipeline,
  allowedInChannel,
  embeds,
} = require("../util");

function formatQuestionsList(questions) {
  return `
  Questions list =>

  Enter the command :
    ${prefix}question {the question number } 
  to get your answer
  If your answer is not in this you can ask your question with: 
    ${prefix}question {your question }
  and we will get back to youu asap
  
${questions.reduce((acc, q, i) => acc + `${i + 1}: ${q.question}?\n`, "")}
  `; //! edit and change
}

function getFormattedAdminMsg({ teamName, authorUsername, _id, question }) {
  return `New question from:
${teamName} : ${authorUsername}
Question id: ${_id}
Question:
${question}?`;
}

async function adminCommand(message, args) {
  let action = () => {};
  // console.log(args);
  switch (args[1]) {
    case "ansQ":
    case "answerQuestion": {
      action = addAnswer;
      break;
    }

    case "modQ":
    case "modifyQuestion": {
      action = modifyQuestion;
      break;
    }

    case "rmQ":
    case "removeQuestion": {
      action = removeQuestion;
      break;
    }

    case "getUQ":
    case "getUnansweredQuestions": {
      action = sendUnansweredQuestions;
      break;
    }
  }
  args.splice(1, 1);
  action(message, args);
}
async function removeQuestion(message, args) {
  if (!args[1])
    return message.channel.send({
      embed: embeds(null, `NO question id`),
    });
  const { value: questionId, error } = validateMongooseId(args[1]);
  if (error) return message.channel.send("Invalid mongoose id");

  const question = await Faq.findByIdAndDelete(questionId);
  if (!question)
    return message.channel.send({
      embed: embeds(null, `NO question found`),
    });
  return message.channel.send({
    embed: embeds(null, `Question : ${question._id} was deleted `),
  });
}
async function sendUnansweredQuestions(message, args) {
  // console.log(args);
  let limit = NaN;
  if (!isNaN(args[1])) limit = parseInt(args[1]);
  const questions = await Faq.find({ answer: { $eq: null } }).limit(limit);
  if (!questions.length)
    return message.channel.send({
      embed: embeds(null, `No more questions right now `),
    }); //! change msg
  // message.channel.send(
  console.log(questions);
  message.channel.send({
    embed: embeds(
      null,
      `Questions list =>\n${questions.reduce(
        (acc, q, i) => acc + `${i + 1}: ${q.question}?\nQuestionID: ${q._id}\n`,
        ""
      )}`
    ),
  });
  // );
}
async function modifyQuestion(message, args) {
  //!
}

async function addAnswer(message, args) {
  if (!args[1])
    return message.channel.send({
      embed: embeds(null, `NO question id`),
    });
  const { value: questionId, error } = validateMongooseId(args[1]);
  if (error) return message.channel.send("Invalid mongoose id");

  const question = await Faq.findById(questionId);
  if (!question)
    return message.channel.send({
      embed: embeds(null, `NO question found`),
    });
  if (question.answer !== null)
    return message.channel.send({
      embed: embeds(null, `Question already answered`),
    });

  if (!args[2])
    return message.channel.send({
      embed: embeds(null, `NO answer provided`),
    });

  const answer = args.splice(2).join(" ");
  question.answer = answer;
  await question.save();

  const teamChannel = message.guild.channels.cache.find(
    (ch) => ch.id === question.teamChannelId
  );
  teamChannel.send({
    embed: embeds(
      null,
      `Here is the answer to your question:\n${question.question}\n${question.answer}` //! change
    ),
  });
  return message.channel.send({ embed: embeds(null, `Answer added`) });
}
async function sendAnsweredQuestions(message) {
  const questions = await Faq.find({ answer: { $ne: null } }); //! fix index
  // console.log(questions);
  if (!questions.length)
    return message.channel.send({
      embed: embeds(null, `NO questions are added right now --help`),
    }); //! change msg
  message.channel.send(formatQuestionsList(questions)); //! change msg
}

async function sendAnswer(message, index) {
  const questions = await Faq.find({ answer: { $ne: null } });
  if (questions.length < index) return message.channel.send("Invalid index"); //! change msg
  return message.channel.send({
    embed: embeds(null, `${questions[index - 1].answer}`),
  }); //! change msg
}

async function newQuestion(message, question) {
  if (
    !message.channel.name.startsWith(participantTeamNamePrefix.toLowerCase())
  ) {
    return message.channel.send({
      embed: embeds(null, `You can only ask question in your private channels`),
    }); //! change msg
  }
  const teamRole = message.member.roles.cache.find((role) =>
    role.name.includes(participantTeamNamePrefix)
  );
  if (!teamRole) {
    return message.channel.send({ embed: embeds(null, `NO TEAM ROLE FOUND`) }); //! change msg
  }
  const { name: teamName } = teamRole;
  // console.log(message.channel.id);
  // teamChannelId =
  const newQuestion = new Faq({
    //! validate
    teamName,
    teamChannelId: message.channel.id,
    authorUsername: message.author.username,
    question,
  });
  let ac = message.client.channels.cache.get(adminChannel.id);
  if (!ac) {
    ac = message.client.channels.cache.find(
      (channel) => channel.name === adminChannel.name
    );
  }
  try {
    await newQuestion.save();
    ac.send(getFormattedAdminMsg(newQuestion));
    message.channel
      .send({ embed: embeds(null, `Question has been forwarded to us!!`) })
      .then((data) => {
        return data.react("👍");
      })
      .catch((err) => {
        console.log("Err", err.message);
        message.reply(`Reason : ${err.message}`);
      }); //! change msg
  } catch (err) {
    console.log("ERROR!! failed to add a question", err);
    message.channel.send(
      `Something went wrong\nPlease try again after a few minutes`
    );
    ac.send(`ERROR!! failed to add a question ${JSON.stringify(err)}`);
  }
}

module.exports = {
  name: "question",
  description: "Faq!",
  aliases: ["ques"],
  async execute(message, args) {
    try {
      if (!args.length) {
        return sendAnsweredQuestions(message);
      } else if (args[0] === "admin") {
        return createMiddlewarePipeline(
          allowedInChannel(adminChannel),
          adminCommand
        )(message, args);
      } else if (isNaN(args[0])) {
        const question = args.join(" ");
        return newQuestion(message, question);
      } else {
        return sendAnswer(message, args[0]);
      }
    } catch (err) {
      console.log(err);
    }
  },
};

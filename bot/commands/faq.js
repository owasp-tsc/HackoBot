const { prefix, faqConfig, participantTeamNamePrefix } = require("../config");

const Faq = require("../../models/faq");

function getFormattedAdminMsg({ teamName, authorUsername, _id, question }) {
  return `New question from:
${teamName} : ${authorUsername}
Question id: ${_id}
Question:
${question}?`;
}

module.exports = {
  name: "question",
  description: "Faq!",
  async execute(message, args, client) {
    try {
      if (!args.length) {
        return sendQuestions(message);
      } else if (args[0] === "addAns") {
        //! only for test
        //! make admin only
        if (!args[1]) return message.channel.send(`NO question id`);
        const question = await Faq.findById(args[1]);

        if (!question) return message.channel.send(`NO question found`);
        // console.log(question);

        if (question.answer !== null)
          return message.channel.send(`question already answered`);

        if (!args[2]) return message.channel.send(`NO ans provided`);

        const answer = args.splice(2).reduce((acc, w) => acc + " " + w, "");
        question.answer = answer;
        await question.save();

        //! send ans to that team channel
        //! allow reframing question
        return message.channel.send(`Ans added`);

        // return;
      } else if (isNaN(args[0])) {
        const question = args.reduce((acc, w) => acc + " " + w, "");
        return newQuestion(message, question, client);
      } else {
        return sendAnswer(message, args[0]);
      }
    } catch (err) {
      console.log(err);
    }
  },
};

//! admin:
// get all pending questions
// answer a question
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
async function sendQuestions(message) {
  const questions = await Faq.find({ answer: { $ne: null } }); //! fix index
  // console.log(questions);
  if (!questions.length)
    return message.channel.send(`NO questions are added right now --help`); //! change msg
  message.channel.send(formatQuestionsList(questions)); //! change msg
}

async function sendAnswer(message, index) {
  const questions = await Faq.find({ answer: { $ne: null } });
  if (questions.length < index) return message.channel.send("Invalid index"); //! change msg
  return message.channel.send(questions[index - 1].answer); //! change msg
}

async function newQuestion(message, question, client) {
  const teamRole = message.member.roles.cache.find((role) =>
    role.name.includes(participantTeamNamePrefix)
  );
  if (!teamRole) {
    return message.channel.send(`NO TEAM ROLE FOUND`); //! change msg
  }
  const { name: teamName } = teamRole;
  const newQuestion = new Faq({
    //! validate
    teamName,
    authorUsername: message.author.username,
    question,
  });
  let adminChannel = client.channels.cache.get(faqConfig.adminChannel.id);
  if (!adminChannel) {
    adminChannel = client.channels.cache.find(
      (channel) => channel.name === faqConfig.adminChannel.name
    );
  }
  try {
    await newQuestion.save();
    adminChannel.send(getFormattedAdminMsg(newQuestion));
    message.channel.send(`Question has been forwarded to us!!`); //! change msg
  } catch (err) {
    console.log("ERROR!! failed to add a question", err);
    message.channel.send(
      `Something went wrong\nPlease try again after a few minutes`
    );
    adminChannel.send(
      `ERROR!! failed to add a question ${JSON.stringify(err)}`
    );
  }
}

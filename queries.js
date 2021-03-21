const getQuestions = 'SELECT * ' +
  'FROM questions as q, choices as c ' +
  'WHERE q.question_id = c.question_id;';

  // {
  //  prompt: 'agre',
  //  choices: {
  //    2: { number: 2, correct: true, text: 'fsda' }
  // }

module.exports = {
  getQuestions,
}

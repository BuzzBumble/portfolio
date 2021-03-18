const getQuestions = 'SELECT * FROM questions ORDER BY question_id ASC';
function createQuestion(text) {
  return `INSERT INTO questions (text) VALUES (${text})`;
}

module.exports = {
  getQuestions,
  createQuestion
}

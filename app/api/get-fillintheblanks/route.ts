export async function POST(req: Request) {
  // Extract questions array from request body
  const { questions } = await req.json();

  // Randomly select one question to convert to fill-in-the-blank format
  const randomIndex = Math.floor(Math.random() * questions.length);
  const selectedQuestion = questions[randomIndex];

  const words = selectedQuestion.question.split(' ');
  const keyWordIndices: number[] = [];
  const keyWords: string[] = [];

  // Extract two meaningful words (>3 chars) from middle of sentence to use as blanks
  for (let i = 1; i < words.length - 1; i++) {
    const word = words[i];
    if (word.length > 3 && !keyWordIndices.includes(i)) {
      keyWordIndices.push(i);
      keyWords.push(word);
      if (keyWordIndices.length === 2) break;
    }
  }

  // Replace selected words with blanks in the question text
  const questionWithBlanks = words.map((word: string, i: number) => 
    keyWordIndices.includes(i) ? "___" : word
  ).join(' ');

  // Build options array containing correct answers + distractors from original question
  const options = [
    ...keyWords,
    ...selectedQuestion.options.filter((opt: string) => !keyWords.includes(opt))
  ].slice(0, 6);

  // Randomize order of answer options
  const shuffledOptions = options.sort(() => Math.random() - 0.5);

  // Construct and return the fill-in-the-blanks question object
  return Response.json({
    question: questionWithBlanks,
    answer: keyWords.join(' '),
    options: shuffledOptions
  });
}

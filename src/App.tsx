import { useState, useCallback, useEffect } from "react";
import {
  possibleAnswersForChordates,
  possibleAnswersForNonChordates,
  chordateData,
  nonChordateData,
} from "./data.ts";

interface QuestionDataFormat {
  [key: string]: {
    [key: string]: string;
  };
}

interface PossibleAnswersFormat {
  [key: string]: string[];
}

const typedChordateData: QuestionDataFormat = chordateData;
const typedNonChordateData: QuestionDataFormat = nonChordateData;
const typedChordateAnswers: PossibleAnswersFormat = possibleAnswersForChordates;
const typedNonChordateAnswers: PossibleAnswersFormat =
  possibleAnswersForNonChordates;

function App() {
  // useStates for settings
  const [practiceSet, setPracticeSet] = useState("");

  // useStates for logic
  const [quizLoop, setQuizLoop] = useState("menu");
  const [allQuestions, setAllQuestions] = useState<string[][]>([]);
  const [answer, setAnswer] = useState("");
  const [possibleAnswers, setPossibleAnswers] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState("");

  // useStates for scoring
  const [incorrectScore, setIncorrectScore] = useState(0);
  const [correctScore, setCorrectScore] = useState(0);

  // useStates for display
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [errorBox, setErrorBox] = useState("");

  // Function that handles choosing a practice set. Starts the quiz.
  const handleChoosingPracticeSet = useCallback(
    (set: string) => {
      setErrorBox("");
      setIncorrectScore(0);
      setCorrectScore(0);
      setQuizLoop("playing");
      setPracticeSet(set);
    },
    [setPracticeSet]
  );

  // Function to generate random numbers
  const generateRandomNumber = useCallback((max: number) => {
    return Math.floor(Math.random() * max);
  }, []);

  // Function that shuffles the questions created by generateAllQuestions
  const shuffleAllQuestions = useCallback(() => {
    let questions: string[][] = [];
    const data =
      practiceSet === "Non-Chordate" ? typedNonChordateData : typedChordateData;
    for (const type in data) {
      for (const property in data[type]) {
        questions.push([type, property, data[type][property]]);
      }
    }

    for (let index = questions.length - 1; index > 0; index--) {
      const shuffleIndex: number = generateRandomNumber(index + 1);
      [
        ([questions[index], questions[shuffleIndex]] = [
          questions[shuffleIndex],
          questions[index],
        ]),
      ];
    }
    setAllQuestions(questions);
  }, [practiceSet, generateRandomNumber, setAllQuestions]);

  // This function generates and sets the current question
  const generateCurrentQuestion = useCallback(() => {
    if (allQuestions.length > 0) {
      const [type, property, questionAnswer] = allQuestions[0];
      const data =
        practiceSet === "Non-Chordate"
          ? typedNonChordateAnswers
          : typedChordateAnswers;
      setCurrentQuestion(`${property} of ${type} is?`);
      setPossibleAnswers(data[property]);
      setAnswer(questionAnswer);
      setSelectedAnswer("");
      setAllQuestions((previousQuestions) => previousQuestions.slice(1));
    } else {
      setQuizLoop("results");
    }
  }, [setCurrentQuestion, allQuestions]);

  // Check the user's answer
  const checkAnswer = useCallback(() => {
    if (selectedAnswer !== "") {
      if (selectedAnswer === answer) {
        setCorrectScore((prevScore) => prevScore + 1);
        setErrorBox("Correct!");
      } else {
        setIncorrectScore((prevScore) => prevScore + 1);
        setErrorBox("Incorrect!");
      }
      generateCurrentQuestion();
    } else {
      setErrorBox("Select an answer!");
    }
  }, [generateCurrentQuestion, selectedAnswer, answer]);

  useEffect(() => {
    shuffleAllQuestions();
  }, [quizLoop]);

  useEffect(() => {
    if (quizLoop !== "menu" && quizLoop !== "results") {
      generateCurrentQuestion();
    }
  }, [quizLoop]);

  const handleAnswerChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAnswer(event.target.value);
  };

  return (
    <div className="max-w-xl px-4">
      {quizLoop === "menu" && (
        <>
          <div className="text-center">
            <p className="text-3xl">Non-Chordata/Chordata Quiz</p>
            <p className="text-gray-400 italic pb-6">Choose a practice set.</p>
          </div>
          <div className="flex justify-center">
            <button onClick={() => handleChoosingPracticeSet("Non-Chordate")}>
              Non-Chordate
            </button>
            <button onClick={() => handleChoosingPracticeSet("Chordate")}>
              Chordate
            </button>
          </div>
        </>
      )}
      {quizLoop === "playing" && (
        <>
          <p className="text-2xl text-center pb-6">{currentQuestion}</p>
          <div className="flex justify-center">
            <select
              value={selectedAnswer}
              onChange={handleAnswerChange}
              className="max-w-xs"
            >
              <option value="" disabled>
                Select an answer
              </option>
              {possibleAnswers &&
                possibleAnswers.map((value) => (
                  <option value={value}>{value}</option>
                ))}
            </select>
          </div>
          <div className="py-2 flex justify-center pb-6">
            <button onClick={() => setQuizLoop("menu")}>Go Back</button>
            <button onClick={checkAnswer}>Submit</button>
          </div>
          <p className="text-center">Questions left: {allQuestions.length}</p>
          <div>
            <p className="text-center">
              <span className="text-green-300">Correct: {correctScore}</span> /
              <span className="text-red-300"> Incorrect: {incorrectScore}</span>
            </p>
            {errorBox && <p className="text-center">{errorBox}</p>}
          </div>
        </>
      )}
      {quizLoop === "results" && (
        <>
          <p className="text-center pb-6">
            <span className="text-3xl">
              You scored{" "}
              {(correctScore / (correctScore + incorrectScore)) * 100}%
            </span>
            <br />
            <span className="text-gray-400 italic">
              That's {correctScore} out of {incorrectScore + correctScore}
            </span>
          </p>
          <div className="flex justify-center">
            <button onClick={() => setQuizLoop("menu")}>Go Back</button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;

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
  const [possibleAnswers, setPossibleAnswers] = useState<string[][]>([]);

  //useStates for display
  const [currentQuestion, setCurrentQuestion] = useState("");

  // Function that handles choosing a practice set. Starts the quiz.
  const handleChoosingPracticeSet = useCallback(
    (set: string) => {
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
    const [type, property, questionAnswer] = allQuestions[0];
    const data =
      practiceSet === "Non-Chordate"
        ? typedNonChordateAnswers
        : typedChordateAnswers;
    setCurrentQuestion(`${property} of ${type} is?`);
    setPossibleAnswers(data[property]);
    setAnswer(questionAnswer);
    setAllQuestions((previousQuestions) => previousQuestions.slice(1));
  }, [setCurrentQuestion, allQuestions]);

  useEffect(() => {
    shuffleAllQuestions();
  }, [quizLoop]);

  useEffect(() => {
    if (quizLoop !== "menu" && quizLoop !== "results") {
      generateCurrentQuestion();
    }
  }, [quizLoop]);

  return (
    <>
      {practiceSet === "" && (
        <>
          <h2>Non-Chordata/Chordata Quiz</h2>
          <h3>Choose a practice set.</h3>
          <button onClick={() => handleChoosingPracticeSet("Non-Chordate")}>
            Non-Chordate
          </button>
          <button onClick={() => handleChoosingPracticeSet("Chordate")}>
            Chordate
          </button>
        </>
      )}
      {practiceSet !== "" && (
        <>
          <p>{currentQuestion}</p>
          <select>
            {possibleAnswers &&
              possibleAnswers.map((value) => (
                <option value={value}>{value}</option>
              ))}
          </select>
        </>
      )}
    </>
  );
}

export default App;

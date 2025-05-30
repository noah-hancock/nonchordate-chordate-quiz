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

const typedChordateData: QuestionDataFormat = chordateData;
const typedNonChordateData: QuestionDataFormat = nonChordateData;

function App() {
  // useStates for settings
  const [practiceSet, setPracticeSet] = useState("");

  // useStates for logic
  const [allQuestions, setAllQuestions] = useState<string[][]>([]);

  //useStates for display
  const [currentQuestion, setCurrentQuestion] = useState("");

  // Function that handles choosing a practice set. Starts the quiz.
  const handleChoosingPracticeSet = useCallback(
    (set: string) => {
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
    // Check what practice set user chose
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
    const [type, property] = allQuestions[0];
    setCurrentQuestion(`${property} of ${type} is?`);
    setAllQuestions((previousQuestions) => previousQuestions.slice(1));
  }, [setCurrentQuestion, allQuestions]);

  // This logic might become useful in the future
  useEffect(() => {
    // When practice set changes, start the quiz
    if (practiceSet !== "") {
      shuffleAllQuestions();
      generateCurrentQuestion();
    }
  }, [practiceSet]);

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
      {practiceSet !== "" && <p>{currentQuestion}</p>}
    </>
  );
}

export default App;

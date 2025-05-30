import { useState, useCallback, useEffect } from "react";
import {
  possibleAnswersForChordates,
  possibleAnswersForNonChordates,
  possibleChordateTypes,
  possibleNonChordateTypes,
  chordateData,
  nonChordateData,
} from "./data.ts";

function App() {
  const [quizLoop, setQuizLoop] = useState(false);
  const [practiceSet, setPracticeSet] = useState("");

  // Function that handles choosing a practice set. Starts the quiz.
  const handleChoosingPracticeSet = useCallback(
    (set: string) => {
      setQuizLoop(true);
      setPracticeSet(set);
    },
    [setQuizLoop]
  );

  // This logic might become useful in the future
  // useEffect(() => {
  //   if (practiceSet !== "") {
  //     console.log(practiceSet);
  //   }
  // }, [practiceSet]);

  return (
    <>
      {!quizLoop && (
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
      {quizLoop && <p>True</p>}
    </>
  );
}

export default App;

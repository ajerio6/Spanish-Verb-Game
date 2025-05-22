// components/SpanishVerbGame.tsx
import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";

const verbs = [
  { verb: "hablar", type: "ar", conjugations: {
    Presente: ["hablo", "hablas", "habla", "hablamos", "habláis", "hablan"],
    Pretérito: ["hablé", "hablaste", "habló", "hablamos", "hablasteis", "hablaron"],
    Imperfecto: ["hablaba", "hablabas", "hablaba", "hablábamos", "hablabais", "hablaban"],
    Futuro: ["hablaré", "hablarás", "hablará", "hablaremos", "hablaréis", "hablarán"],
  }},
  { verb: "comer", type: "er", conjugations: {
    Presente: ["como", "comes", "come", "comemos", "coméis", "comen"],
    Pretérito: ["comí", "comiste", "comió", "comimos", "comisteis", "comieron"],
    Imperfecto: ["comía", "comías", "comía", "comíamos", "comíais", "comían"],
    Futuro: ["comeré", "comerás", "comerá", "comeremos", "comeréis", "comerán"],
  }},
  { verb: "vivir", type: "ir", conjugations: {
    Presente: ["vivo", "vives", "vive", "vivimos", "vivís", "viven"],
    Pretérito: ["viví", "viviste", "vivió", "vivimos", "vivisteis", "vivieron"],
    Imperfecto: ["vivía", "vivías", "vivía", "vivíamos", "vivíais", "vivían"],
    Futuro: ["viviré", "vivirás", "vivirá", "viviremos", "viviréis", "vivirán"],
  }},
];

const pronouns = ["yo","tú","él/ella/usted","nosotros/as","vosotros/as","ellos/ellas/ustedes"];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateKey(verb: string, tense: string, pronoun: string) {
  return `${verb}-${tense}-${pronoun}`;
}

function generateQuestion() {
  const verb = getRandomItem(verbs);
  const tense = getRandomItem(Object.keys(verb.conjugations));
  const pronoun = getRandomItem(pronouns);
  return { verb, tense, pronoun };
}

export default function SpanishVerbGame() {
  const [question, setQuestion] = useState(generateQuestion());
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [milestoneMessage, setMilestoneMessage] = useState("");
  const [isDark, setIsDark] = useState(false);
  const [progressMap, setProgressMap] = useState<Record<string, {correctCount:number;totalAttempts:number;mastered:boolean;}>>({});
  const [showReview, setShowReview] = useState(false);
  const [isSentenceMode, setIsSentenceMode] = useState(false);
  const [strikes, setStrikes] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("spanishVerbGameProgress");
    if (stored) setProgressMap(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("spanishVerbGameProgress", JSON.stringify(progressMap));
  }, [progressMap]);

  function getPronounIndex(pronoun: string) {
    return pronouns.indexOf(pronoun);
  }

  function checkAnswer() {
    // Sentence‐mode challenge
    if (isSentenceMode) {
      const expected = question.verb.conjugations[question.tense][getPronounIndex(question.pronoun)];
      if (userAnswer.toLowerCase().includes(expected.toLowerCase())) {
        setFeedback("🧠 ¡Perfecto! You've used the verb correctly in context.");
        setScore(s => s + 1);
      } else {
        setFeedback(`🧐 Try again. Make sure to include "${expected}".`);
      }
      setShowAnswer(true);
      return;
    }

    // Conjugation check
    const conjugations = question.verb.conjugations[question.tense];
    const idx = getPronounIndex(question.pronoun);
    const correctAnswer = conjugations[idx];
    const isCorrect = userAnswer.trim().toLowerCase() === correctAnswer.toLowerCase();
    const key = generateKey(question.verb.verb, question.tense, question.pronoun);
    const current = progressMap[key] || {correctCount:0,totalAttempts:0,mastered:false};

    if (isCorrect) {
      // Reset strikes, increment score & streak
      setStrikes(0);
      setScore(s => s + 1);
      setStreak(s => s + 1);
      setFeedback("✅ ¡Correcto!");

      // Confetti on every 5th
      if ((streak+1) % 5 === 0) {
        confetti({ particleCount:100, spread:70, origin:{y:0.6} });
        setMilestoneMessage(`🔥 You're on fire! Streak: ${streak+1}!`);
        setTimeout(()=>setMilestoneMessage(""),3000);
      }

      // Mastery tracking
      const newCorrectCount = current.correctCount + 1;
      const mastered = newCorrectCount >= 7;
      setProgressMap(pm => ({
        ...pm,
        [key]: {correctCount:newCorrectCount, totalAttempts:current.totalAttempts+1, mastered}
      }));

      if (mastered && !current.mastered) {
        setFeedback("🎉 Mastered! Now use it in a sentence:");
        setIsSentenceMode(true);
        setShowAnswer(false);
        return;
      }

      setShowAnswer(true);
    } else {
      // Wrong answer: strikes logic
      const nextStrike = strikes + 1;
      if (nextStrike >= 2) {
        setFeedback(`❌ Incorrecto. Correct answer: ${correctAnswer}`);
        setStrikes(0);
        setStreak(0);
        setProgressMap(pm => ({
          ...pm,
          [key]: {
            correctCount: current.correctCount,
            totalAttempts: current.totalAttempts+1,
            mastered:false
          }
        }));
        setShowAnswer(true);
      } else {
        setStrikes(nextStrike);
        setFeedback("⚠️ Strike 1! Try again.");
      }
    }
  }

  function nextQuestion() {
    setQuestion(generateQuestion());
    setUserAnswer("");
    setFeedback("");
    setShowAnswer(false);
    setIsSentenceMode(false);
    setStrikes(0);
  }

  return (
    <div className={`${isDark?"dark bg-black text-white":"bg-white text-black"} min-h-screen p-4`}>
      {milestoneMessage && (
        <div className="fixed top-12 left-1/2 transform -translate-x-1/2 bg-yellow-200 text-black font-bold px-4 py-2 rounded shadow-lg animate-bounce z-50">
          {milestoneMessage}
        </div>
      )}
      <div className="max-w-md mx-auto">
        <div className="bg-white dark:bg-gray-900 shadow rounded-lg overflow-hidden">
          <div className="p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">🎮 Spanish Verb Game</h2>
              <button onClick={()=>setIsDark(d=>!d)} className="px-2">
                {isDark?"🌞":"🌙"}
              </button>
            </div>
            <div className="flex justify-between text-sm">
              <span>🔥 Streak: {streak}</span>
              <span>🏆 Score: {score}</span>
              <span>⛔ Strikes: {strikes}/2</span>
            </div>
            <p><strong>Verb:</strong> {question.verb.verb}</p>
            <p><strong>Tense:</strong> {question.tense}</p>
            <p><strong>Pronoun:</strong> {question.pronoun}</p>
            <input
              type="text"
              value={userAnswer}
              onChange={e=>setUserAnswer(e.target.value)}
              placeholder={isSentenceMode?"Write a full sentence":"Your conjugation"}
              disabled={showAnswer}
              className="w-full border rounded px-2 py-1"
            />
            {!showAnswer ? (
              <button onClick={checkAnswer} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
                Submit
              </button>
            ) : (
              <button onClick={nextQuestion} className="mt-2 px-4 py-2 bg-gray-500 text-white rounded">
                Next
              </button>
            )}
            {feedback && <p className="mt-2 text-sm">{feedback}</p>}
            <button onClick={()=>setShowReview(r=>!r)} className="mt-2 text-sm underline">
              {showReview?"Hide":"Show"} Verb Review
            </button>
            {showReview && (
              <div className="max-h-60 overflow-auto mt-4 text-sm space-y-1">
                {Object.entries(progressMap).map(([key,val])=>{
                  const [v,t,p]=key.split("-");
                  return (
                    <p key={key}>
                      {val.mastered?"✅":val.correctCount>=3?"🔄":"❗"} {v} – {t} – {p} ({val.correctCount}/7)
                    </p>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

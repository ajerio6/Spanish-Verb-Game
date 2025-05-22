// SpanishVerbGame.tsx
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const verbs = [
  { verb: "hablar", type: "ar", conjugations: {
    "Presente": ["hablo", "hablas", "habla", "hablamos", "habláis", "hablan"],
    "Pretérito": ["hablé", "hablaste", "habló", "hablamos", "hablasteis", "hablaron"],
    "Imperfecto": ["hablaba", "hablabas", "hablaba", "hablábamos", "hablabais", "hablaban"],
    "Futuro": ["hablaré", "hablarás", "hablará", "hablaremos", "hablaréis", "hablarán"]
  }},
  { verb: "comer", type: "er", conjugations: {
    "Presente": ["como", "comes", "come", "comemos", "coméis", "comen"],
    "Pretérito": ["comí", "comiste", "comió", "comimos", "comisteis", "comieron"],
    "Imperfecto": ["comía", "comías", "comía", "comíamos", "comíais", "comían"],
    "Futuro": ["comeré", "comerás", "comerá", "comeremos", "comeréis", "comerán"]
  }},
  { verb: "vivir", type: "ir", conjugations: {
    "Presente": ["vivo", "vives", "vive", "vivimos", "vivís", "viven"],
    "Pretérito": ["viví", "viviste", "vivió", "vivimos", "vivisteis", "vivieron"],
    "Imperfecto": ["vivía", "vivías", "vivía", "vivíamos", "vivíais", "vivían"],
    "Futuro": ["viviré", "vivirás", "vivirá", "viviremos", "viviréis", "vivirán"]
  }}
];

const pronouns = [
  "yo", "tú", "él/ella/usted", "nosotros/as", "vosotros/as", "ellos/ellas/ustedes"
];

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateKey(verb, tense, pronoun) {
  return `${verb}-${tense}-${pronoun}`;
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
  const [progressMap, setProgressMap] = useState({});
  const [showReview, setShowReview] = useState(false);
  const [isSentenceMode, setIsSentenceMode] = useState(false);

  useEffect(() => {
    const storedProgress = localStorage.getItem("spanishVerbGameProgress");
    if (storedProgress) {
      setProgressMap(JSON.parse(storedProgress));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("spanishVerbGameProgress", JSON.stringify(progressMap));
  }, [progressMap]);

  function generateQuestion() {
    const verb = getRandomItem(verbs);
    const tense = getRandomItem(Object.keys(verb.conjugations));
    const pronoun = getRandomItem(pronouns);
    return { verb, tense, pronoun };
  }

  function getPronounIndex(pronoun) {
    return pronouns.indexOf(pronoun);
  }

  function checkAnswer() {
    if (isSentenceMode) {
      const expected = question.verb.conjugations[question.tense][getPronounIndex(question.pronoun)];
      if (userAnswer.toLowerCase().includes(expected.toLowerCase())) {
        setFeedback("🧠 ¡Perfecto! You've used the verb correctly in context.");
        setScore(prev => prev + 1);
      } else {
        setFeedback(`🧐 Try again. Make sure to include "${expected}" in your sentence.`);
      }
      setShowAnswer(true);
      return;
    }

    const correctAnswers = question.verb.conjugations[question.tense];
    const index = getPronounIndex(question.pronoun);
    const correctAnswer = correctAnswers[index];
    const isCorrect = userAnswer.trim().toLowerCase() === correctAnswer.toLowerCase();

    const key = generateKey(question.verb.verb, question.tense, question.pronoun);
    const current = progressMap[key] || { correctCount: 0, totalAttempts: 0, mastered: false };

    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setScore(prev => prev + 1);
      setFeedback("✅ ¡Correcto!");

      if (newStreak % 5 === 0) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        setMilestoneMessage(`🔥 You're on fire! Streak: ${newStreak}!`);
        setTimeout(() => setMilestoneMessage(""), 3000);
      }

      const newCorrectCount = current.correctCount + 1;
      const mastered = newCorrectCount >= 7;

      setProgressMap(prev => ({
        ...prev,
        [key]: {
          correctCount: newCorrectCount,
          totalAttempts: current.totalAttempts + 1,
          mastered
        }
      }));

      if (mastered && !current.mastered) {
        setFeedback("🎉 Mastered! Now use it in a sentence:");
        setIsSentenceMode(true);
        setShowAnswer(false);
        return;
      }
    } else {
      setFeedback(`❌ Incorrecto. Correct answer: ${correctAnswer}`);
      setStreak(0);

      setProgressMap(prev => ({
        ...prev,
        [key]: {
          correctCount: current.correctCount,
          totalAttempts: current.totalAttempts + 1,
          mastered: false
        }
      }));
    }

    setShowAnswer(true);
  }

  function nextQuestion() {
    setQuestion(generateQuestion());
    setUserAnswer("");
    setFeedback("");
    setShowAnswer(false);
    setIsSentenceMode(false);
  }

  return (
    <div className={`${isDark ? 'dark bg-black text-white' : 'bg-white text-black'} min-h-screen p-4`}>
      {milestoneMessage && (
        <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-yellow-200 text-black font-bold px-4 py-2 rounded shadow-lg z-50 animate-bounce">
          {milestoneMessage}
        </div>
      )}

      <div className="max-w-md mx-auto">
        <Card>
          <CardContent className="space-y-4 p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">🎮 Spanish Verb Game</h2>
              <Button onClick={() => setIsDark(!isDark)}>
                {isDark ? "🌞" : "🌙"}
              </Button>
            </div>

            <div className="flex justify-between">
              <span>🔥 Streak: {streak}</span>
              <span>🏆 Score: {score}</span>
            </div>

            <p><strong>Verb:</strong> {question.verb.verb}</p>
            <p><strong>Tense:</strong> {question.tense}</p>
            <p><strong>Pronoun:</strong> {question.pronoun}</p>

            <Input
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder={isSentenceMode ? "Write a full sentence using the verb" : "Your conjugation"}
              disabled={showAnswer}
            />

            {!showAnswer && <Button onClick={checkAnswer}>Submit</Button>}
            {feedback && <p className="text-sm text-muted-foreground">{feedback}</p>}
            {showAnswer && <Button variant="secondary" onClick={nextQuestion}>Next</Button>}
            <Button variant="ghost" onClick={() => setShowReview(!showReview)}>
              {showReview ? "Hide" : "Show"} Verb Review
            </Button>

            {showReview && (
              <div className="max-h-60 overflow-auto mt-4 text-sm space-y-1">
                {Object.entries(progressMap).map(([key, val]) => {
                  const [verb, tense, pronoun] = key.split("-");
                  return (
                    <p key={key}>
                      {val.mastered ? "✅" : val.correctCount >= 3 ? "🔄" : "❗"}{" "}
                      {verb} – {tense} – {pronoun} ({val.correctCount}/7)
                    </p>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

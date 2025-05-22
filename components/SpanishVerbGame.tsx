// components/SpanishVerbGame.tsx
import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";

const verbs = [ /* ... your verbs array ... */ ];
const pronouns = [ /* ... your pronouns array ... */ ];

// (Omit for brevity: generateQuestion, getRandomItem, generateKey functions)

export default function SpanishVerbGame() {
  // (all your useState hooks: question, userAnswer, feedback, etc.)

  // (your useEffect for localStorage, and checkAnswer / nextQuestion logic)

  return (
    <div className={`${isDark ? "dark bg-black text-white" : "bg-white text-black"} min-h-screen p-4`}>
      {milestoneMessage && (
        <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-yellow-200 text-black font-bold px-4 py-2 rounded shadow-lg animate-bounce z-50">
          {milestoneMessage}
        </div>
      )}
      <div className="max-w-md mx-auto">
        <div className="card shadow-md rounded-lg overflow-hidden">
          <div className="card-content p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">🎮 Spanish Verb Game</h2>
              <button onClick={() => setIsDark(!isDark)} className="px-2">
                {isDark ? "🌞 Light" : "🌙 Dark"}
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
              onChange={e => setUserAnswer(e.target.value)}
              placeholder={isSentenceMode ? "Write a full sentence" : "Your conjugation"}
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

            {feedback && <p className="text-sm text-muted-foreground">{feedback}</p>}

            <button onClick={() => setShowReview(!showReview)} className="mt-2 text-sm underline">
              {showReview ? "Hide" : "Show"} Verb Review
            </button>

            {showReview && (
              <div className="max-h-60 overflow-auto mt-4 text-sm space-y-1">
                {Object.entries(progressMap).map(([key, val]) => {
                  const [v, t, p] = key.split("-");
                  return (
                    <p key={key}>
                      {val.mastered ? "✅" : val.correctCount >= 3 ? "🔄" : "❗"}{" "}
                      {v} – {t} – {p} ({val.correctCount}/7)
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

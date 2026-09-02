import React, { useState, useEffect } from "react";
import styles from "./Hero.module.css";

const FILE_CONTENTS = {
  "App.jsx": `import React from "react";
import styles from "./App.module.css";

export default function App() {
  return (
    <main className={styles.container}>
      <h1 className={styles.title}> Behrad Hashemi </h1>
      <p> Modern React Architecture </p>
    </main>
  );
}`,
  "App.module.css": `.container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-editor);
  color: var(--text-color);
}

.title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--token-blue);
}`,
  terminal: `~ $ npm create vite@latest rjs-behrad -- --template react
~ $ cd rjs-behrad
~ $ npm install
~ $ npm run dev

  VITE v8.2.2 ready in 292 ms  ready in 240 ms
  ➜  Local:   http://localhost:5173/`,
};

function highlightSyntax(code, tab) {
  if (tab === "terminal") {
    return code.split("\n").map((line, lineIdx) => {
      let styledLine;
      if (line.trim().startsWith("~ $")) {
        const parts = line.split("~ $");
        styledLine = (
          <>
            <span className={styles.cmdPrompt}>~ $</span>
            <span className={styles.cmdText}>{parts[1]}</span>
          </>
        );
      } else if (line.includes("ready in") || line.includes("➜  Local:")) {
        styledLine = <span className={styles.cmdSuccess}>{line}</span>;
      } else {
        styledLine = <span className={styles.cmdDim}>{line}</span>;
      }
      return (
        <React.Fragment key={lineIdx}>
          {styledLine}
          {lineIdx < code.split("\n").length - 1 && "\n"}
        </React.Fragment>
      );
    });
  }

  // الگوی ریجکس اصلاح‌شده با پرانتز capture () برای حفظ دست‌نخورده فاصله‌ها و تورفتگی‌ها
  const tokenRegex =
    /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|<\/?[\w\.-]+|[{}();,:]|#[0-9a-fA-F]{3,6}|\b(?:import|from|export|default|function|return|const|let|var)\b|\b(?:className|min-height|display|align-items|justify-content|background|color|font-size|font-weight)\b|\.[a-zA-Z0-9_-]+)/g;

  return code.split("\n").map((line, lineIdx) => {
    // split با ریجکس کپچرشده باعث می‌شود فاصله‌ها پاک نشوند
    const tokens = line.split(tokenRegex);

    return (
      <React.Fragment key={lineIdx}>
        {tokens.map((token, tokIdx) => {
          if (!token) return null;

          let tokenClass = styles.textDefault;

          if (/^(".*"|'.*')$/.test(token)) {
            tokenClass = styles.tokenString;
          } else if (
            /^(import|from|export|default|function|return|const|let|var)$/.test(
              token,
            )
          ) {
            tokenClass = styles.tokenKeyword;
          } else if (/^<\/?[A-Z][A-Za-z0-9]*>?$/.test(token)) {
            tokenClass = styles.tokenComponent;
          } else if (/^<\/?[a-z0-9]+>?$/.test(token)) {
            tokenClass = styles.tokenTag;
          } else if (token.startsWith(".")) {
            tokenClass = styles.tokenClass;
          } else if (
            /^(className|min-height|display|align-items|justify-content|background|color|font-size|font-weight)$/.test(
              token,
            )
          ) {
            tokenClass = styles.tokenProperty;
          } else if (/^#[0-9a-fA-F]{3,6}$/.test(token)) {
            tokenClass = styles.tokenHex;
          }

          return (
            <span key={tokIdx} className={tokenClass}>
              {token}
            </span>
          );
        })}
        {lineIdx < code.split("\n").length - 1 && "\n"}
      </React.Fragment>
    );
  });
}

export default function HeroBanner() {
  const [activeTab, setActiveTab] = useState("App.jsx");
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText("");
    const fullText = FILE_CONTENTS[activeTab];
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 12);

    return () => clearInterval(interval);
  }, [activeTab]);

  return (
    <section
      className={styles.heroSection}
    >
      <div className={styles.content}>
        <div className={styles.badge}>Development Environment</div>
        <h1 className={styles.heading}>کدنویسی مدرن، سریع و منعطف</h1>
        <p className={styles.subheading}>
          ساختار تمیز، کامپوننت‌های بهینه‌سازی‌شده و توسعه سریع با تکنولوژی‌های
          روز.
        </p>
      </div>

      <div className={styles.windowContainer}>
        <div className={styles.titleBar}>
          <div className={styles.macButtons}>
            <span className={`${styles.dot} ${styles.red}`} />
            <span className={`${styles.dot} ${styles.yellow}`} />
            <span className={`${styles.dot} ${styles.green}`} />
          </div>

          <div className={styles.tabList}>
            {Object.keys(FILE_CONTENTS).map((tab) => (
              <button
                key={tab}
                className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "terminal" ? "bash — zsh" : tab}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.editorArea}>
          {activeTab !== "terminal" && (
            <div className={styles.lineNumbers}>
              {displayedText.split("\n").map((_, index) => (
                <span key={index}>{index + 1}</span>
              ))}
            </div>
          )}

          <pre className={styles.codeBlock}>
            <code>{highlightSyntax(displayedText, activeTab)}</code>
            <span className={styles.cursor} />
          </pre>
        </div>
      </div>
    </section>
  );
}

import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

const Typewriter = ({ text, delay }) => {
  const [currentText, setCurrentText] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const words = text.split(" "); // Divide el texto en palabras

  useEffect(() => {
    // Reiniciar la animación cuando el texto cambia
    setCurrentText("");
    setCurrentWordIndex(0);
  }, [text]); // Dependencia en el prop text

  useEffect(() => {
    if (currentWordIndex < words.length) {
      const timeout = setTimeout(() => {
        setCurrentText(
          (prevText) =>
            prevText + (prevText ? " " : "") + words[currentWordIndex]
        );
        setCurrentWordIndex((prevIndex) => prevIndex + 1);
      }, delay);

      return () => clearTimeout(timeout);
    }
  }, [currentWordIndex, delay, words]); // Dependencias en currentWordIndex, delay y words

  return (
    <ReactMarkdown
      components={{
        // Mapear `h1` a `h2` con estilos de Tailwind.
        h1: ({ node, ...rest }) => (
          <h2 className="text-2xl font-bold my-4" {...rest} />
        ),

        // Reescribir `em` para usar `i` con color rojo y cursiva de Tailwind.
        em: ({ node, ...rest }) => (
          <i className="text-red-600 italic" {...rest} />
        ),

        // Estilos para otros elementos si es necesario.
        // Por ejemplo, estilos para párrafos:
        p: ({ node, ...rest }) => <p className="my-2" {...rest} />,

        // Estilos para enlaces:
        a: ({ node, ...rest }) => (
          <a
            className="text-blue-600 underline hover:text-blue-800"
            {...rest}
          />
        ),

        // Estilos para listas:
        ul: ({ node, ...rest }) => (
          <ul className="list-disc list-inside pl-5" {...rest} />
        ),
        ol: ({ node, ...rest }) => (
          <ol className="list-decimal list-inside pl-5" {...rest} />
        ),
        li: ({ node, ...rest }) => <li className="mb-1" {...rest} />,

        // Estilos para bloques de código:
        code: ({ node, ...rest }) => (
          <code className="bg-gray-100 p-1 font-mono text-sm" {...rest} />
        ),
        pre: ({ node, ...rest }) => (
          <pre className="bg-gray-100 p-4 overflow-x-auto" {...rest} />
        ),

        // Estilos para citas en bloque:
        blockquote: ({ node, ...rest }) => (
          <blockquote
            className="border-l-4 border-gray-400 pl-4 italic"
            {...rest}
          />
        ),
      }}
    >
      {currentText}
    </ReactMarkdown>
  );
};

export default Typewriter;

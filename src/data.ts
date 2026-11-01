// Tu wpisujesz wszystkie kategorie i pytania.

// Jedno pytanie = tekst, obrazek albo oba naraz.
export type Question = {
  text?: string;
  image?: string;
  answerImage?: string; // obrazek odpowiedzi – po kliknięciu „Pokaż odpowiedź!”
};

export type Category = {
  id: string; // krótka nazwa: bez spacji i polskich znaków, każda inna
  name: string; // tak kategoria wyświetla się na stronie
  questions: Question[];
};

export const categories: Category[] = [
  {
    id: "1",
    name: "Category 1",
    questions: [
      { text: "x" },
      { text: "x" },
      { text: "x" },
      { text: "x" },
      // Z obrazkiem:          { image: "/img/Category 1/1.png" },
      // Z obrazkiem i tekstem:  { text: "x", image: "/img/Category 1/2.jpg" },
    ],
  },
  { id: "2", name: "Category 2", questions: [
    { text: "x" },
    { text: "x" },
    { text: "x" },
    { text: "x", image: "/img/dupcia-eli/celebryta.png", answerImage: "/img/dupcia-eli/celebryta-odp.jpg" },
    ] 
  },
  { id: "3", name: "Category 3", questions: [
    { text: "x" },
    { text: "x" },
    //{ text: "x" },
    { text: "x" },
    { text: "x" },
    ] 
  },
  { id: "4", name: "Category 4", questions: [
    { text: "x", image: "/img/stoklosa/1.jpg"  },
    { text: "x", image: "/img/stoklosa/2.jpg", answerImage: "/img/stoklosa/2-odp.jpg" },
    { text: "x" },
    //{ text: "x" },
    { text: "x" },
    //{ text: "x" },
    ] 
  },
  { id: "5", name: "Category 5", questions: [
    { text: "x"},
    { text: "x"},
    { text: "x" },
    { text: "x" },
    ] 
  },
  { id: "6", name: "Category 6", questions: [
    { text: "x", image: "/img/bestionariusz/1.png", answerImage: "/img/bestionariusz/1-odp.jpg" },    
    { text: "x", image: "/img/bestionariusz/2.png", answerImage: "/img/bestionariusz/2-odp.jpg" },
    { text: "x", image: "/img/bestionariusz/3.png", answerImage: "/img/bestionariusz/3-odp.jpg" },
    { text: "x", image: "/img/bestionariusz/4.png", answerImage: "/img/bestionariusz/4-odp.jpg" },
    { text: "x", image: "/img/bestionariusz/5.png", answerImage: "/img/bestionariusz/5-odp.jpg" },
    ] 
  },
  { id: "7", name: "Category 7", questions: [
  { text: "x? \na) x \nb) x \nc) x \nd) x", image: "/img/czarny-piotrus/1.jpg", answerImage: "/img/czarny-piotrus/1-odp.jpg"  },
  { text: "x? \na) x \nb) x \nc) x \nd) x", image: "/img/czarny-piotrus/2.jpg", answerImage: "/img/czarny-piotrus/2-odp.jpg"  },
  { text: "x? \na) x \nb) x \nc) x \nd) x", image: "/img/czarny-piotrus/3.jpg", answerImage: "/img/czarny-piotrus/3-odp.jpg"  },
  { text: "x? \na) x \nb) x \nc) x \nd) x", image: "/img/czarny-piotrus/4.jpg", answerImage: "/img/czarny-piotrus/4-odp.jpg"  },
  { text: "x? \na) x \nb) x \nc) x \nd) x", image: "/img/czarny-piotrus/5.png", answerImage: "/img/czarny-piotrus/5-odp.png"  },
  ] 
  },
];
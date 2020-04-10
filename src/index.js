import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, withRouter } from "react-router-dom";
import "./index.css";
import AuthorQuiz from "./AuthorQuiz";
import AddAuthorForm from "./AddAuthorForm";
import * as serviceWorker from "./serviceWorker";
import { shuffle, sample } from "underscore";
import * as Redux from "redux";
import * as ReactRedux from "react-redux";

const authors = [
  {
    name: "Mark Twain",
    imageUrl: "images/authors/marktwain.jpg",
    imageSource: "Wikimedia Commons",
    books: ["The Adventures of Huckleberry Finn"],
  },
  {
    name: "Charles Dickens",
    imageUrl: "images/authors/charlesdickens.jpg",
    imageSource: "Wikimedia Commons",
    books: ["A Tale of Two Cities", "David Copperfield"],
  },
  {
    name: "Joseph Conrad",
    imageUrl: "images/authors/josephconrad.PNG",
    imageSource: "Wikimedia Commons",
    books: ["Heart of Darkness"],
  },
  {
    name: "JK Rowling",
    imageUrl: "images/authors/jkrowling.jpg",
    imageSource: "Wikimedia Commons",
    imageAttribution: "Daniel Ogren",
    books: ["Harry Potter and the Sorcerers Stone"],
  },
  {
    name: "Stephen King",
    imageUrl: "images/authors/stephenking.jpg",
    imageSource: "Wikimedia Commons",
    imageAttribution: "Pinguino",
    books: ["The Shining", "IT"],
  },
  {
    name: "William Shakespeare",
    imageUrl: "images/authors/williamshakespeare.jpg",
    imageSource: "Wikimedia Commons",
    books: ["Hamlet", "Macbeth", "Romeo and Juliet"],
  },
];

function getTurnData(authors) {
  //Select a set of possible shufulled answers
  const allBooks = authors.reduce(function (p, c, i) {
    return p.concat(c.books);
  }, []);

  //Choose 4 random books after shuffulling
  const fourRandomBooks = shuffle(allBooks).slice(0, 4);
  //Pick a book that corresponds with the author shown
  const answer = sample(fourRandomBooks);

  return {
    books: fourRandomBooks,
    // Choosing an author that has written a book with the same name as the answer we choose
    author: authors.find((author) =>
      author.books.some((title) => title === answer)
    ),
  };
}

function reducer(
  state = { authors, turnData: getTurnData(authors), highlight: "" },
  action
) {
  switch (action.type) {
    case "ANSWER_SELECTED":
      const isCorrect = state.turnData.author.books.some(
        (book) => book === action.answer
      );
      return Object.assign({}, state, {
        highlight: isCorrect ? "correct" : "wrong",
      });
    case "CONTINUE":
      return Object.assign({}, state, {
        highlight: "",
        turnData: getTurnData(state.authors),
      });
    default:
      return state;
  }
}

let store = Redux.createStore(reducer);

function App() {
  return (
    <ReactRedux.Provider store={store}>
      <AuthorQuiz />
    </ReactRedux.Provider>
  );
}

const AuthorWrapper = withRouter(({ history }) => (
  <AddAuthorForm
    onAddAuthor={(author) => {
      authors.push(author);
      history.push("/");
    }}
  />
));

ReactDOM.render(
  <BrowserRouter>
    <React.Fragment>
      <Route exact path='/' component={App} />
      <Route path='/add' component={AuthorWrapper} />
    </React.Fragment>
  </BrowserRouter>,
  document.getElementById("root")
);

serviceWorker.unregister();

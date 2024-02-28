const {
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
} = require("graphql");
const { authors, books } = require("../db");
const { BookType, AuthorType } = require("../models/books");

let lastBookUsedId =
  books.length > 0 ? Math.max(...books.map((book) => book.id)) : 0;

const newBookId = () => {
  return ++lastBookUsedId;
};

//
let lastAuthorUsedId =
  authors.length > 0 ? Math.max(...authors.map((author) => author.id)) : 0;

const newAuthorId = () => {
  return ++lastAuthorUsedId;
};

//
const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    book: {
      type: BookType,
      description: "A single Book",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) => books.find((book) => book.id === args.id),
    },
    books: {
      type: new GraphQLList(BookType),
      description: "List of Books",
      resolve: () => books,
    },
    authors: {
      type: new GraphQLList(AuthorType),
      description: "List of all Authors",
      resolve: () => authors,
    },
    author: {
      type: AuthorType,
      description: "A single Authors",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (_, args) => authors.find((author) => author.id === args.id),
    },
  }),
});

const RootMutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "Root Mutation",
  fields: () => ({
    addBook: {
      type: BookType,
      description: "Add a Book",
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve: (_, args) => {
        const book = {
          id: newBookId(),
          name: args.name,
          authorId: args.authorId,
        };
        books.push(book);
        return book;
      },
    },
    addAuthor: {
      type: AuthorType,
      description: "Add an Author",
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: (_, args) => {
        const author = {
          id: newAuthorId(),
          name: args.name,
        };
        authors.push(author);
        return author;
      },
    },
    deleteBook: {
      type: BookType,
      description: "Delete a Book",
      args: {
        id: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve: (_, args) => {
        const index = books.findIndex((book) => book.id === args.id);
        if (index !== -1) {
          const deletedBook = books.splice(index, 1)[0];
          return deletedBook;
        } else {
          throw new Error("Book not found");
        }
      },
    },
    deleteAuthor: {
      type: AuthorType,
      description: "Delete an Author",
      args: {
        id: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve: (_, args) => {
        const index = authors.findIndex((author) => author.id === args.id);
        if (index !== -1) {
          const deletedAuthor = authors.splice(index, 1)[0];
          return deletedAuthor;
        } else {
          throw new Error("Author not found");
        }
      },
    },
  }),
});

//
const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
});

module.exports = schema;

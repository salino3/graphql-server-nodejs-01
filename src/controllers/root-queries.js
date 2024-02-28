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

//
const schema = new GraphQLSchema({
  query: RootQueryType,
});

module.exports = schema;

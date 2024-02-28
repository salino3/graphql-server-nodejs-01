// npm i express express-graphql graphql

const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./src/controllers/roots");

const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

app.listen(5000, () => {
  console.log("Server running on port ", 5000);
});

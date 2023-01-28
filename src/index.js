const { ApolloServer, gql } = require("apollo-server");
const axios = require("axios");


const typeDefs = gql`
  type Quote {
    quote: String
    author: String
  }

  type Query {
    Getquotes: [Quote],
    Getquote(author:String!):[Quote]
  }  

  type Mutation {
      CreateQuote(quote: String!, author: String!): Quote
      DeleteQuote(quote: String!): Quote
      UpdateQuote(quote: String!, author:String!): Quote
  }
`;

async function breaking(){
  try {
    const response = await axios.get(
      "https://api.breakingbadquotes.xyz/v1/quotes/10"
    );
    return response.data;
  } catch (error) {
    console.log(error.message);
  }
  
} 

let breakingquotes = breaking();

  const resolvers = {
    Mutation: {
        CreateQuote: (_,arg) => {breakingquotes.push(arg); return arg},
        DeleteQuote: (_,arg) => { 
                                 let finalbooks=breakingquotes.filter(book => book.quote != arg.quote);
                                 let bookdeleted = breakingquotes.find(book => book.quote == arg.quote );   
                                 breakingquotes = [...finalbooks]; 
                                 return bookdeleted
                                },
        UpdateQuote:(_,arg) => {  let objIdx = breakingquotes.findIndex(book => book.quote == arg.quote);

                                  breakingquotes[objIdx] = arg
                                  return arg   
              
                               },
        

    },  
    Query: {
      Getquotes: () => breakingquotes,
      Getquote: (_,arg) => breakingquotes.find(number => number.id==arg.id),
      
    },
  };

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
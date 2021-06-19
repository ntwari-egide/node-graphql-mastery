const express = require('express');
const expressGraphQl = require('express-graphql').graphqlHTTP
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull
} =  require('graphql')
const app = express()


const authors = [
    {id: 1,name: 'ntwari'},
    {id: 2,name: 'mugisha'},
    {id: 3,name: 'jules'}
]

const books = [
    {id: 1,name: 'java oop',authorId: 1},
    {id: 2,name: 'java classes',authorId: 2},
    {id: 3,name: 'java and Inheritance',authorId: 3},
    {id: 4,name: 'Java spring boot',authorId: 2}
]

// const schema  = new GraphQLSchema({
//     query: new GraphQLObjectType({
//         name: 'helloWorld',
//         fields: () => ({
//             message: {
//                 type: GraphQLString,
//                 resolve:() => 'hello world graphql'
//             }
//         })
//     })
// })

/**
 * Root query type
 */



 const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: 'this represents author of a book',
    fields: () => ({
        id: {type : GraphQLNonNull(GraphQLInt)},
        name: {type : GraphQLNonNull(GraphQLString)},
        books: {
            type: GraphQLList(AuthorType),
            resolve: (author) =>{
                return  books.filter(book => book.authorId === author.id)
            }
        }
    })
 })
const BookType = new GraphQLObjectType({
    name: 'Book',
    description: 'this represents a book',
    fields: () => ({
        id: {type : GraphQLNonNull(GraphQLInt)},
        name: {type : GraphQLNonNull(GraphQLString)},
        authorId: {type : GraphQLNonNull(GraphQLInt)},
        // Introducing joins in Graphql
        author: {
            type : AuthorType,
            resolve: (book) => {
                return authors.find(author => author.id === book.authorId)
            }
        }
    })
})

const RootQueryType = new GraphQLObjectType({
    name: 'RootQuery',
    description: 'root query type',
    fields: () => ({
        // finding single book by id
        book:{
            type: BookType,
            description: 'A single book',
            args: {
                id : {type: GraphQLInt}
            },
            resolve: (parent,args) => books.find(book => book.id === args.id)
        },
        author: {
            type: AuthorType,
            description: 'a single author',
            args: {
                id: {type: GraphQLInt}
            },
            resolve: (parent,args) => authors.find(author => author.id === args.id)
        },
        books: {
            type: new GraphQLList(BookType),
            description: 'List of all books',
            resolve: () => books
        },
        authors: {
            type: new GraphQLList(AuthorType),
            description: 'List of all authors',
            resolve: () => authors
        }
    })
})

const RootMutationQuery = new GraphQLObjectType({
    name: 'Root mutations',
    description: '',
    fields: () => ({
        addBook = {
            type: BookType,
            description: 'add book',
            args: {
                name: {type: GraphQLNonNull(GraphQLString)},
                authorId: {type: GraphQLNonNull(GraphQLInt)}
            },
            resolve: () => {
                const book = {id: books.length + 1, name: args.name, authorId: args.authorId}
                books.push(book)
    
                return book
            }
        
        }
    })
})


const schema = new GraphQLSchema({
    query: RootQueryType,
    mutations: RootMutationQuery
})

app.use('/graphql',expressGraphQl({
    schema: schema,
    graphiql: true
}))

app.listen(5000,()=>{
    console.log("Server running ....");
})
const express = require('express');
const expressGraphQl = require('express-graphql').graphqlHTTP
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString
} =  require('graphql')
const app = express()


const authors = [
    {id: 1,name: 'ntwari'},
    {id: 2,name: 'mugisha'},
    {id: 3,name: 'jules'}
]

const schema  = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'helloWorld',
        fields: () => ({
            message: {
                type: GraphQLString,
                resolve:() => 'hello world graphql'
            }
        })
    })
})

app.use('/graphql',expressGraphQl({
    schema: schema,
    graphiql: true
}))

app.listen(5000,()=>{
    console.log("Server running ....");
})
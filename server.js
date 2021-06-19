const express = require('express');
const expressGraphQl = require('express-graphql').graphqlHTTP
const app = express()

app.use('/graphql',expressGraphQl({}))
app.listen(5000,()=>{
    console.log("Server running ....");
})
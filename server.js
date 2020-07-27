'use strict'
require('dotenv').config()
const express=require('express')
const pg=require('pg')
const methodOverride=require('method-override')
const superagent=require('superagent')

const PORT=process.env.PORT||3000;
const client=new pg.Client(process.env.DATABASE_URL)
client.on('error',(err)=>console.log(err))
const app=express()

app.use(express.json())
app.use('/public',express.static('public'))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))


app.set('view engine','ejs')

//__________________________________________
app.get('/test',test)

function test(req,res){
    res.status(200).send('yessssssssssssssss')
}




















//__________________________________________
app.use('*',notFoundHandler)


function errorHandler(err,req,res){
    res.status(500).send(err)
}
function notFoundHandler(req,res){
    res.status(404).send('page NOT found 404')
}



client.connect().then(()=>{
    app.listen(PORT,()=>console.log('up and running on ',PORT))
}).catch(err=>{errorHandler(err,req,res)})
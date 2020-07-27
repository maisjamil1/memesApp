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
app.get('/',homeHandler)
app.post('/addTofav',addTofav)
app.get('/renderFAV',renderFAV)
app.get('/details/:id',showDEtails)
app.put('/update/:id',updateHandler)
app.delete('/delete/:id',deleteHandler)


function deleteHandler(req,res){
let SQL='DELETE FROM memestb WHERE id=$1;'
let VALUES=[req.params.id]
client.query(SQL,VALUES).then(results=>{
    res.redirect('/renderFAV')
})
}



function updateHandler(req,res){
    let{namee,urll,box_count}=req.body
    let SQL='UPDATE memestb SET namee=$1,urll=$2,box_count=$3 WHERE id=$4;'
    let VALUES=[namee,urll,box_count,req.params.id]
    client.query(SQL,VALUES).then(results=>{
        res.redirect('/renderFAV')
    })
}





function showDEtails(req,res){
    // console.log(req.params.id)
    let SQL='SELECT * FROM memestb WHERE id=$1;'
    let VALUES=[req.params.id]
    client.query(SQL,VALUES).then(results=>{
        res.render('pages/details.ejs',{val:results.rows[0]})
    })
}



function renderFAV(req,res){
    let SQL='SELECT * FROM memestb;'
    client.query(SQL).then(results=>{

        res.render('pages/fav.ejs',{data:results.rows})
    })
}

















//__________________________________________
function homeHandler(req,res){
    let url='https://api.imgflip.com/get_memes'
    superagent.get(url).then(results=>{
        // console.log(results.body.data.memes)
        let memesJSON=results.body.data.memes
        let memesARR=memesJSON.map(obj=>{
            return new memesCON(obj)
        })
        // console.log(memesARR)
        res.render('index.ejs',{data:memesARR})
    })
}





function memesCON(obj){
    this.namee=obj.name
    this.urll=obj.url
    this.box_count=obj.box_count
}
//__________________________________________

function addTofav(req,res){
    let{namee,urll,box_count}=req.body
    // console.log(namee,urll,box_count)
    let SQL ='INSERT INTO memestb(namee,urll,box_count)VALUES($1,$2,$3);'
    let VALUES=[namee,urll,box_count]
    client.query(SQL,VALUES).then(results=>{
        res.redirect('/renderFAV')
    })
}

















//__________________________________________
app.get('/test',test)

function test(req,res){
    res.status(200).send('yessssssssssssssss')
}

function notFoundHandler(req,res){
app.use('*',notFoundHandler)


function errorHandler(err,req,res){
    res.status(500).send(err)
}
    res.status(404).send('page NOT found 404')
}



client.connect().then(()=>{
    app.listen(PORT,()=>console.log('up and running on ',PORT))
}).catch(err=>{errorHandler(err,req,res)})
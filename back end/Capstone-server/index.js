const express = require('express')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')
const User = require('./models/user.model')
const jwt = require('jsonwebtoken')

app.use(cors())
app.use(express.json({
    limit: '50mb'
}))
app.use(express.urlencoded({limit: '50mb'}))

mongoose.connect('mongodb://localhost:27017/capstone-project')

app.post("/api/register", async (req,res)=>{
    console.log(req.body)
    try {
        const user = await User.create(req.body)
        res.json({status: 'ok'})
        
    } catch (error) {
        res.json({ status:'error', message: error})
    }   
})

app.post('/api/login', async (req, res) => {
    
    const user = await User.findOne({
        email: req.body.email,
    })
    if (!user) {
        return res.json({ status: 'error', error: 'Invalid login' })
    }
    const isPasswordValid = req.body.password===user.password

    if (isPasswordValid) {
        const token = jwt.sign(
            {
                name: user.name,
                email: user.email,
                username: user.username,
            },
            'secret123'
        )
        console.log(token)
        return res.json({ status: 'ok', user: token })
    } else {
        return res.json({ status: 'error', user: false })
    }
})

app.get('/api/profile_self', async (req,res)=> {
    const token = req.headers['x-access-token']
    try {
        const decoded = jwt.verify(token, 'secret123')
        const email = decoded.email
        const user = await User.findOne({email: email})
        

        return res.json({ status: 'ok', data: user})
    } catch (error) {
        console.log(error)
        return res.json({ status: 'error', error: 'invalid token'})
    }
})

app.post('/api/search', async (req,res)=> {
    try {
        const key = req.body.key
    const data = await User.find({ username: { $regex: key}}, 'username profile')
    return res.json({ status: 'ok', data: data})
    } catch (error) {
        console.log(error)
    }  
})
app.post('/api/sendRequest',async (req,res)=> {
    try {
        const key = req.body.key
        const token = req.headers['x-access-token']
        const decoded = jwt.verify(token, 'secret123')
        const username = decoded.username
        const d = await User.findOne({ username: username}, 'profile')
        console.log(req.body)
        const data = await User.findOneAndUpdate({username:key},{$push:{requests:{username:username,profile:d.profile}}})
        console.log(data);
        return res.json({status:"ok"})
    } catch (error) {
        console.log(error)
    }  
})

app.post('/api/bookmark',async (req,res)=> {
    try {
        const value = req.body.value
        const type = req.body.type
        const token = req.headers['x-access-token']
        const decoded = jwt.verify(token, 'secret123')
        const username = decoded.username
        console.log(req.body)
        const data = await User.findOneAndUpdate({username:username},{$push:{bookmarks:{type:type,value:value}}})
        console.log(data);
        return res.json({status:"ok"})
    } catch (error) {
        console.log(error)
    }  
})

app.post('/api/deleteRequest',async (req,res)=> {
    try {
        const key = req.body.key
        const token = req.headers['x-access-token']
        const decoded = jwt.verify(token, 'secret123')
        const username = decoded.username
        console.log(req.body)
        const data = await User.findOneAndUpdate({username:key},{$pull:{requests:{username:username}}})
        console.log(data);
        return res.json({status:"ok"})
    } catch (error) {
        console.log(error)
    }  
})

app.get('/api/profile_img', async (req,res) =>{
    const key = req.body.key
        const token = req.headers['x-access-token']
        const decoded = jwt.verify(token, 'secret123')
        const username = decoded.username
        const d = await User.findOne({ username: username}, 'profile')
        return res.json({status:"ok",data:d})
})
app.post('/api/send' , async (req,res)=>{
    const token = req.headers['x-access-token']
    const username = (jwt.decode(token)).username
    const to = req.body.currRec;
    const type = req.body.type
    const value = req.body.value
    const d = await User.findOne({username:username},'friends')
    let i= 0
    while(i<d.friends.length){
        if(to==d.friends[i].username){
            break;
        }
        i++
    }
    console.log(value,to,i)
    const data = await User.findOneAndUpdate({username:username},{$push:{'friends.$[elem].chat':{type:type,id:username,message:value}}},{arrayFilters:[{"elem.username":{$eq:to}}]})
    const data1 = await User.findOneAndUpdate({username:to},{$push:{'friends.$[elem].chat':{type:type,id:username,message:value}}},{arrayFilters:[{"elem.username":{$eq:username}}]})
    console.log(data)
    return res.json({status:'ok'}) 
})

app.get('/api/messages', async (req,res) =>{
    const token = req.headers['x-access-token']
    const decoded = jwt.decode(token)
    const user1 = decoded.username
    console.log(user1)
    const user = req.query.q
    const data = await User.findOne({username:user1,'friends.username':user},'friends.username friends.chat',{arrayFilters:[{"elem.username":{$eq:user}}]})
    let l
    for(let i = 0;i<data.friends.length;i++){
        if(data.friends[i].username==user){
            console.log(user)
            console.log(data.friends[i].chat)
            l = data.friends[i].chat
        }
    }
    return res.json({status:'ok',data:l}) 
})

app.get('/api/msgList', async (req,res)=>{
    const token = req.headers['x-access-token']
    const user = jwt.decode(token)
    const username = user.username
    const data = await User.findOne({username:username},'friends')
    return res.json({status:'ok',data:data})

})

app.post('/api/Request',async (req,res)=> {
    try {
        const key = req.body.key
        const status = req.body.status
        const token = req.headers['x-access-token']
        const decoded = jwt.verify(token, 'secret123')
        const username = decoded.username
        const data = await User.findOneAndUpdate({username:username},{$pull:{requests:{username:key}}})
        console.log(data);
        if(status== "accept"){
            const d = await User.findOne({ username: username}, 'profile')
            const self = await User.findOneAndUpdate({username:key},{$push:{friends:{username:username,profile:d.profile}}})
            const d1 = await User.findOne({ username: key}, 'profile')
            const self1 = await User.findOneAndUpdate({username:username},{$push:{friends:{username:key,profile:d1.profile}}})
        }
        return res.json({status:"ok"})
    } catch (error) {
        console.log(error)
    }  
})

app.get('/api/profile', async (req,res)=>{
    let user = req.query.username
    try {
        const data = await User.findOne({username:user},'username email name phone profile dob friends groups bookmarks requests')
        return res.json({stats:"ok",data:data})
    } catch (error) {
        
    }
})

app.listen(1337, ()=>{
    console.log('Server started')
})
//delete, update, set, post
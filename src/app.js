const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')
const socketio=require('socket.io')
const http=require('http')

const app = express()
const port= process.env.PORT || 3100
const server=http.createServer(app)
const io=socketio(server)


// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))



io.on('connection', (socket)=>{
    console.log('New socket connection')

    socket.on('sendLocation',(coords,callback)=>{
        // socket.emit('sendMessage',`https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
        forecast(coords.latitude,coords.longitude,(error,forecastData)=>{
            console.log(coords.latitude)
            if(error){
                return res.send({error})
            }
           socket.emit('sendMessage',{
               
            forecast: forecastData,
                
            })
        })
        callback()
    })
})

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Aditya Rana'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Aditya Rana'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'Contact Admin',
        title: 'Help',
        name: 'Aditya Rana'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address!'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})



app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }

    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Aditya Rana',
        errorMessage: 'Help article not found.'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Andrew Mead',
        errorMessage: 'Page not found.'
    })
})

// app.listen(port, () => {
//     console.log('Server is up on port 3100.')
// })

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})
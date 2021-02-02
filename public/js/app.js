const socket=io()

const weatherForm = document.querySelector('form')
const mylocation= document.querySelector('#send-location')
const search = document.querySelector('input')
const messageOne = document.querySelector('#message-1')
const messageTwo = document.querySelector('#message-2')

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const location = search.value

    messageOne.textContent = 'Loading...'
    messageTwo.textContent = ''

    fetch('/weather?address=' + location).then((response) => {
        response.json().then((data) => {
            if (data.error) {
                messageOne.textContent = data.error
            } else {
                messageOne.textContent = data.location
                messageTwo.textContent = data.forecast
            }
        })
    })
})

socket.on('sendMessage',(message,error)=>{
    console.log(message)
    

    // messageOne.textContent = 'Loading...'

    if(error){
        return alert('Not available!')
    }
    messageTwo.textContent = ''
    
     messageTwo.textContent=message.forecast
            
    
    
})

mylocation.addEventListener('click',(e)=>{
    console.log('clicked')

    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }

    e.preventDefault()   

    messageOne.textContent = 'Loading...'
    messageTwo.textContent = ''

    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation',{
        latitude: position.coords.latitude,
        longitude:position.coords.longitude
        },()=>{
                console.log('location shared!')
        })
    })

})
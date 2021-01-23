const request = require('request')

const forecast = (latitude, longitude, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=5313d93b3b96bc1243f9167048f26385&query=' + latitude + ',' + longitude+'&units=m'

    request({ url, json: true }, (error, { body }) => {
        if (error) {
            callback('Unable to connect to weather service!', undefined)
        } else if (body.error) {
            callback('Unable to find location', undefined)
        } else {
            callback(undefined,  ' It is currently ' + body.current.temperature + ' degrees Celsius\r\n' + body.current.weather_descriptions +' '+ body.location.localtime)
        }
    })
}

module.exports = forecast
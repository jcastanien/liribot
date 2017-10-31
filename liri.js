var keys = require("./keys.js");
var inquirer = require("inquirer");
var twitter = require("twitter");
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require("fs");

var action = process.argv[2];
var splice = process.argv.splice(3, process.argv.length - 1);
var joined = splice.join(" ");

//Twitter call
if (action === "my-tweets"){
var client = new twitter ({
    consumer_key: keys.twitterKeys.consumer_key,
    consumer_secret: keys.twitterKeys.consumer_secret,
    access_token_key: keys.twitterKeys.access_token_key,
    access_token_secret: keys.twitterKeys.access_token_secret
});

var params = {screen_name: "@smithc0mmaj0hn",
            count: 20
};
client.get("statuses/user_timeline", params, function(error, tweet, response) {
    
    if (!error && response.statusCode === 200){
    console.log(error);
    }
    for(var i = 0; i <tweet.length; i++){
        console.log("------------------------");
        console.log("This tweet was created on: " + tweet[i].created_at);
        console.log("The text read: " + tweet[i].text);
        console.log("------------------------");

        //tried to get the bonus working here.  tweet[i] will only display one tweet not the 20 count
        fs.appendFile("log.txt", JSON.stringify(tweet[i].text), function(err) {
            if(err) {
                return console.log(err)
            }
        })
    }

});
} else if(action === "spotify-this-song") {

//Spotify call
var spotify = new Spotify({
 id: "90c5dbfb4fb148819a941b9bef797563",
 secret: "d4cbfaef16fe42af92dbd6fe4859ba6e"
});

spotify.search({ type: 'track', query: joined, limit: 1 }, function(err, data) {
 if (err) {
   return console.log('Error occurred: ' + err);
 }
 console.log("------------------------");
console.log("Name: " + data.tracks.items[0].name);
console.log("Artist: " + data.tracks.items[0].artists[0].name);
console.log("Preview Url: " + data.tracks.items[0].preview_url);
console.log("Album Name: " + data.tracks.items[0].album.name)
console.log("------------------------");

//bonus not working 100%
fs.appendFile("log.txt", JSON.stringify(data.tracks.items[0].name));
fs.appendFile("log.txt", JSON.stringify(data.tracks.items[0].artists[0].name));
fs.appendFile("log.txt", JSON.stringify(data.tracks.items[0].preview_url));
fs.appendFile("log.txt", JSON.stringify(data.tracks.items[0].album.name));

});
} else if (action === "movie-this") {
// OMDB call
var queryUrl = "http://www.omdbapi.com/?t=" + joined + "&y=&plot=short&apikey=40e9cece";

request(queryUrl, function(error, response, body) {
    console.log("------------------------");
    console.log("Title: " + JSON.parse(body).Title);
    console.log("Year: " + JSON.parse(body).Year);
    console.log("IMDB Rating: " + JSON.parse(body).Ratings[0].Value);
    console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
    console.log("Country Produced: " + JSON.parse(body).Country);
    console.log("Language: " + JSON.parse(body).Language);
    console.log("Plot: " + JSON.parse(body).Plot);
    console.log("Main Actors" + JSON.parse(body).Actors);
    console.log("------------------------");
})

} else if (action === "do-what-it-says") {
//fs node package
fs.readFile("random.txt", "utf8", function(error, data) {
    console.log("-----------*-------------");
    valueOne = data.split(",")
    valueOne[1]
    console.log(valueOne[0]);
    console.log(valueOne[1]);
    console.log("-----------*-------------");

    if(valueOne[0] === 'spotify-this-song'){

    var spotify = new Spotify({
        id: "90c5dbfb4fb148819a941b9bef797563",
        secret: "d4cbfaef16fe42af92dbd6fe4859ba6e"
       });
       
       spotify.search({ type: 'track', query: valueOne[1], limit: 1 }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        console.log("------------------------");
       console.log("Name: " + data.tracks.items[0].name);
       console.log("Artist: " + data.tracks.items[0].artists[0].name);
       console.log("Preview Url: " + data.tracks.items[0].preview_url);
       console.log("Album Name: " + data.tracks.items[0].album.name)
       console.log("------------------------");
       });
    } else {
        console.log("error please enter correct command");
    }
})

//Bonus log.txt  Didnt gett it working correct yet.
} else if (action === "read-log") {
fs.readFile("log.txt", "utf8", function(error, data) {
    if (error){
        console.log(error);
    } 
    var dataArr = data.split(",");
    console.log(dataArr);
})

} else {
    console.log("incorrect command.  Please enter one of the following my-tweets, spotify-this-song, movie-this, do-what-it-says")
}
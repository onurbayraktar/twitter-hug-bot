var Twit = require('twit');                     // Twit package //
var fs = require('fs');
var request = require('request');
var config = require('./config');
const http = require('https');
const dirname = require('./vars').path_to_gifs;

T = new Twit(config);                           // Create a new twit object //

var stream, from, tweet_id, text, rt_check, random_num, is_it_quoted,
    check_result_1, check_result_2, check_result_3;            // Variables that will be used

// Setting up a user stream //
stream = T.stream('statuses/filter', { track: 'I need a hug'} );
stream.on('tweet', tweetIt);

function tweetIt(eventMsg) {
    text = eventMsg.text;                       // The text that we recieved
    from = eventMsg.user.screen_name;           // The user that wants to be hugged.
    tweet_id = eventMsg.id_str;                 // The tweet id that is to be replied.
    is_it_quoted = eventMsg.quoted_status_id

    console.log(from + " needs a hug !");
    console.log(text);
    console.log(is_it_quoted);
    console.log("");

    rt_check = text.includes("RT");             // We don't reply to just retweet
    // Check if the tweet has these sequences below //
    check_result_1 = text.includes("i need");
    check_result_2 = text.includes("I need");
    check_result_3 = text.includes("hug");
    if( (rt_check == false) && ((check_result_1 == true) || (check_result_2 == true))  && (check_result_3 == true) && is_it_quoted==undefined )
    {

        random_num = Math.floor(Math.random() * 8);    // I have 8 gifs in my directory, you need to adjust yourself

        var filename = dirname + "/hug_" + random_num + ".gif";    // Gif path //
        console.log("HUG NAME IS: " + filename);
        var params = {
            encoding: 'base64'
        }
        var b64 = fs.readFileSync(filename, params);            // Reading the file //
        T.post('media/upload', {media_data: b64}, uploaded);    // Now post media and call function.


        function uploaded(err, data, response) {
            console.log("Hug is on the way...");
            var id = data.media_id_string;
            var tweet = {
                status: "@"+ from + " Whenever you need one, I'm always with you !",
                media_ids: [id],
                in_reply_to_status_id: tweet_id                   // ID of the tweet that will be replied
            };
            T.post('statuses/update', tweet)                // Send the tweet
            console.log("** Hug sent **");
        }
    }
}

























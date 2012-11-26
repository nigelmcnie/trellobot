/**
 * trellobot - talk to trello via IRC, like a boss
 *
 * Author: Nigel McNie <nigel@mcnie.name>
 */

// TODO
// - README, including installation instructions
// - oauth, rather than forcing grabbing a token manually...
// - what to do if two boards I can see have the same slug?
// - assuming trellobot is useful, make a trellobot user on trello and get it into our boards
// - ask ned why I have to specify channels in the irc.Client constructor
// - use or discard node-promise
// - gather ideas for other things this could do
// - publish on github
// - add 'trellobot: help' and /msg trellobot help to get list of actions, boards to post to etc.

var ini = require('node-ini');
var irc = require('irc');
var Trello = require('node-trello');


var settings = ini.parseSync('trellobot.ini');


var trello = new Trello(settings.trello.api_key, settings.trello.api_token);
var irc_client = new irc.Client(settings.bot.server, settings.bot.nick, {
    channels: [settings.bot.channel],
});


function trello_cb(f) {
    return function(err, data) {
        if (err) throw err;
        f(data);
    };
};


var available_boards = [];

trello.get('/1/members/me', {boards: 'all', board_fields: 'name,url', board_lists: 'open'}, trello_cb(function(data) {
    console.log(data.boards[0].lists);
    data.boards.forEach(function(b) {
        available_boards.push({
            id: b.id,
            name: b.name,
            slug: b.url.replace(new RegExp('^https://trello\.com/board/([a-z0-9-]+)/.*'), '$1'),
            list: b.lists[0].id,
        });
    });
    console.log(available_boards);
}));

function trello_add_card(board, name) {
    console.log('trello_add_card: ', board, name);
    var b = available_boards.filter(function(b) {
        return b.slug == board;
    });
    console.log(b);
    if (b) {
        trello.post('/1/cards', {
            name: name,
            desc: 'Submitted by trellobot!',
            pos: 'bottom',
            idList: b[0].list,
        }, trello_cb(function(data) {
            console.log(data);
            irc_client.say(settings.bot.channel, 'Added card "' + name + '" to board "' + board + '" - ' + data.url);
        }));
    }
}

irc_client.addListener('error', function(message) {
    console.log('error: ', message);
});

irc_client.addListener('message', function (from, to, message) {
    console.log(from + ' => ' + to + ': ' + message);
    if ( matches = message.match(new RegExp('^' + settings.bot.nick + ':\\s*([a-z0-9-]+)\\s+(.*)$')) ) {
        var board = matches[1];
        var name  = matches[2];
        console.log('new card "' + name + '" on board "' + board + '"');
        trello_add_card(board, name);
    }
});


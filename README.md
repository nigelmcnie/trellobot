trellobot
=========
Allows you to add cards to trello via IRC.

```
npm install irc
npm install node-ini
npm install node-trello
cp trellobot.ini.dist trellobot.ini
# go to https://trello.com/1/appKey/generate to get your api key and
# https://trello.com/1/connect?key=YOUR_API_KEY&name=Trellobot&response_type=token&scope=read,write
# to get an access token (note: they're valid for 30 days)
$EDITOR trellobot.ini
node trellobot.js
```

Then in chan:

```
00:03 <@waa> trellobot: buzzumi-dev Sudo make me a sandwich!
00:03 < trellobot> Added card "Sudo make me a sandwich!" to board "buzzumi-dev" - https://trello.com/card/sudo-make-me-a-sandwich/4f95f34729d68494581bcd7e/789
```

This is like 1-2 hours hacking, playing with trello API etc. Don't hate the
code, use the fork button, and be grateful I even bothered to write a README.

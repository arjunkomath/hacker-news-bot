var TelegramBot = require('node-telegram-bot-api');
var request = require('request');
var hn = require("node-hacker-news");

var options = {
	polling: true
};

var token = require('./token').token;

var bot = new TelegramBot(token, options);
bot.getMe().then(function (me) {
	console.log('Hi my name is %s!', me.username);
});

bot.onText(/^\/start/, function (msg) {
	var message = 'What can I do ? '+ "\n";
	message += '/top - Get Top 5 posts' + "\n";
	message += '/top [page] - Get posts from page number send' + "\n";
	message += '/username [user] - Get details of user' + "\n";
	message += '/help - For help!' + "\n";
	var opts = {
		reply_to_message_id: msg.message_id,
		reply_markup: JSON.stringify({
			keyboard: [
			['/top - Get Top 5 posts'],
			['/help - For help!']]
		})
	};
	bot.sendMessage(msg.chat.id, message, opts).then(function () {
		console.log('send welcome');
	});
});

bot.onText(/^\/help/, function (msg) {
	var message = 'Need help ? '+ "\n";
	message += 'Ping me @arjunkomath' + "\n";
	bot.sendMessage(msg.chat.id, message).then(function () {
		console.log('send help');
	});
});

bot.onText(/^\/top (.+)$/, function (msg, match) {
	var page = match[1];
	var limit = (page-1)*5;
	hn.topstories( function (err, stories) {
		if (!err) {
			var stories = stories.slice(limit, limit+5);
			stories.map( function(s) {
				hn.item( s, function(err, item) {
					var message = item.title + "\n";
					message += 'url: ' + item.url + "\n";
					message += 'score: ' + item.score + "\n";
					message += 'by: ' + item.by + "\n";
					bot.sendMessage(msg.chat.id, message).then(function () {
						console.log('send');
					});
				})
			})
		} else {
			bot.sendMessage(msg.chat.id, 'Unable to fetch data').then(function () {
				console.log('send error');
			});
		}
	});
});

bot.onText(/^\/top/, function (msg) {
	hn.topstories( function (err, stories) {
		if (!err) {
			var stories = stories.slice(0, 5);
			stories.map( function(s) {
				hn.item( s, function(err, item) {
					var message = item.title + "\n";
					message += 'url: ' + item.url + "\n";
					message += 'score: ' + item.score + "\n";
					message += 'by: ' + item.by + "\n";
					bot.sendMessage(msg.chat.id, message).then(function () {
						console.log('send');
					});
				})
			})
		} else {
			bot.sendMessage(msg.chat.id, 'Unable to fetch data').then(function () {
				console.log('send error');
			});
		}
	});
});

bot.onText(/^\/user (.+)$/, function (msg, match) {
	var u = match[1];
	hn.user(u, function (err, user) {
		if (!err) {
			var message = 'ID: ' + user.id + "\n";
			message += 'karma: ' + user.karma + "\n";
			message += 'posts: ' + user.submitted.length + "\n";
			bot.sendMessage(msg.chat.id, message).then(function () {
				console.log('send');
			});
		} else {
			bot.sendMessage(msg.chat.id, 'Unable to fetch data').then(function () {
				console.log('send error');
			});
		}
	});
});
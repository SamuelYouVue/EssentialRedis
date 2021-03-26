var redis = require("redis");
var client = redis.createClient();

var key = "PullNotification";
// client.hset(key + ":Expense", "r1", true); // 1
// client.hset(key + ":Expense", "r2", true); // 1
// client.hset(key + ":Time", "r1", true); // 1
// client.hset(key + ":Time", "r2", true); // 1
// client.hset(key + ":Time", "r3", true); // 1

// var luaScript = 'return redis.call("HSCAN", KEYS[1], 0, ARGV[1], ARGV[2])'; // 2
// client.eval(luaScript, 1, key, 'match', '*Time*', function (err, reply) { // 3
//     console.log(reply); // 4
//     client.quit();
// });


var luaScripts = [
    "local keys = KEYS ",
    "local fields = ARGV ",
    "local lists = {} ",
    "local k=1 ",
    " for i, key in ipairs(keys) do ",
    "   for j, field in ipairs(fields) do ",
    "       lists[k] = {key, field, redis.call('HGET', key, field) } ",
    "       k=k+1 ",
    "   end ",
    " end ",
    " return lists"

].join("\n");

var keys = ["PullNotification:Time", "PullNotification:Expense"];
var resources = ['r1'];

client.eval(luaScripts, keys.length, ...keys,  ...resources, function (err, reply) { // 3
    console.log(err);
    console.log(reply); // 4
    client.quit();
});
var redis = require("redis");
var client = redis.createClient();

var key = "PullNotification";
client.hset(key, "r1:Time", true); // 1
client.hset(key, "r2:Expense", true); // 1
client.hset(key, "r1:Time", true); // 1
client.hset(key, "r2:Expense", true); // 1
client.hset(key, "r3:Expense", true); // 1

// var luaScript = 'return redis.call("HSCAN", KEYS[1], 0, ARGV[1], ARGV[2])'; // 2
// client.eval(luaScript, 1, key, 'match', '*Time*', function (err, reply) { // 3
//     console.log(reply); // 4
//     client.quit();
// });


var luaScripts = [
"local cursor = 0 ",
"local fields = {} ",
"local ids = {} ",
"local key = KEYS[1] ",
"local value = '*' .. ARGV[2] .. '*' ",
"repeat ",
"    local result = redis.call('HSCAN', key, cursor, ARGV[1], value) ",
"    cursor = tonumber(result[1]) ",
"    fields = result[2] ",
"    for i, id in ipairs(fields) do ",
"        if i % 2 == 1 then ",
"            ids[#ids + 1] = id ",
"        end ",
"    end ",
"until cursor == 0 ",
// "for _, id in ipairs(ids) do ",
// "   redis.call('HDEL', key, id) ",
// "end ",
"return ids "
].join("\n");

var keys = [key, 'key2'];

client.eval(luaScripts, 2, ...keys, 'match', '*Time*', function (err, reply) { // 3
    console.log(err);
    console.log(reply); // 4
    client.quit();
});


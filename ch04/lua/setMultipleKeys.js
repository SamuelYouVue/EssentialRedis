var redis = require("redis");
var client = redis.createClient();
var cjson = require("cjson");

// var key = "PullNotification:Time";
// client.hset(key, "r1", true); // 1
// client.hset(key+ ":Time", "r2", true); // 1
// client.hset(key+ ":Time", "r3", true); // 1
// client.hset(key + ":Expense", "r1", true); // 1
// client.hset(key + ":Expense", "r2", true); // 1

// var luaScript = 'return redis.call("HSCAN", KEYS[1], 0, ARGV[1], ARGV[2])'; // 2
// client.eval(luaScript, 1, key, 'match', '*Time*', function (err, reply) { // 3
//     console.log(reply); // 4
//     client.quit();
// });

//redis.call('HSET', key_name, unpack(payload))
var luaScripts = [
    "local key = KEYS[1] ",
    "local payload = {} ",    
    "redis.call('DEL', key) ",
    "local fields = ARGV ",
    // " local field, value",
    // "for i, k in pairs(fields) do ",
    // " if i%2 == 0 then ",
    // "   value = k      ",
    // "   table.insert(payload, field) ",
    // "   table.insert(payload, value) ",
    // " else      ",
    // "   field = k    ",
    // " end      ",
    // "end ",
    "redis.call('HMSET', key, unpack(fields)) ",
    "return fields "
].join("\n");

var key = "PullNotification:Time";
var resources = ['r1','tes1','r2','test21'];

client.eval(luaScripts, 1, key,  ...resources, function (err, reply) { // 3
    console.log(err);
    console.log(reply); // 4
    client.quit();
});
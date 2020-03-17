/**
 * Require event emitter
 */
const eventEmitter = require('./eventEmitter');

/**
 * Require redis
 */
const redis = require("redis");

/**
 * Create redis client
 */
const client = redis.createClient({
    'host': 'redis',
    'port': 6379
});

/**
 * SET key-value in cache
 * @param {*} key 
 * @param {*} value 
 */
const set = async(key, value) => {
    return new Promise((resolve, reject) => {
        client.set(key, value, (err) => {
            if(err) {
                reject(err);     
            } else {
                eventEmitter.emit('set', key);
                resolve(key);
            }
        });
    });
};

/**
 * GET key-value from cache
 * @param {*} key 
 */
const get = async(key) => {
    return new Promise((resolve, reject) => {
        client.get(key, (err, value)=> {
            if(err) {
                reject(err);
            } else {
                resolve(value);
            }
        });
    });
};

/**
 * DELETE key-value from cache
 * @param {*} key 
 */
const deleteKey = async(key) => {
    return new Promise((resolve, reject) => {   
        client.del(key, cb = (err, success) => {
            if(err) {
                reject(err);
            } else {
                resolve(success);
            }
        });
    });
};

/**
 * DELETE all key-value from cache
 * @param {*} key 
 */
const deleteAll = async(key) => {
    return new Promise((resolve, reject) => {   
        client.flushall((err, success) => {
            if(err) {
                reject(err);
            } else {
                resolve(success);
            }
        });
    });
};

exports.set = set;
exports.get = get;
exports.deleteKey = deleteKey;
exports.deleteAll = deleteAll;
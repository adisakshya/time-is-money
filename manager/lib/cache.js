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
    'host': 'redis',                    // Host
    'port': 6379                        // Port
});

/**
 * SET key-value in cache
 * @param {String} key 
 * @param {String} value 
 */
const set = async(key, value) => {

    /**
     * Promise to handle set operation on cache
     */
    return new Promise((resolve, reject) => {

        /**
         * Set key-value pair in cache
         */
        client.set(key, value, (err) => {
            if(err) {
                // Reject promise
                reject(err);     
            } else {
                // Emit 'set' event
                // Utilized to perform pause/resume/terminate operation
                eventEmitter.emit('set', key, value);

                // Resolve promise
                resolve(key);
            }
        });
    });
};

/**
 * GET key-value from cache
 * @param {String} key 
 */
const get = async(key) => {

    /**
     * Promise to handle get operation on cache
     */
    return new Promise((resolve, reject) => {

        /**
         * Get key-value pair from cache
         */
        client.get(key, (err, value)=> {
            if(err) {
                // Reject promise
                reject(err);
            } else {
                // Resolve promise
                resolve(value);
            }
        });
    });
};

/**
 * DELETE key-value from cache
 * @param {String} key 
 */
const deleteKey = async(key) => {

    /**
     * Promise to handle delete operation on cache
     */
    return new Promise((resolve, reject) => { 
        
        /**
         * Delete key-value pair from cache
         */
        client.del(key, cb = (err, success) => {
            if(err) {
                // Reject promise
                reject(err);
            } else {
                // Resolve promise
                resolve(success);
            }
        });
    });
};

/**
 * DELETE all key-value from cache
 */
const deleteAll = async() => {
    
    /**
     * Promise to handle delete-all operation on cache
     */
    return new Promise((resolve, reject) => {   
        
        /**
         * Delete all key-value pair from cache
         */
        client.flushall((err, success) => {
            if(err) {
                // Reject promise
                reject(err);
            } else {
                // Resolve promise
                resolve(success);
            }
        });
    });
};

/**
 * Get all key-value pairs from cache
 */
const getAll = async() => {
    
    /**
     * Promise to handle get-all operation on cache
     */
    return new Promise(async(resolve, reject) => {
        
        // Auxiliary object to store key-value pairs
        var res = {};

        // Get all keys from cache
        client.KEYS('*', async(err, keys) => {
            
            // For every key get corresponding value and insert into
            // auxiliary object
            for(let i=0; i<keys.length; i++) {
                let value = await get(keys[i]);
                res[keys[i]] = JSON.parse(value);
            }

            // Resolve promise
            resolve(res);
        });
    });
};

exports.set = set;
exports.get = get;
exports.deleteKey = deleteKey;
exports.deleteAll = deleteAll;
exports.getAll = getAll;
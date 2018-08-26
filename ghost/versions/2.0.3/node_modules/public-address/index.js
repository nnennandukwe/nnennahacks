'use strict';

var http = require('http');
var dns = require('dns');
var net = require('net');

module.exports = resolve;

function resolve(options, callback) {
    var requestOptions = {
        hostname: 'api.ipify.org',
        port: 80,
        path: '/?format=json',
        method: 'GET'
    };

    if (!callback && typeof options == 'function') {
        callback = options;
        options = undefined;
    }

    options = options || {};
    Object.keys(options).forEach(function (key) {
        requestOptions[key] = options[key];
    });

    http.get(requestOptions, function (res) {
        var chunks = [],
            chunklen = 0;

        if (res.statusCode != 200) {
            res.on('data', function () {});
            res.on('end', function () {
                callback(new Error('Invalid response code ' + res.statusCode));
            });
            return;
        }

        res.on('data', function (chunk) {
            chunks.push(chunk);
            chunklen += chunk.length;
        });

        res.on('end', function () {
            var data;
            var ip;
            try {
                data = JSON.parse(Buffer.concat(chunks, chunklen).toString());
            } catch (exception) {}
            if (!data) {
                return callback(new Error('Invalid response from server'));
            } else {
                ip = data.ip;
                if (!ip || !net.isIP(ip)) {
                    return callback(new Error('IP address missing from server response'));
                }
                dns.reverse(ip, function (err, hostnames) {
                    var response = {
                        address: ip
                    };
                    if (!err && hostnames && hostnames.length) {
                        response.hostname = hostnames[0];
                    }

                    callback(null, response);
                });
            }
        });
    }).on('error', function (err) {
        callback(err);
    });
}

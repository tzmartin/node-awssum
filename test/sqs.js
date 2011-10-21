// --------------------------------------------------------------------------------------------------------------------
//
// sqs.js - test for AWS Simple Queue Service
//
// Copyright (c) 2011 AppsAttic Ltd - http://www.appsattic.com/
// Written by Andrew Chilton <chilts@appsattic.com>
//
// License: http://opensource.org/licenses/MIT
//
// --------------------------------------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------------------------------------
// requires

var tap = require("tap"),
    test = tap.test,
    plan = tap.plan,
    _ = require('underscore');
var amazon;
var sqsService;

// --------------------------------------------------------------------------------------------------------------------
// basic tests

test("load sqs", function (t) {
    sqsService = require("../lib/sqs");
    t.ok(sqsService, "object loaded");

    amazon = require("../lib/amazon");
    t.ok(amazon, "object loaded");

    t.end();
});

test("create sqs object", function (t) {
    var sqs = new sqsService.Sqs('access_key_id', 'secret_access_key', 'aws_account_id', amazon.US_WEST_1);

    t.equal('access_key_id', sqs.accessKeyId(), 'Access Key ID set properly');
    t.equal('secret_access_key', sqs.secretAccessKey(), 'Secret Access Key set properly');
    t.equal('aws_account_id', sqs.awsAccountId(), 'AWS Account ID set properly');
    t.equal('California', sqs.region(), 'Region is set properly');

    t.end();
});

test("test all endpoints", function (t) {
    var sqs1 = new sqsService.Sqs('access_key_id', 'secret_access_key', 'aws_account_id', amazon.US_EAST_1);
    var sqs2 = new sqsService.Sqs('access_key_id', 'secret_access_key', 'aws_account_id', amazon.US_WEST_1);
    var sqs3 = new sqsService.Sqs('access_key_id', 'secret_access_key', 'aws_account_id', amazon.EU_WEST_1);
    var sqs4 = new sqsService.Sqs('access_key_id', 'secret_access_key', 'aws_account_id', amazon.AP_SOUTHEAST_1);
    var sqs5 = new sqsService.Sqs('access_key_id', 'secret_access_key', 'aws_account_id', amazon.AP_NORTHEAST_1);

    t.equal('sqs.us-east-1.amazonaws.com', sqs1.endPoint(), '1) Endpoint is correct');
    t.equal('sqs.us-west-1.amazonaws.com', sqs2.endPoint(), '2) Endpoint is correct');
    t.equal('sqs.eu-west-1.amazonaws.com', sqs3.endPoint(), '3) Endpoint is correct');
    t.equal('sqs.ap-southeast-1.amazonaws.com', sqs4.endPoint(), '4) Endpoint is correct');
    t.equal('sqs.ap-northeast-1.amazonaws.com', sqs5.endPoint(), '5) Endpoint is correct');

    t.end();
});

test("test our own escape(...)", function (t) {
    var sqs = new sqsService.Sqs('access_key_id', 'secret_access_key', 'aws_account_id', amazon.US_WEST_1);

    var query1 = 'DomainName';
    var escQuery1 = sqs.escape(query1);
    t.equal(escQuery1, 'DomainName', 'Simple String (idempotent)');

    var query2 = 2;
    var escQuery2 = sqs.escape(query2);
    t.equal(escQuery2, '2', 'Simple Number Escape (idempotent)');

    var query3 = 'String Value';
    var escQuery3 = sqs.escape(query3);
    t.equal(escQuery3, 'String%20Value', 'Simple With a Space');

    var query4 = 'Hey @andychilton, read this! #liverpool';
    var escQuery4 = sqs.escape(query4);
    t.equal(escQuery4, 'Hey%20%40andychilton%2C%20read%20this%21%20%23liverpool', 'Something akin to a Tweet');

    var query5 = 'SELECT * FROM my_table';
    var escQuery5 = sqs.escape(query5);
    t.equal(escQuery5, 'SELECT%20%2A%20FROM%20my_table', 'Escaping of a select');

    t.end();
});

// --------------------------------------------------------------------------------------------------------------------

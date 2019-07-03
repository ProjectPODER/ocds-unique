#!/usr/bin/env node
const monk = require('monk');
const commandLineArgs = require('command-line-args');

const optionDefinitions = [
  { name: 'collections', alias: 'c', type: String, multiple: true, defaultOption: true },
  { name: 'database', alias: 'd', type: String }
];

const args = commandLineArgs(optionDefinitions);

if(!args.database || !args.collections) {
    console.log('ERROR: missing parameters.');
    process.exit(1);
}

const ocid_promises = [];
const url = 'mongodb://localhost:27017/' + args.database;
const db = monk(url)
            .then( (db) => {

                args.collections.map( (collection) => {
                    let promise = findAllOCIDs(db, collection);
                    ocid_promises.push(promise);
                } );

                Promise.all(ocid_promises).then( results => {
                    results.map( (result) => {
                        result.map( (line) => {
                            process.stdout.write(line.ocid + '\n', delete line);
                        } );
                        delete result;
                    } );
                    delete results;
                    db.close();
                    process.exit();
                });
            });

function findAllOCIDs(db, collection) {
    const coll = db.get(collection);
    return coll.aggregate(
        [
            {
                "$group" : {
                    "_id" : {
                        "ocid" : "$ocid"
                    }
                }
            },
            {
                "$project" : {
                    "_id" : 0,
                    "ocid" : "$_id.ocid"
                }
            }
        ]
    )
}

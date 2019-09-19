#!/usr/bin/env node
const monk = require('monk');
const commandLineArgs = require('command-line-args');

const optionDefinitions = [
  { name: 'collections', alias: 'c', type: String, multiple: true, defaultOption: true },
  { name: 'database', alias: 'd', type: String },
  { name: 'field', alias: 'f', type: String }
];

const args = commandLineArgs(optionDefinitions);

if(!args.database || !args.collections) {
    console.log('ERROR: missing parameters.');
    process.exit(1);
}
const idField = (args.field)? args.field : 'ocid';

const ocid_promises = [];
const url = 'mongodb://localhost:27017/' + args.database;
const db = monk(url)
            .then( (db) => {
                args.collections.map( (collection) => {
                    let promise = findAllOCIDs(db, collection);
                    ocid_promises.push(promise);
                } );

                Promise.all(ocid_promises).then( results => {
                    db.close();
                    let uniques = {};
                    results.map( (result) => {
                        result.map( (line) => {
                            if(!uniques.hasOwnProperty(line[idField])) uniques[line[idField]] = 1;
                        } );
                        delete result;
                    } );
                    delete results;

                    // Object.keys(uniques).map( (line) => {
                    //     console.log(line);
                    //     delete uniques[line];
                    // } );
                    process.stdout.write( Object.keys(uniques).join('\n') + '\n', process.exit );
                    // console.log('done');
                    // process.exit();
                });
            });

function findAllOCIDs(db, collection) {
    const coll = db.get(collection);
    return coll.aggregate(
        [
            {
                "$group" : {
                    "_id" : {
                        [idField] : "$" + idField
                    }
                }
            },
            {
                "$project" : {
                    "_id" : 0,
                    [idField] : "$_id." + idField
                }
            }
        ]
    )
}

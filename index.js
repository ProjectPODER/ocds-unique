#!/usr/bin/env node
const monk = require('monk');
const commandLineArgs = require('command-line-args');

const optionDefinitions = [
    { name: 'host', alias: 'h', type: String, defaultValue: 'localhost' },
    { name: 'port', alias: 'p', type: String, defaultValue: '27017' },
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
const clean_field = idField.replace(/\./g, '_');

const id_promises = [];
const url = 'mongodb://' + args.host + ':' + args.port + '/' + args.database + '?socketTimeoutMS=500000&connectTimeoutMS=500000';
const db = monk(url)
            .then( (db) => {
                args.collections.map( (collection) => {
                    let promise = findAllIDs(db, collection);
                    id_promises.push(promise);
                } );

                Promise.all(id_promises).then( results => {
                    db.close();
                    let uniques = {};
                    results.map( (result) => {
                        result.map( (line) => {
                            if(!uniques.hasOwnProperty(line[idField])) uniques[line[clean_field]] = 1;
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

function findAllIDs(db, collection) {
    const coll = db.get(collection);

    return coll.aggregate(
        [
            {
                "$group" : {
                    "_id" : {
                        [clean_field] : "$" + idField
                    }
                }
            },
            {
                "$project" : {
                    "_id" : 0,
                    [clean_field] : "$_id." + clean_field
                }
            }
        ],
        { "allowDiskUse": true }
    )
}

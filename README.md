# OCDS Unique

This script takes a Mongo database and a list of collections and returns a newline separated list of unique strings. The strings returned correspond to the field specified as an option from the command line.

## Usage

    node index.js -d DATABASE -c COLLECTION1 COLLECTION2

## Options

El script acepta las siguientes opciones como argumentos:

    --host          -h  Mongo host (defaults to localhost).
    --port          -p  Mongo port (defaults to 27017).
    --database      -d  Name of Mongo database.
    --collections   -c  List of Mongo collection names.
    --field         -f  Name of field to obtain unique values from.

## Additional information

This script is used along with [record-compiler](http://gitlab.rindecuentas.org/equipo-qqw/record-compiler) to properly compile OCDS records inside [Poppins](http://gitlab.rindecuentas.org/equipo-qqw/poppins). Output of this script can be redirected as the input to the next script.

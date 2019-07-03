# OCDS Unique

Este script recibe como parámetros el nombre de una base de datos MongoDB y un listado de colecciones con documentos en el formato OCDS, y devuelve un listado de todos los *ocid* únicos dentro de las colecciones, separados por newline (**\n**).

## Ejemplo de uso

Desde el directorio raíz:

    node index.js -d quienesquienwiki -c contracts_ocds

Este script se utiliza en conjunto con [record-compiler](http://gitlab.rindecuentas.org/equipo-qqw/record-compiler) para realizar la unificación de releases procesados por [Poppins](http://gitlab.rindecuentas.org/equipo-qqw/poppins) y convertir a los records que devuelve [la API de QQW](http://gitlab.rindecuentas.org/equipo-qqw/QuienEsQuienApi).

    node ocds-unique/index.js -d quienesquienwiki -c contracts_ocds | node record-compiler/index.js -d quienesquienwiki -c contracts_ocds

## Opciones

El script acepta las siguientes opciones como argumentos:

    --database      -d  El nombre de la base de datos que contiene los contratos
    --collections   -c  El listado de colecciones con documentos OCDS

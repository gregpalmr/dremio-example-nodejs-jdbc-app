//
// FILE: app.js
//
// DESC: This example Node.js application uses the Dremio JDBC driver to access virtual data sources in Dremio.
//
// USAGE: 
//        npm install
//        node app.js <server> <port> <schema> <user> <password>
//
//        example:
//
//        npm install
//        node app.js dremio.org 31010 '@greg@dremio.com' 'greg@dremio.com' '<password>'
//
// NOTES: 
//    1. Before running this app, install the Node.js and the node package manager (npm):
//
//        Download and install Node.js from https://nodejs.org/en/ OR https://nodejs.org/dist/v12.16.2/node-v12.16.2.pkg
//
//    2. Before running this app, install the required Node.js packages:
//
//        npm install --save java
//        npm install --save jdbc
//        npm install --save async
//
//	  2. Before running this app, download and install the Dremio JDBC driver: 
//
//        Download the Dremio JDBC driver installer from https://www.dremio.com/drivers/
//        Copy the Dremio JDBC driver jar file to ./drivers
//
//	  3. This app queries the Dremio samples data source named Samples."samples.dremio.com"."NYC-taxi-trips". 
//        However, you must first create a Dremio Virtual Data Source (VDS) object that points to the data source
//	  And implements a raw reflection containing all columns and an aggregation reflection on the following columns:
//
//        Dremio aggregation reflection definition for VDS "NYC_TRIPS":
//
//                  Dimension                                Measure COUNT                  Measure SUM
//                  -----------------------                  -----------------------        -------------------------
//		    pickup_datetime                          pickup_datetime	
//                  passenger_count                          passenger_count
//                                                           trip_distance_mi               trip_distance_mi
//
// QUESTIONS/COMMENTS: Direct questions or comments to greg@dremio.com
//

// Load the required Node.js packages
var JDBC = require('jdbc');
var jinst = require('jdbc/lib/jinst');
var asyncjs = require('async');

// Launch a Java JVM and put the Dremio JDBC jar file in the class path
if (!jinst.isJvmCreated()) {
  jinst.addOption("-Xrs");
  jinst.setupClasspath(['./drivers/dremio-jdbc-driver-4.2.1-202004111451200819-0c3ecaea.jar']);
}

// Get the user's Dremio server connection parameters from the command line
var server = process.argv[2];
var port = process.argv[3];
var schema = process.argv[4];
var user = process.argv[5];
var password = process.argv[6];

// Define the JDBC connection information
var config = {
  url: 'jdbc:dremio:direct=' + server + ':' + port + '; ' + schema,
  drivername: 'com.dremio.jdbc.Driver',
  minpoolsize: 10,
  maxpoolsize: 100,
  properties: {
    user: user,
    password: password
  }
};

// Initialize a JDBC Pool
var jdbcPool = new JDBC(config);

jdbcPool.initialize(function (err) {
  if (err) {
    console.log(err);
  }
});

// Pull a connection from the pool, and issue SQL statements using it
console.log(' - Pulling connection from the JDBC connection pool')
jdbcPool.reserve(function (err, connObj) {

  // The connection returned from the pool is an object with two fields
  // {uuid: <uuid>, conn: <Connection>}
  if (connObj) {

    console.log(" - Using JDBC connection: " + connObj.uuid);

    // Pull a connection from the pool, and issue SQL statements using it
    var conn = connObj.conn;

    // Query the Dremio data source
    //

    asyncjs.series([function (callback) {

        // Select statement example.
        conn.createStatement(function (err, statement) {

            if (err) {
              callback(err);
            } else {

              // Adjust some statement options before use. See statement.js for
              // a full listing of supported options.

              statement.setFetchSize(13000, function (err) {

                if (err) {
                  console.log(' - ERROR changing statement fetch size. Messageg: ' + err.message.substring(0, 100))
                  callback(err);
                } else {

                  var sqlCmd = 'SELECT * FROM ' + schema + '.' + '"NYC Trips" LIMIT 12000'

                  // Get the elapsed time - how long it takes to get first results back from Dremio server
                  var startTime   = new Date()
                  var endTime     = null
                  var elapsedTime = null

                  // Execute the statement
                  statement.executeQuery(sqlCmd, function (err, resultset) {
                    if (err) {
                      console.log(' - ERROR executing SQL Command: ' + sqlCmd)
                      callback(err)
                    } else {

                      endTime = new Date()
                      elapsedTime = endTime - startTime
                      elapsedTime /= 1000 // strip off ms

                      console.log(' - SUCCESS executing SQL Command: ' + sqlCmd)
                      console.log(' - Dremio Server Query Time: ' + elapsedTime.toString() + " seconds")

                      resultset.toObjArray(function (err, results) {
                        if (err) {
                          console.log(" - ERROR getting results from SQL Cmd: " + sqlCmd)
                          console.log("   Error Message: " + err.message.substring(0,200))
                        } else {
                          if (results.length > 0) {
                            console.log("\npickup_datetime".padEnd(25, ' ') + '  | ' + "passenger_count".padEnd(25, ' '));
                            console.log("-------------------------".padEnd(25, ' ') + ' | ' + "-------------------------".padEnd(25, ' '));
                            for (var i = 0; i < results.length; i++) {
                              var row = results[i];
                              // only display the first 20 rows, then skip the logging, but continue to read the rows
                              if (i < 20) {
                                console.log(row.pickup_datetime.padEnd(25, ' ') + " | " + row.passenger_count.padEnd(25, ' '))
                              }
                              if (i==21) {
                                console.log("\n... skipping remainder of rows ...")
                              }
                            }
                            endTime = new Date();
                            elapsedTime = endTime - startTime
                            elapsedTime /= 1000 // strip off ms
                            //console.log("")
                            console.log("\nTotal records transferred from Dremio server: " + results.length + " - transferred in " + elapsedTime + " seconds \n")
                          }
                          callback(null, resultset);
                        }
                      });
                    }
                  });
                }
              });
            }
          });
      },

    ], function (err, results) {

      // Log any errors returned by the Dremio server
      if (err) {
        console.log(' - ERROR executing SQL command')
        console.log('   ERROR message returned from Dremio server: ')
        console.log('-----------------------------------------------------------------')
        console.log(err.message.substring(0, 500))
        console.log('-----------------------------------------------------------------')
      }

      // Return the connection to the JDBC connection pool
      console.log(' - Returning connection to JDBC connection pool')
      jdbcPool.release(connObj, function (err) {
        if (err) {
          console.log(err.message);
        }
      });
    });
  }

});

// End of source file

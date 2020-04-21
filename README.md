# Dremio Example Node.js JDBC Application

This repo contains an small example application that shows how to connect to a Dremio server from a Node.js command line application.

## Use this repo

     $ git clone https://github.com/gregpalmr/dremio-example-nodejs-jdbc-app
     $ cd dremio-example-nodejs-jdbc-app

## Run the example Dremio Node.js application: 

     $ node app.js <server> <port> <schema> <user> <password>

     example:

     $ node app.js dremio.org 31010 'Business.Transportation' 'greg@dremio.com' '<password>'

## Build the example Dremio Node.js application: 

    1. Before running this app, install Node.js and the node package manager (npm):
   
       Download and install Node.js from https://nodejs.org/en/ 

    2. Before running this app, install the required Node.js packages:
   
       $ npm install --save java
       $ npm install --save jdbc
       $ npm install --save async
   
    3. Before running this app, download and install the Dremio JDBC driver: 
   
       Download the Dremio JDBC driver installer from https://www.dremio.com/drivers/
       Copy the Dremio JDBC driver jar file the ./drivers directory under this application's home directory
   
    4. This app queries the Dremio samples data source named Samples."samples.dremio.com"."NYC-taxi-trips". 
       However, you must first create a Dremio Virtual Data Source (VDS) object that points to the data source
       and that builds a raw reflection containing all columns and an aggregation reflection on the following columns:
   
       Dremio aggregation reflection definition for the new VDS "NYC TRIPS":
   
            Dimension                                 Measure COUNT                  Measure SUM
            ---------------------                     -----------------------        -----------------------
            pickup_datetime                           pickup_datetime	

                                                      passenger_count                passenger_count

                                                      trip_distance_mi               trip_distance_mi

    5. Compile and run the app.js source file:

       $ npm install
       $ node app.js dremio.org 31010 'Business.Transportation' 'greg@dremio.com' '<password>'

## Example output

	$ node app.js dremio.org 31010 'Business.Transportation' 'greg@dremio.com' '<gregs password>'

	 - Pulling connection from the JDBC connection pool
	 - Using JDBC connection: 13ae3cc8-c66e-4d60-846c-e68c72d3c767
	 - SUCCESS executing SQL Command: SELECT * FROM Business.Transportation."NYC Trips" LIMIT 12000
	 - Dremio Server Query Time: 0.734 seconds

	pickup_datetime           | passenger_count          
	------------------------- | -------------------------
	2012-04-30 08:36:20.0     | 1                        
	2012-04-30 08:27:28.0     | 1                        
	2012-04-30 08:36:44.0     | 1                        
	2012-04-30 08:44:59.0     | 1                        
	2012-04-30 08:43:55.0     | 1                        
	2012-04-30 08:45:35.0     | 1                        
	2012-04-30 08:31:39.0     | 1                        
	2012-04-30 08:35:59.0     | 1                        
	2012-04-30 08:30:17.0     | 1                        
	2012-04-30 08:36:49.0     | 1                        
	2012-04-30 08:46:58.0     | 1                        
	2012-04-30 08:31:28.0     | 1                        
	2012-04-30 19:35:31.0     | 1                        
	2012-04-30 08:26:39.0     | 1                        
	2012-04-30 08:33:01.0     | 1                        
	2012-04-30 08:43:38.0     | 1                        
	2012-04-30 08:31:37.0     | 1                        
	2012-04-30 08:27:10.0     | 3                        
	2012-04-30 08:30:56.0     | 2                        
	2012-04-30 08:35:24.0     | 1                        

	... skipping remainder of rows ...

	Total records transferred from Dremio server: 12000 - transferred in 7.805 seconds 

	 - Returning connection to JDBC connection pool


### QUESTIONS/COMMENTS: 

     Direct questions or comments to greg@dremio.com


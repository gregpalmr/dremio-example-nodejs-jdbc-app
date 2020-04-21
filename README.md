# Dremio Example Node.js JDBC Application

This repo contains an small example application that shows how to connect to a Dremio server from a Node.js command line application.

## Using the Node.js app:: 

     $ npm install
     $ app.js <server> <port> <schema> <user> <password>

     example:

     $ npm install
     $ app.js dremio.org 31010 'Business.Transportation' 'greg@dremio.com' '<password>'

## Building the Node.js App: 

    1. Before running this app, install the Node.js and the node package manager (npm):
   
       Download and install Node.js from https://nodejs.org/en/ OR https://nodejs.org/dist/v12.16.2/node-v12.16.2.pkg
   
    2. Before running this app, install the required Node.js packages:
   
       $ npm install --save java
       $ npm install --save jdbc
       $ npm install --save async
   
    3. Before running this app, download and install the Dremio JDBC driver: 
   
       Download the Dremio JDBC driver installer from https://www.dremio.com/drivers/
       Copy the Dremio JDBC driver jar file to ./drivers
   
    4. This app queries the Dremio samples data source named Samples."samples.dremio.com"."NYC-taxi-trips". 
       However, you must first create a Dremio Virtual Data Source (VDS) object that points to the data source
       And implements a raw reflection containing all columns and an aggregation reflection on the following columns:
   
       Dremio aggregation reflection definition for VDS "NYC_TRIPS":
   
            Dimension                                 Measure COUNT                  Measure SUM
   
            pickup_datetime
                                                      pickup_datetime	
                                                      passenger_count               passenger_count
                                                      trip_distance_mi              trip_distance_mi
   
### QUESTIONS/COMMENTS: Direct questions or comments to greg@dremio.com


# Dremio Example Node.js JDBC Application

This repo contains an small example application that shows how to connect to a Dremio server from a Node.js command line application.

## Use this repo

     $ git clone https://github.com/gregpalmr/dremio-example-nodejs-jdbc-app
     $ cd dremio-example-nodejs-jdbc-app

## Create the sample Dremio data source (NYC Taxi Rides)

This example Node.js application queries a sample Dremio data source called the NYC Taxi Ride data. By default, the sample data sources in Dremio are not pre-staged and therefore, the target data source must be setup. This section provides the steps to setup the NYC Taxi Rides data source in Dremio.

As an overview, you will be creating a virtual data source (VDS) based on the physical data source (PDS) named "Samples"."samples.dremio.com"."NYC-taxi-trips". 

You will create a Dremio VDS object that points to the physical data source and that builds a raw reflection containing all columns and an aggregation reflection on the following columns:
   
Dremio aggregation reflection definition for the new VDS "NYC TRIPS":
   
                       Dimension                                 Measure COUNT                  Measure SUM
            ---------------------                     -----------------------        -----------------------
            pickup_datetime                           pickup_datetime	

                                                      passenger_count                passenger_count

                                                      trip_distance_mi               trip_distance_mi

     1. Start the open source version of Dremio on your computers (requires Docker desktop to be installed)

         ### Pull down the latest docker image

         $ docker pull dremio/dremio_oss:latest

         ### Run the docker image (increase the default max memory to 6 GB)

         $ docker run -p 9047:9047 -p 31010:31010 -p 45678:45678 dremio/dremio-oss:latest

         ### When Dremio has completed its start up process, point your web browser to: 

         http://localhost:9047

         ### Register your first user (the admin user)

         ### Add a new space in Dremio

- Click on the "Add Space" button to create a new space (folder)

- Name the new space "NYC-Taxi" and click on the "Save" button.


# Add the sample data sources in Dremio

- Click on the "Add Sample Source" button to add "NYC-taxi-trips" sample data. This data set contains over a billion rows of NYC Taxi ride data from 2009 to 2015.

- Click on the "Samples" link under the "Sources" section on the left.

# Create a new Virtual Data Source or VDS for NYC taxi trips

- Click on the "sample.dremio.com" source group 

- On the "NYX-taxi-trips" data source line, hover your mouse over the Action column to display the popup action represented by a [folder > format folder] icon. Click on that popup icon.

- After some taxi ride records are displayed, click on the "Save" button

- Now save this new VDS into the new space created above.  Click on the down arrow next to the floppy disk icon on the upper right, and select the "Save As" option.

- In the "Save Dataset As" window, enter the name "trips" and click on the "NYX-Taxi" space.

- Click on the "Save" button to save this new VDS in the new space.

- View the new VDS by clicking on the Dremio logo on the upper left of the page and then clicking on the "NYC-Taxi" space under the Spaces section.

# Add reflections to this VDS, to improve query performance.

- In the "NYC-Taxi" space, click on the "trips" VDS, this will bring up a new "SQL Editor" window.

- Click on the "Reflections" link at the top of the window.

- Click on the "Switch to Advanced" button on the upper right of the window.

- In the "Raw Reflections" tab, click on the "Raw Reflections" toggle button to enable raw reflections.

- By default, all the columns in the VDS will be included in the raw reflection. Keep those settings.

- Click on the "Aggregation Reflections" tab.

- Click on the "Aggregation Reflections" toggle button to enable aggregation reflections.

- By default, the date and integer typed columns will be flagged as dimensions and the float typed columns will be flagged as measures.

- Add  a new Aggregation reflection for the pickup date time measure.

- Click the "New Rflection" button on the upper right of the window.

- Change the default name of the reflection, "Aggregation Reflection (1)", with the name "Pickup_Date_Pass_Count".

- Click on the "Dimension" cell for the "pickup_datetime" column.

- Click on the "Measure" cell for the "pickup_datetime" and "passenger_count" columns.

- For the "pickup_datetime" measure, click on the down arrow icon to display the aggregation types. Uncheck the "SUM" type and leave only the "COUNT" type.

- Click on the "Save" button.

- Now save this new VDS into the new space created above.  Click on the down arrow next to the floppy disk icon on the upper right, and select the "Save As" option.



## Run the example Dremio Node.js application: 

     $ node app.js <server> <port> <schema> <user> <password>

     example:

     $ node app.js dremio.org 31010 '@greg@dremio.com' 'greg@dremio.com' '<password>'

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
       $ node app.js dremio.org 31010 '@greg@dremio.com' 'greg@dremio.com' '<password>'

## Example output

	$ node app.js dremio.org 31010 '@greg@dremio.com' 'greg@dremio.com' '<gregs password>'

	 - Pulling connection from the JDBC connection pool
	 - Using JDBC connection: 13ae3cc8-c66e-4d60-846c-e68c72d3c767
	 - SUCCESS executing SQL Command: SELECT * FROM "@greg@dremio.com"."NYC Trips" LIMIT 12000
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


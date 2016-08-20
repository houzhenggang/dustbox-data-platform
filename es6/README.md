# Name

Dust Box Data Platform

# Dependencies

* nodeJS
* expressJS
* mongo 2.6 or higher

# Nodejs installation (Ubuntu Linux)

Ubuntu 16.04 contains a version of Node.js in its default repositories that can be used to easily provide a consistent experience across multiple systems. At the time of writing, the version in the repositories is v4.2.6. This will not be the latest version, but it should be quite stable, and should be sufficient for quick experimentation with the language.

In order to get this version, we just have to use the apt package manager. We should refresh our local package index first, and then install from the repositories:

	$ sudo apt-get update
	$ sudo apt-get install nodejs

Node.js package manager:

	$ sudo apt-get install npm

To get a more recent version of Node.js is to add a PPA (personal package archive) maintained by NodeSource. This will have more up-to-date versions of Node.js than the official Ubuntu repositories, and allows you to choose between Node.js v4.x and and v6.x:

	$ cd ~
	$ curl -sL https://deb.nodesource.com/setup_6.x -o nodesource_setup.sh

And run the script under sudo:

	$ sudo bash nodesource_setup.sh

The PPA will be added to your configuration and your local package cache will be updated automatically. After running the setup script from nodesource, you can install the Node.js package in the same way that you did above:

	$ sudo apt-get install nodejs

The nodejs package contains the nodejs binary as well as npm, so you don't need to install npm separately. However, in order for some npm packages to work (such as those that require compiling code from source), you will need to install the build-essential package:

	$ sudo apt-get install build-essential

Test:

	$ node -v
	// v6.3.1

@refs:
* https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-16-04

# MongoDB installation (Ubuntu Linux)

1. Install mongodb server:

    `$ sudo apt-get install mongodb-server`

Check version:

    `$ mongo --version` or `$ mongod --version`

Check status:

    `$ sudo service mongodb status`

Ref:
* https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/

5. Start MongoDB from the Command Prompt,

    `$ mongod`

6. Connect to MongoDB - open another Command Prompt (MongoDB Shell),

    `> mongo`

7. Show all database,

    `show dbs`

@ref:
* https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/

# MongoDB installation (Arch Linux)

1. Log in the server (if you are on a remote server):

    $ ssh citizensense@139.162.208.52

    Then type in your password to get access.

2. Before proceeding further, make sure your package databases are up to date with:

    $ sudo pacman -Sy

3. Type the normal command for searching pacman repositories is:

    $ pacman -Ss mongodb

4. The typical way to install or upgrade a standard package is pacman -S.

    $ sudo pacman -S mongodb

5. Getting Information - pacman -Qi displays basic information about an installed package:

    $ pacman -Qi mongodb

    Name            : mongodb
    Version         : 3.2.6-2
    Description     : A high-performance, open source, schema-free document-oriented database
    Architecture    : x86_64
    URL             : http://www.mongodb.org
    Licenses        : AGPL3
    Groups          : None
    Provides        : None
    Depends On      : pcre  snappy  openssl  libsasl  boost-libs  yaml-cpp  wiredtiger
    Optional Deps   : libpcap: needed for mongosniff [installed]
                      mongodb-tools: mongoimport, mongodump, mongotop, etc
    Required By     : None
    Optional For    : None
    Conflicts With  : None
    Replaces        : None
    Installed Size  : 102.28 MiB
    Packager        : Bartlomiej Piotrowski <bpiotrowski@archlinux.org>
    Build Date      : Fri 13 May 2016 09:40:18 AM BST
    Install Date    : Thu 30 Jun 2016 05:24:15 AM BST
    Install Reason  : Explicitly installed
    Install Script  : Yes
    Validated By    : Signature

6. Start/Enable the mongodb.service daemon:

    $ sudo systemctl start mongodb.service

    Check mongo verison:

    $ mongo --version
    MongoDB shell version: 3.2.6

7. To access the Database shell type in the terminal:

    $ mongo

8. To start working mongo:

    > show dbs
    local  0.000GB

    And so on...

@ref:
* https://wiki.archlinux.org/index.php/MongoDB#Installing_MongoDB
* https://www.digitalocean.com/community/tutorials/how-to-use-arch-linux-package-management

# Project (ExpressJS) Installation

1. Open terminal and type:

    `sudo npm install express-generator -g`

    The generator should auto-install, and since it (like all packages installed with -g) lives in your master NPM installation directory, it should already be available in your system path. So let's use our generator to create the scaffolding for a website.

2. Generate skeleton/ project

    $ express mongoose-iot

3. Update package.json:

    change:

    "jade": "~1.0.0",

    to:

    "pug": "~2.0.0-beta3",

4. Install dependencies:

    $ cd mongoose-iot
    $ sudo npm install

5.  All these packages will be installed with the –save argument so that they are automatically added to the package.json file:

    $ sudo npm install mongoose connect-mongo express-session method-override bcrypt hat --save

6. Upgrade jade to pug in app.js:

    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');

    to:

    app.set('view engine', 'pug');

7. Change jade ext to pug in views/.

8. Run the app

    DEBUG=mongodb:* npm start

    Or better (for development):

    nodemon

9. Now access the app on your browser:

    http://127.0.0.1:3000/

## Recommended location of node.js applications in linux filesystem

The most appropriate place would be under /srv.

	$ cd /srv
	$ sodu mkdir data-platform
	$ sudo chmod -R ugo+rw /srv/data-platform

@ref:
* http://unix.stackexchange.com/questions/35807/recommended-location-of-node-js-applications-in-linux-filesystem

## How to Use PM2 With Express to Keep a NodeJS Server Running

### Localhost

	$ cd /srv/data-platform
	$ pm2 start bin/www

	http://127.0.0.1:3000/

/usr/local/lib/node_modules/phant/lib/http_input.js
/usr/local/lib/node_modules/phant/node_modules/phant-manager-http/public/css/phant.css

### Live Server

	$ cd /usr/local/chroot/csshiny/data-platform
	$ pm2 start bin/www

	http://139.162.208.52:3000/

### Notes

#### Kill all sites

$ pm2 kill

# Imp

1. To access Imp ide, go to:

    https://electricimp.com/platform/

2. Click Sign In or:

    https://ide.electricimp.com/login

    Login details:
    Username: lauthiamkok
    Email: lau.thiamkok@yahoo.co.uk
    password: @rbit2****3

3. Click citizensense from the drop-down menu on the top left.

4. Select Shinyei. And change the details below to the one you got from phant:

    ```
    local publicKey = "GNeOz8WmgZfODGVLeyV0ixLK3NB"; // Your Phant public key
    local privateKey = "D5Yl9d3GPQCmR9N0nKNZFGeXK54"; // The Phant private key
    local phantServer = "139.162.208.52:8080"; // Your Phant server, base URL, no HTTP
    ```

    Examples:

        1.
        https://data.sparkfun.com/streams/2JYaQ3brGGTLVDl27Ro3
        https://data.sparkfun.com/streams/JxJMDzYb3rINqzq5Wb1d

        2.
        http://10.124.13.7:8080/
        http://10.124.13.7:8080/streams/xgG6APJAPlslOjNa4ye4iZgGXYm

        Public Key
        xgG6APJAPlslOjNa4ye4iZgGXYm

        Private Key
        gv5KDm0Dm9imWv2bzxRzTOZ0aAX

        Delete Key
        7D4ba9Ga9JixdwbQP62PhoNQJ3V

        Format:
        http://10.124.13.7:8080/input/[publicKey]?private_key=[privateKey]&particles=[value]&timestamp=[value]

        Example:
         http://10.124.13.7:8080/input/xgG6APJAPlslOjNa4ye4iZgGXYm?private_key=gv5KDm0Dm9imWv2bzxRzTOZ0aAX&particles=11.18&timestamp=6.15

        Deleting a stream
        http://10.124.13.7:8080/streams/xgG6APJAPlslOjNa4ye4iZgGXYm/delete/7D4ba9Ga9JixdwbQP62PhoNQJ3V

        3.
        Public URL
        http://139.162.208.52:8080/streams/oqwxVyPEb4cQvZb3PGGMUMvJXVk

        Public Key
        oqwxVyPEb4cQvZb3PGGMUMvJXVk

        Private Key
        RG08rZ57vdT9RagdWQQbhRjLENn

        Delete Key
        ZE3ayN6A91T3EekQx77pcqBv87O

        http://139.162.208.52:8080/
        http://139.162.208.52:8080/streams/GNeOz8WmgZfODGVLeyV0ixLK3NB
        http://139.162.208.52:8080/input/GNeOz8WmgZfODGVLeyV0ixLK3NB?private_key=D5Yl9d3GPQCmR9N0nKNZFGeXK54&particles=29.14&timestamp=6.98

5. Click 'build' and wait for the data to be sent to your platform, such as phant.

## Notes:

1. Express-generator

With express 4 the express boilerplate generator command line was extracted to it's own module 'express-generator' because the generator app did not really share code with express web framework and express and generator app can be released independently.

I guess this was a step into the right direction to decouple the web framework from the boilerplate/skeleton generator since this makes express even more lightweight and leverages tools like yeoman that focus on generating things.

@ref: http://stackoverflow.com/questions/23367534/what-is-the-different-between-express-and-express-generator

2. Nodemon

A utility that will monitor for any changes in your source and automatically restart your server. We will use it instead of node to run our application, this way we won’t need to restart the server after each modification.

Install Nodemon - globally:

    $ sudo npm install nodemon -g

3. Application dependencies

    * Mongoose : our ODM (Object Data Manager).
    * Connect-mongo : used to store the user’s session information in the database.
    * Express-session : a standard session manager for Express.js.
    * Method-override : this package will be used in order to pass PUT and DELETE requests though POST requests.
    * Bcrypt : for password hashing.
    * Hat : to generate unique API keys.

# Set up the app

We need to make a few changes to the app.js file. First let’s import the packages we just installed.

    After:

    var express = require('express');
    ...
    ...
    var bodyParser = require('body-parser');

    Add:

    //  Import the packages we just installed :
    var methodOverride = require("method-override");
    var mongoose = require("mongoose");
    var session = require("express-session");
    var MongoStore = require("connect-mongo")(session);

# Hook mongodb up to the app

1. Add lines below in app.js after `var bodyParser = require('body-parser');`

    // Connect to mongodb
    mongoose.connect("mongodb://localhost/iotdb", function(err) {
        if (err) throw err;
        console.log("Successfully connected to mongodb");
    });

2. Scroll until you see:

    app.use('/', routes);
    app.use('/users', users);

    Those app.use statements (along with the others you'll find in app.js) are establishing middleware for Express. The short, simple explanation is: they're providing custom functions that the rest of your app can make use of. It's pretty straightforward, but due to chaining it needs to come before our route definitions, so that they can make use of it.

3. Above the two lines just mentioned, add the following:

    // Make our db accessible to our router
    app.use(function(req,res,next){
        req.db = db;
        next();
    });

# Hook other middlewares up to the app

Before:

    app.use('/', routes);
    app.use('/users', users);

We need to add 3 middlewares:

    // We use mongodb to store session info
    // expiration of the session is set to 7 days (ttl option)
    app.use(session({
        store: new MongoStore({mongooseConnection: mongoose.connection,
                              ttl: 7*24*60*60}),
        saveUninitialized: true,
        resave: true,
        secret: "MyBigBigSecret"
    }));

    // used to manipulate post requests and recongize PUT and DELETE operations
    app.use(methodOverride(function(req, res){
          if (req.body && typeof req.body === "object" && "_method" in req.body) {
            // look in urlencoded POST bodies and delete it
            var method = req.body._method
            delete req.body._method
            return method
          }
    }));

1. express-session

    It is used to store the user’s session info, which is pretty handy if you want to keep him logged in between views (and to ensure that a user has been authenticated before accessing protected resources). We will also use it in order to pass messages between the views.

2. connect-mongo

    It is used to store the session’s informations in the database.

3. method-override

    We will configure method-override to look for a hidden field called ‘_method’ in our POST requests. This way we will be able to post PUT and DELETE requests as well.

# Pull data from mongo and display it

1. Go to route/index.js, add a new route:

    /* GET Userlist page. */
    router.get('/userlist', function(req, res) {
        var db = req.db;
        var collection = db.get('users');
        collection.find({},{},function(e,docs){
            res.render('userlist', {
                "userlist" : docs
            });
        });
    });

2. Go to view/ add a new view - userlist.jade with:

    extends layout

    block content
        h1.
            User List
        ul
            each user, i in userlist
                li

3. Restart the app:

    $ npm start

4. Go to http://127.0.0.1:3000/userlist then you will the list of users.

# Refs

* http://digitaljunky.io/make-your-own-data-platform-for-the-internet-of-things-using-node-js-and-express-js/
* http://webapplog.com/jade/

# Important notes to the users/ admins

1. Warning: If you change your field definitions, all of your existing stream data will be cleared.

    You have changed the field definitions, and must clear your stream data to save the new definition. Are you sure you want to continue?
    OK/Cancel

2. Site Routes

    * List all streams:
    http://127.0.0.1:8080/streams/

    * Create a stream:
    http://127.0.0.1:8080/streams/make

    * Public url:
    http://127.0.0.1:8080/streams/[publicKey]
    http://127.0.0.1:8080/streams/1j1dGKrXwmFAyENNNPPAtyVmDKvW

    * Logging using query string parameters. Format:
    http://127.0.0.1:8080/input/[publicKey]?private_key=[privateKey]&no2=[value]&particles=[value]

    * Editing a stream:
    http://127.0.0.1:8080/streams/[publicKey]/edit/[privateKey]
    http://127.0.0.1:8080/streams/60BlygZpoZCq2e4Dpe0QtvvYp9A/edit/mXry9xd7pdCVwAxKBA9QfOO8qmx

    * Deleting a stream:
    http://127.0.0.1:8080/streams/[publicKey]/delete/[deleteKey]
    http://127.0.0.1:8080/streams/1j1dGKrXwmFAyENNNPPAtyVmDKvW/delete/44G6yPW9Rghwdl111XXwTnWANv3V

# MongoDB cheatsheet

1. Connect to MongoDB, open terminal and type:

    $ mongo

2. List dbs:

    > show dbs

3. Create a db:

    > use userdb

4. Select a db:

    > use userdb

    local   0.078125GB
    userdb    0.203125GB

5. Create a new collection:

    > db.createCollection(name, options)

6. Drop a collection:

    > db.collection.drop()

7. Drop all collections:

    > db.getCollectionNames().forEach(function(c) { if (c.indexOf("system.") == -1) db[c].drop(); })

    or:

    db.dropDatabase()

8. List all collections in a db:

    > db.getCollectionNames()

9. Find All Documents in a Collection:

    > db.users.find()

10. Remove all docs or one in a collection:

    > db.collection.remove()

    Remove one:

    > db.collection.deleteOne()

    @ref: https://docs.mongodb.com/manual/tutorial/remove-documents/

11. Drop a db:

    > use mydb
    switched to db mydb

    > db.dropDatabase()
    > { "dropped" : "mydb", "ok" : 1 }

@ref:
http://www.tutorialspoint.com/mongodb/index.htm

# Troubleshooting

## Failed to load c++ bson extension

{ [Error: Cannot find module '../build/Release/bson'] code: 'MODULE_NOT_FOUND' } js-bson: Failed to load c++ bson extension, using pure JS version

Basically, what's happening is: during the initial "npm install" process, the MongoDB module tried to create a couple of files using Python v2.7. If you don't happen to have that installed (even if you have a higher version of Python, it won't work), then it can't build the files, so it falls back on a JavaScript-driven system instead. This system works just fine, but in a production environment with a lot of data handling, it can be slow, so it's better to have the binaries.

Solution:

    1. Install Python 2.7 (this will not impact existing Python 3.x installs).
    2. Delete your node_modules directory and everything in it.
    3. Re-run npm install in your nodetest1 directory from the command line.

## Port 3000 is already in use

[nodemon] Internal watch failed: watch /var/www/js-node-frameworks/express/mongoose-iot ENOSPC
lau@lau-thiam-kok:/var/www/js-node-frameworks/express/mongoose-iot$ Port 3000 is already in use

Solution:

$ lsof -i:3000
$ kill -9 <PID>

Or restart your server/ machine.

## The fields in a document are reordered (sorted alphabetically) when setting a field value.

This is the issue: jira.mongodb.org/browse/SERVER-2592, it has since been fixed in 2.6

In MongoDB 2.6 updates will preserve field order, with the following exceptions:

- The _id field is always the first field in the document.
- Updates that include renaming of field names may result in the reordering of fields in the document.

Solution:

* 1. Check what version you have:

    $ mongo --version
    MongoDB shell version: 2.4.9

* 2. Upgrade to 2.6.

@Ref:
http://stackoverflow.com/questions/22904167/mongo-db-update-changing-the-order-of-object-fields
http://stackoverflow.com/questions/38090771/mongoose-mongo-why-does-set-auto-sort-the-data-keys-on-update
https://jira.mongodb.org/browse/SERVER-2592
https://docs.mongodb.com/master/release-notes/2.6/#insert-and-update-improvements

## Mongo upgrade to 2.6 - Unable to locate package mongodb-org

Following the https://docs.mongodb.com/manual/release-notes/2.6-upgrade/ to upgrade my mongo 2.4 to 2.6, you might get an error below:

    $ sudo apt-get update
    $ sudo apt-get install mongodb-org

    Reading package lists... Done
    Building dependency tree
    Reading state information... Done
    E: Unable to locate package mongodb-org

Solution:

* Step 1: Import the MongoDB public key:

    $ sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10

* Step 2: Generate a file with the MongoDB repository url:

    $ echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list

* Step 3: Refresh the local database with the packages:

    $ sudo apt-get update

* Step 4: Install the last stable MongoDB version and all the necessary packages on our system:

    $ sudo apt-get install mongodb-org

@ref:
http://stackoverflow.com/questions/28945921/e-unable-to-locate-package-mongodb-org

## mongo: /usr/lib/libstdc++.so.6: version `GLIBCXX_3.4.22' not found (required by mongo) - Arch Linux

Solution:

Upgrade packages (which will include libstdc++) - Pacman provides a way to upgrade all of your packages at once, but it is not recommended because Arch is a rolling release distribution. If problems arise, it can take time to determine what the causes are:

    $ sudo pacman -Syu

Then:

    $ strings /usr/lib/libstdc++.so.6 | grep GLIBCXX

You should see GLIBCXX_3.4.22 in the list. To get the package info:

    $ pacman -Qo /lib/libstdc++.so.6
    /usr/lib/libstdc++.so.6 is owned by gcc-libs 6.1.1-2

    It was:

    /usr/lib/libstdc++.so.6 is owned by gcc-libs 5.3.0-4

Then:

    $ pacman -Qs gcc-libs
    local/gcc-libs 6.1.1-2 (base)
        Runtime libraries shipped by GCC

    It was:

    local/gcc-libs 5.3.0-4 (base)
    Runtime libraries shipped by GCC

https://bbs.archlinux.org/viewtopic.php?pid=1629966#p1629966
http://unix.stackexchange.com/questions/293022/arch-linux-mongodb-glibcxx-3-4-22-not-found

3.
$ sudo npm start

> iot@1.0.0 start /usr/local/chroot/csshiny/data-platform
> node ./bin/www

/usr/local/chroot/csshiny/data-platform/node_modules/bindings/bindings.js:83
        throw e
        ^

Error: Module version mismatch. Expected 48, got 47.
    at Error (native)
    at Object.Module._extensions..node (module.js:568:18)
    at Module.load (module.js:458:32)
    at tryModuleLoad (module.js:417:12)
    at Function.Module._load (module.js:409:3)
    at Module.require (module.js:468:17)
    at require (internal/module.js:20:19)
    at bindings (/usr/local/chroot/csshiny/data-platform/node_modules/bindings/bindings.js:76:44)
    at Object.<anonymous> (/usr/local/chroot/csshiny/data-platform/node_modules/bcrypt/bcrypt.js:3:35)
    at Module._compile (module.js:541:32)
    at Object.Module._extensions..js (module.js:550:10)
    at Module.load (module.js:458:32)
    at tryModuleLoad (module.js:417:12)
    at Function.Module._load (module.js:409:3)
    at Module.require (module.js:468:17)
    at require (internal/module.js:20:19)
    at Object.<anonymous> (/usr/local/chroot/csshiny/data-platform/models/user.js:5:14)
    at Module._compile (module.js:541:32)
    at Object.Module._extensions..js (module.js:550:10)
    at Module.load (module.js:458:32)
    at tryModuleLoad (module.js:417:12)
    at Function.Module._load (module.js:409:3)

npm ERR! Linux 4.4.0-x86_64-linode63
npm ERR! argv "/usr/bin/node" "/usr/bin/npm" "start"
npm ERR! node v6.2.2
npm ERR! npm  v3.10.2
npm ERR! code ELIFECYCLE
npm ERR! iot@1.0.0 start: `node ./bin/www`
npm ERR! Exit status 1
npm ERR!
npm ERR! Failed at the iot@1.0.0 start script 'node ./bin/www'.
npm ERR! Make sure you have the latest version of node.js and npm installed.
npm ERR! If you do, this is most likely a problem with the iot package,
npm ERR! not with npm itself.
npm ERR! Tell the author that this fails on your system:
npm ERR!     node ./bin/www
npm ERR! You can get information on how to open an issue for this project with:
npm ERR!     npm bugs iot
npm ERR! Or if that isn't available, you can get their info via:
npm ERR!     npm owner ls iot
npm ERR! There is likely additional logging output above.

npm ERR! Please include the following file with any support request:
npm ERR!     /usr/local/chroot/csshiny/data-platform/npm-debug.log

Solution:

$ sudo rm -rf node_modules
$ sudo npm update

@ref:
http://stackoverflow.com/questions/15584529/module-version-mismatch-expected-11-got-1

## 11000 E11000 duplicate key error index

Solution:

> db.users.getIndexes()
> db.users.dropIndex({"name":1})

@ref:
http://andrewkoroluk.com/blog/post/5533066b6098ef3d1b4c23c0
http://stackoverflow.com/questions/38347186/mongoose-caused-by-11000-e11000-duplicate-key-error-index

# Reminders

## The Difference Between [] and {}

Use brackets for an array of simple values.

    //examples
    var answers = ['yes','no','maybe'];
    var names = ['David','Kristina','Charlie','Angela'];

Use braces for key => value arrays and objects/properties.

    //example - random array
    var programmer = { 'name':'David Walsh', 'url':'https://davidwalsh.name', 'girl':'Kristina'}

    //example - used for an object's properties
    var Element.implement({
        getText: function(){
            return this.get('text');
        }
    });

This is similar to PHP's array system.

    $arr = array('name'=>'David','position'=>'Programmer');

@ref: https://davidwalsh.name/javascript-arrays-brackets-braces

## Given a version number

MAJOR.MINOR.PATCH

@ref: http://semver.org/

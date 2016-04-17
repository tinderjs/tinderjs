# tinderjs

  Programmatic access to the Tinder API

#### Contribution ####

tinderjs is a project that has a lot of potential if the power of the open-source community is harnessed. Come [join us on Slack](http://tinderjs.com) and view the [priorities list](https://github.com/tinderjs/tinderjs/wiki/Development-Priorities) to see how you can contribute, it is well appreciated!


## Installation

    $ npm install tinder


## Introduction

  tinderjs is a simple node.js wrapper around the Tinder API. Below is a simple example which gets a list of nearby profiles and prints them out:

```js
var tinder = require('tinder');
var client = new tinder.TinderClient();

client.authorize(
  <fb user token>,
  <fb user id>,
  function() {
    client.getRecommendations(10, function(error, data){
      console.log(data.results);
  });
});
```

## Supported APIs

### .authorize(fb token, fb id, callback)

  Authorizes the `TinderClient`. You must call this before any other method.

* `fb token` is a facebook user access token. You would acquire this by having your user log in using your application
* `fb id` is the id of the facebook user
* `callback` is called when the request completes

### .isAuthorized()

  Returns bool if TinderClient is authorized or not.

### .getAuthToken()

  Returns xAuthToken from authenticated user. Will be good if you want to save/cache the info.

### .getDefaults()

  Returns information from tinder about your client, where you can find your user data and also globals (e.g: `recs_size`)
  that allows you to interact where api timeouts and limits.

### .userId

  Once authorized, this property will be set the current account's Tinder user id. 

### .getRecommendations(limit, callback)

  Gets a list of nearby users.
  
* `limit` is how many results to limit the search to 
* `callback` is called when the request completes 

### .sendMessage(match id, message, callback)

  Sends a message to a user.

* `match id` is the match id
* `message` is the message to send.
* `callback` is called when the request completes

### .like(user id, callback)
  
  Likes (swipes right) on a user.
  
* `user id` is the user's id. This is obtained e.g  via `getRecommendations`
* `callback` is called when the request completes

### .superLike(user id, callback)

  Superlikes a user.

* `user id` is the user's id. This is obtained e.g  via `getRecommendations`
* `callback` is called when the request completes

### .pass(user id, callback)

  Passes (swipes left) on a user.
  
* `user id` is the user's id. This is obtained e.g  via `getRecommendations`
* `callback` is called when the request completes

### .unmatch(match id, callback)

  Unmatch with a user.

* `match id` is the match id
* `callback` is called when the request completes

### .getUpdates(callback)

  Gets a list of new updates. This will be things like new messages, users who liked you, etc. 
  
* `callback` is called when the request completes 

### .getHistory(callback)

  Gets the entire history for the current account (all matches, messages, blocks, etc.)
  
  NOTE: Old messages seem to not be returned after a certain threshold. Not yet sure what exactly that timeout is. The official client seems to get this update once when the app is installed then cache the results and only rely on the incremental updates

* `callback` is called when the request completes

### .updatePosition(longitude, latitude, callback)

  Updates the geographical position for the current account

* `longitude` is the longitude of the new position
* `latitude` is the latitude of the new position
* `callback` is called when the request completes

### .getAccount(callback)
  
  Gets the current account info

* `callback` is called when the request completes 

### .updatePreferences(discovery, min age, max age, gender, distance, callback)

  Updates the preferences for the current account

* `discovery` is the true/false that tells tinder whether or not to show your card
* `min age` is the minimum age of incoming recommendations
* `max age` is the maximum age of incoming recommendations
* `gender` is the gender of incoming recommendations (0 = Male, 1 = Female, -1 = Both)
* `distance` is the maximum distance in miles of incoming recommendations
* `callback` is called when the request completes

### .uploadPicture(file, callback)

  Upload a new picture to the current account. *Caution*: the picture must be a square and jpeg.

* `file` is the picture that you want to upload. e.g .uploadPicture(fs.createReadStream('./picture.jpeg'),callback)
* `callback` is called when the request completes

### .uploadFBPicture(picture id, xdistance_percent, ydistance_percent, xoffset_percent, yoffset_percent, callback)

  Post a new picture to the current account from Facebook

* `picture id` is the Facebook id of the picture
* `xdistance_percent` is the zoom percentage in x 0 full Zoom 1 no Zoom
* `ydistance_percent` is the zoom percentage in x 0 full Zoom 1 no Zoom
* `xoffset_percent` is the offset from the left corner in percentage
* `yoffset_percent` is the offset from the top corner in percentage
* `callback` is called when the request completes

### .deletePicture(picture id, callback)

  Delete a picture from the current account

* `picture id` is the id of the picture in string. This is obtained in the response of `getProfile`
* `callback` is called when the request completes

### .getProfile(callback)

  Get *your* user information, plus your preferences

### .updateGender(gender, callback)

  Update *your* gender

* `gender` is your gender  (0 = Male, 1 = Female)
* `callback` is called when the request completes

### .updateBio(bio, callback)

  Update *your* bio

* `bio` is your bio  (500 characters max.)
* `callback` is called when the request completes

### .updateJob(id, callback)

  Update *your* current job

* `id` id is the Facebook id of the job
* `callback` is called when the request completes

### .deleteJob(callback)

  Delete *your* current job

* `callback` is called when the request completes

### .updateSchool(id, callback)

  Update *your* current school

* `id` id is the Facebook id of the school
* `callback` is called when the request completes

### .deleteSchool(callback)

  Delete *your* current school

* `callback` is called when the request completes

### .deleteAccount(callback)

  Delete the current account

* `callback` is called when the request completes 

### .getUser(user id, callback)

  Gets a user by id

* `user id` is the user's id. This is obtained e.g  via `getRecommendations`
* `callback` is called when the request completes 

### .getShareLink(user id, callback)

  Get a share URL for a user

* `user id` is the user's id. This is obtained e.g  via `getRecommendations`
* `callback` is called when the request completes

### .report(user id, cause id, cause text, callback)

  Report a user

* `user id` is the user's id. This is obtained e.g  via `getRecommendations`
* `cause id` is one of 4 (inappropriate photos), 1 (spam), or 0 (other)
* `cause text` is the optional reason for report when the causeId is 0 (other)
* `callback` is called when the request completes 

### .createUsername(username, callback)

  Create a web username for the current account

* `username` is the username to request
* `callback` is called when the request completes 

### .changeUsername(username, callback)

  Change a web username for the current account if it's already been set

* `username` is the username to request
* `callback` is called when the request completes 

### .deleteUsername(username, callback)

  Deletes the existing web username for the current account

* `callback` is called when the request completes 

## Tinder plus

### .updatePassport(lat, lon, callback)

  Update the passport position

* `lat` latitude of the position
* `lon` longitude of the position
* `callback` is called when the request completes 

### .resetPassport(callback)

  Go back to your local position

* `callback` is called when the request completes 

## Examples

  The following example authorizes a client, gets some nearby profiles, likes all of them, and sends a message to any of the ones that match

```js
var tinder = require('tinderjs');
var client = new tinder.TinderClient();
var _ = require('underscore')

client.authorize(
  <fb user token>,
  <fb user id>,
  function() {

    var defaults = client.getDefaults()
    var recs_size = defaults.globals.recs_size;

    client.getRecommendations(recs_size, function(error, data){
      _.chain(data.results)
        .pluck('_id')
        .each(function(id) {
          client.like(id, function(error, data) {
            if (data.matched) {
              client.sendMessage(id, "hey ;)");
            }
          });
        });
    });
  });
});
```
    
### Disclaimer ###

This is not an official Tinder app and as such its usage may violate Tinder's TOS. As with any experimental technology you should use it with caution.

## License

  MIT

var TINDER_HOST = "https://api.gotinder.com/"
var TINDER_IMAGE_HOST = "https://imageupload.gotinder.com/"

var request = require('request');
require('request-debug')(request);
/**
 * Constructs a new instance of the TinderClient class
 *
 * @constructor
 * @this {TinderClient}
 */
function TinderClient() {
  var xAuthToken = null;
  this.lastActivity = new Date();
  var _this = this;

  /**
   * The current profile's user id
   */
  this.userId = null;

  /**
   * Helper for getting the request object
   * @param path {String} path the relative URI path
   * @param data {Object} an object of extra values
   */
  var getRequestOptions = function(path, data) {
    var options = {
      url: TINDER_HOST + path,
      json: data
    };

    var headers = {
        'User-Agent'      : 'Tinder Android Version 4.1.4',
        'os_version'      : '21',
        'platform'        : 'android',
        'app-version'     : '809',
        'Accept-Language' : 'en'
    };

    if (xAuthToken) {
        headers['X-Auth-Token'] = xAuthToken;
    }

    options.headers = headers;

    return options;
  };

  /**
   * Issues a GET request to the tinder API
   * @param  {String} path the relative path
   * @param  {Object} data an object containing extra values
   * @param  {Function} callback the callback to invoke when the request completes
   */
  var tinderGet = function(path, data, callback) {
    var opts = getRequestOptions(path, data);
    opts.method = 'GET';
    request(opts, callback);
  };

  /**
   * Issues a POST request to the tinder API
   * @param {String} path the relative path
   * @param {Object} data an object containing extra values
   * @param {Function} callback the callback to invoke when the request completes
   */
  var tinderPost = function(path, data, callback) {
    var opts = getRequestOptions(path, data);
    opts.method = 'POST';
    request(opts, callback);
  };

  /**
   * Issues a POST MULTIPART request to the tinder API
   * @param {String} path the relative path
   * @param {Object} an object containing the values to post
   * @param {Function} callback the callback to invoke when the request completes
   */
  var tinderMultipartPost = function(path, data, callback) {
    var opts = getRequestOptions(path, data);
    opts['url'] = TINDER_IMAGE_HOST + path;
    opts['formData'] = data;
    delete opts['json'];
    opts.method = 'POST';
    request(opts, callback);
  };

  /**
   * Issues a PUT request to the tinder API
   * @param {String} path the relative path
   * @param {Object} data an object containing extra values
   * @param {Function} callback the callback to invoke when the request completes
   */
  var tinderPut = function(path, data, callback) {
    var opts = getRequestOptions(path, data);
    opts.method = 'PUT';
    request(opts, callback);
  };

  /**
   * Issues a DELETE request to the tinder API
   * @param {String} path the relative path
   * @param {Object} data an object containing extra values
   * @param {Function} callback the callback to invoke when the request completes
   */
  var tinderDelete = function(path, data, callback) {
    var opts = getRequestOptions(path, data);
    opts.method = 'DELETE';
    request(opts, callback);
  };

  /**
   * Helper for transforming the request callback values
   * @param {Function} callback the callback
   */
  var makeTinderCallback = function(callback) {
    return function(error, res, body) {
      var data = null;

      if (!error) {
        if (typeof body === "string")
        {
          try
          {
            data = JSON.parse(body);
          } catch (err) {
            // todo
          }
        }
        else if (typeof body === "object") {
          data = body;
        }
      }

      if (data && data.status && data.status !== 200) {
        error = data;
      }

      if (callback) {
        callback(error, data);
      }
    };
  };

  /**
   * Gets a list of profiles nearby
   * @param {Number} limit the maximum number of profiles to fetch
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.getRecommendations = function(limit, callback) {
    tinderGet('user/recs',
      {
        limit: limit
      },
      makeTinderCallback(callback));
  };

  /**
   * Sends a message to a user
   * @param {String} matchId the id of the match
   * @param {String} message the message to send
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.sendMessage = function(matchId, message, callback) {
    tinderPost('user/matches/' + matchId,
      {
        message: message
      },
      makeTinderCallback(callback));
  };

  /**
   * Unmatch with a user.
   * @param {String} matchID the id of the match
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.unmatch = function(matchId, callback) {
    tinderDelete('user/matches/' + matchId,
      null,
      makeTinderCallback(callback));
  };

  /**
   * Swipes left for a user
   * @param {String} userId the id of the user
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.pass = function(userId, callback) {
    tinderGet('pass/' + userId,
      null,
      makeTinderCallback(callback));
  };

  /**
   * Swipes right for a user
   * @param {String} userId the id of the user
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.like = function(userId, callback) {
    tinderGet('like/' + userId,
      null,
      makeTinderCallback(callback));
  };

  /**
   * Superlikes a user
   * @param {String} userId the id of the user
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.superLike = function(userId, callback) {
    tinderPost('like/' + userId + '/super',
      null,
      makeTinderCallback(callback));
  };

  /**
   * Authorize this tinder client
   * @param {String} fbToken the Facebook token. This will be obtained when authenticating the user
   * @param {String} fbId the Facebook user id.
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.authorize = function(fbToken, fbId, callback) {
    tinderPost('auth',
      {
        facebook_token: fbToken,
        // facebook_id: fbId, // doesn't seem like we need the fbId now
        locale: 'en'
      },
      function(error, res, body) {
        // If no body is passed back, return an error
        if(body === undefined){
          error = new Error('No token passed back from Tinder')
        }

        var body = body || { 'token': null };
        if (!error && body.token) {
          xAuthToken = body.token;
          _this.userId = body.user._id;
          _this.defaults = body;

          callback = makeTinderCallback(callback);
          callback(error, res, body);
        } else if (body.error){
          error = "Failed to authenticate: " + body.error
          callback(error, res, body);
        } else {
          callback(error, res, body);
        }
      });
  };

  /**
   * Set auth token if you have it saved, no need to do fb login every time
   */
  this.setAuthToken = function(token) {
    xAuthToken = token;
  };

  this.getAuthToken = function() {
    return xAuthToken;
  };

  /**
   * Returns whether this client is authorized
   * @return whether or not this client is authorized
   */
  this.isAuthorized = function() {
    return xAuthToken != null;
  }

  /**
   * Returns the xAuthToken
   * @return xAuthToken
   */
  this.getAuthToken = function() {
    return xAuthToken || null;
  }

  /**
   * Returns client information and globals
   * Globals are used for interacting with tinder api limits
   */
  this.getDefaults = function() {
    return _this.defaults;
  }

  /**
   * Gets a list of new updates. This will be things like new messages, people who liked you, etc.
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.getUpdates = function(callback) {
    tinderPost('updates',
      {
        last_activity_date: _this.lastActivity.toISOString()
      },
      makeTinderCallback(function(err, data){
        if (data && data.last_activity_date) {
          _this.lastActivity = new Date(data.last_activity_date);
        }

        if (callback) {
          callback(err, data);
        }
      }));
  };

  /**
   * Gets the entire history for the user (all matches, messages, blocks, etc.)
   *
   * NOTE: Old messages seem to not be returned after a certain threshold. Not yet
   * sure what exactly that timeout is. The official client seems to get this update
   * once when the app is installed then cache the results and only rely on the
   * incremental updates
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.getHistory = function(callback) {
    tinderPost('updates',
      {
        last_activity_date: ""
      },
      makeTinderCallback(callback));
  };

  /**
   * Updates the position for this user
   * @param {Number} lon the longitude
   * @param {Number} lat the latitutde
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.updatePosition = function(lon, lat, callback) {
    tinderPost('user/ping',
      {
        lon: lon,
        lat: lat
      },
      makeTinderCallback(callback));
  };

  /**
   * Updates the preferences for this user
   * @param {Boolean} discovery whether or not to show user's card
   * @param {Number} ageMin the minimum age to show recommendations
   * @param {Number} ageMax the maximum age to show recommendations
   * @param {Number} gender the gender to show recommentations (0 = Male, 1 = Female, -1 = Both)
   * @param {Number} distance the distance in miles to show recommendations
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.updatePreferences = function(discovery, ageMin, ageMax, gender, distance, callback) {
    tinderPost('profile',
      {
        discoverable: discovery,
        age_filter_min: ageMin,
        age_filter_max: ageMax,
        gender_filter: gender,
        distance_filter: distance
      },
      makeTinderCallback(callback));
  };

  /**
   * Get authenticated user info
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.getProfile = function(callback) {
    tinderGet('meta',
      null,
      makeTinderCallback(callback));
  };

  /**
   * Update your gender
   * @param {Number} gender is your gender (0 = Male, 1 = Female)
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.updateGender = function(gender, callback) {
    tinderPost('profile',
      {
        gender: gender
      },
      makeTinderCallback(callback));
  };

  /**
   * Update your bio
   * @param {String} bio is you bio (500 characters max.)
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.updateBio = function(bio, callback) {
    tinderPost('profile',
      {
        bio: bio
      },
      makeTinderCallback(callback));
  };

  /**
   * Update your job
   * @param {String} id is the facebook id of the job
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.updateJob = function(id, callback) {
    tinderPut('profile/job',
      {
        "company": {
          "id": id
        }
      },
      makeTinderCallback(callback));
  };

  /**
   * Delete your current job
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.deleteJob = function(callback) {
    tinderDelete('profile/job',
      null,
      makeTinderCallback(callback));
  };

  /**
   * Update your school
   * @param {String} id is the facebook id of the school
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.updateSchool = function(id, callback) {
    tinderPut('profile/school',
      {
        "schools": [{
          "id": id
        }]
      },
      makeTinderCallback(callback));
  };

  /**
   * Delete your current school
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.deleteSchool = function(callback) {
    tinderDelete('profile/school',
      null,
      makeTinderCallback(callback));
  };

  /**
   * Post new user picture
   * @param {Buffer} file is the picture that you want to upload
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.uploadPicture = function(file, callback) {
    tinderMultipartPost('image?client_photo_id=ProfilePhoto' + new Date().getTime(),
      {
        userId: _this.userId,
        file: file
      },
      makeTinderCallback(callback));
  };

  /**
   * Post a new user picture from an existing Facebook picture
   * @param {String} pictureId is the facebook id of the picture
   * @param {Float} xdistance_percent is the zoom percentage in x 0 full Zoom 1 no Zoom
   * @param {Float} ydistance_percent is the zoom percentage in x 0 full Zoom 1 no Zoom
   * @param {Float} xoffset_percent is the offset from the left corner in percentage
   * @param {Float} yoffset_percent is the offset from the top corner in percentage
   * @param {Function} callback the callback to invoke when the request completes
   */

  this.uploadFBPicture = function(pictureId, xdistance_percent, ydistance_percent, xoffset_percent, yoffset_percent, callback) {
    tinderPost('media',
      {
        "transmit": "fb",
        "assets": [{
          "ydistance_percent": ydistance_percent,
          "id": id,
          "xoffset_percent": xoffset_percent,
          "yoffset_percent": yoffset_percent,
          "xdistance_percent": xdistance_percent
        }]
      },
      makeTinderCallback(callback));
  };

  /**
   * Delete picture from user profile
   * @param {String} pictureId the id of the picture
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.deletePictures = function(pictureId, callback) {
    tinderDelete('media',
      {
        assets: [pictureId]
      },
      makeTinderCallback(callback));
  };

  /**
   * Delete the account of the current user
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.deleteAccount = function(callback) {
    tinderDelete('profile',
      null,
      makeTinderCallback(callback));
  };

  /**
   * Get user by id
   * @param {String} userId the id of the user
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.getUser = function(userId, callback){
    tinderGet('user/' + userId,
      null,
      makeTinderCallback(callback));
  };

}

exports.TinderClient = TinderClient;

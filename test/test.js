var nockBack = require('nock').back;
var should = require('chai').should();
var tinder = require('./../tinder');
var client = new tinder.TinderClient();
var fs = require('fs');

var config = require('./config');
var TINDER_HOST = 'https://api.gotinder.com';
nockBack.fixtures = __dirname + '/nockFixtures'; 

if(config.online){
  nockBack.setMode('wild');
}else{
  nockBack.setMode('record');
}


var before = function(scope) {
  scope.filteringRequestBody = function(body, aRecordedBody) {
    if(body.last_activity_date != null){
      body.last_activity_date = aRecordedBody.last_activity_date;
    }
    return aRecordedBody;
  };
}

describe('Tinder Api tests',function(){
  
  describe('Auth',function(){
    it('should be able to authenticate',function(done){
      nockBack('auth.json', function(nockDone) {
        client.authorize(
          config.facebook_token,
          config.facebook_id,
          function(err,res) {
             should.exist(res);
             should.not.exist(err);
             nockDone();
             done();
          });
      });
    });
  })
    
  describe('Api Methods',function(){

    it('getAccount',function(done){
      nockBack('getAccount.json', function(nockDone) {
        client.getAccount(function(err,res){
          should.exist(res);
          res.should.have.property('status',200);
          should.not.exist(err);
          nockDone();
          done();
        });
      });
    });
    
    it('getRecommendations',function(done){
      nockBack('getRecommendations.json', function(nockDone) {
        client.getRecommendations(1,function(err,res){
          should.exist(res);
          res.should.have.property('status',200);
          should.not.exist(err);
          nockDone();
          done();
        });
      });
    });
  
    it('getUpdates',function(done){
      nockBack('getUpdates.json',{before: before}, function(nockDone) {
        client.getUpdates(function(err,res){
          should.exist(res);
          res.should.have.property('matches');
          should.not.exist(err);
          nockDone();
          done();
        });
      });
    });
    
    it('getHistory',function(done){
      nockBack('getHistory.json', function(nockDone) {
        client.getHistory(function(err,res){
          should.exist(res);
          res.should.have.property('matches');
          should.not.exist(err);
          nockDone();
          done();
        });
      });
    });
    
    it('getProfile',function(done){
      nockBack('getProfile.json', function(nockDone) {
        client.getProfile(function(err,res){
          should.exist(res);
          res.should.have.property('status',200);
          should.not.exist(err);
          nockDone();
          done();
        });
      });
    });
    
  });
  
});
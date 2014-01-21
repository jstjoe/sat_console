(function() {

  return {
    defaultState: 'loading',
    events: {
      'app.activated':'loadSettings',

      'getFilteredRatings.done':'parseRatings',
      'getAllRatings.done':'parseRatings'
    },
    requests: {
      getFilteredRatings: function(filter) {
        return { url: '/api/v2/satisfaction_ratings.json?score=' + filter };
      },
      getAllRatings: function() {
        return { url: '/api/v2/satisfaction_ratings.json' };
      }
    },
    //NAMED FUNCTIONS
    loadSettings: function() {
      var filter = this.setting('Default Filter'),
          autoLoad = this.setting('Auto Load');
      console.log("Load Settings Filter: " + filter);
      if (autoLoad===true) {
        console.log("AutoLoad: true");
        this.loadRatings(filter);
      } else{
        console.log("AutoLoad: false");
        this.switchTo('form');
      }
    },
    loadRatings: function(filter) {
      console.log("Loading ratings... w/ " + filter);
      if (filter == 'received | received_with_comment | received_without_comment good | good_with_comment | good_without_comment bad | bad_with_comment | bad_without_comment') {
        this.ajax('getFilteredRatings', filter);
      } else{
        this.ajax('getAllRatings');
      }
    },
    parseRatings: function(data) {
      var ratings = data.satisfaction_ratings;
      console.log(ratings[0]);
      this.ratings = ratings;
      this.switchTo('list', {
        ratings: this.ratings
      });
    }
  };

}());

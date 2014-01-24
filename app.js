(function() {

  return {
    defaultState: 'loading',
    events: {
      'app.activated':'loadSettings',
      'click .submit':'loadChoices',
      'click .show_form': function() {this.switchTo('form');},
      //request events
      'getFilteredRatings.done':'parseRatings',
      'getAllRatings.done':'parseRatings'
    },
    requests: {
      getFilteredRatings: function(filter) {
        return { url: '/api/v2/satisfaction_ratings.json?score=' + filter };
      },
      getAllRatings: function(filter) {
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
        //this.filter = filter;
      } else{
        console.log("AutoLoad: false");
        this.switchTo('form');
      }
    },
    loadChoices: function() {
      var filter = this.$('#filter_select').val();
      this.loadRatings(filter);
      //this.filter = filter;
    },
    loadRatings: function(filter) {
      if (filter == 'received' || filter == 'received_with_comment' || filter == 'received_without_comment' || filter == 'good' || filter == 'good_with_comment' || filter == 'good_without_comment' || filter == 'bad' || filter == 'bad_with_comment' || filter == 'bad_without_comment') {
        this.filter = filter;
        console.log("Loading ratings... w/ " + filter);
        this.ajax('getFilteredRatings', filter);
      } else{
        this.filter = 'none';
        console.log("Loading ratings... w/o a filter");
        this.ajax('getAllRatings');
      }
    },
    parseRatings: function(data) {
      var ratings = data.satisfaction_ratings;
      console.log(ratings[0]);
      this.ratings = ratings;
      this.switchTo('list', {
        ratings: this.ratings,
        filter: this.filter
      });
    }
  };

}());

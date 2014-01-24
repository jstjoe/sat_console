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
      getFilteredRatings: function(filter, next_page_url) {
        if (next_page_url) {
          return { url: next_page_url + '?score=' + filter };
        } else {
          return { url: '/api/v2/satisfaction_ratings.json?score=' + filter };
        }
        
      },
      getAllRatings: function(filter, next_page_url) {
        if (next_page_url) {
          return { url: next_page_url };
        } else {
          return { url: '/api/v2/satisfaction_ratings.json' };
        }
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
    loadRatings: function(filter, next_page_url) {
      if (filter == 'received' || filter == 'received_with_comment' || filter == 'received_without_comment' || filter == 'good' || filter == 'good_with_comment' || filter == 'good_without_comment' || filter == 'bad' || filter == 'bad_with_comment' || filter == 'bad_without_comment') {
        this.filter = filter;
        if (next_page_url) {
          console.log("Loading next page of ratings...\n ...w/ filter: " + filter + "\n  ...and url: " + next_page_url);
          this.ajax('getFilteredRatings', filter, next_page_url);
        } else {
          console.log("Loading ratings...\n ...w/ filter: " + filter + "\n  ...and no url(?) " + next_page_url);
          this.ajax('getFilteredRatings', filter);
        }
      } else{
        if (next_page_url) {
          this.filter = 'none';
          console.log("Loading next page of ratings...\n ...w/o a filter");
          this.ajax('getAllRatings', next_page_url);
        } else {
          this.filter = 'none';
          console.log("Loading ratings...\n ...w/o a filter");
          this.ajax('getAllRatings');
        }
      }
    },
    parseRatings: function(data) {
      var ratings = data.satisfaction_ratings;
      if (data.previous_page===null && data.next_page) {
        this.ratings = ratings;
        this.loadRatings(this.filter, data.next_page);
      } else if (data.previous_page && data.next_page && data.next_page != 'https://support.zendesk.com/api/v2/satisfaction_ratings.json?page=4') {
        this.ratings = this.ratings.concat(ratings);
        this.loadRatings(this.filter, data.next_page);
      } else if (data.previous_page===null && data.next_page===null) {
        this.ratings = ratings;
      } else {
        console.log("Stopping");
        this.switchTo('csv', {
        ratings: this.ratings,
        filter: this.filter
      });
      }
    }
  };

}());

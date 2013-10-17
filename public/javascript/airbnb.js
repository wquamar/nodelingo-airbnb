
(function() {
  var recordsMap = {};

  var recordTemplate;
  var recordDetailTemplate;

  var overlay;
  var filterPanel;

  var filterPanelShowing = true;

  var methods = {

    init: function() {
      overlay = $('#overlay');
      filterPanel = $('#filter-panel');

      // Compile templates.
      var source = $('#record-template').html();
      recordTemplate = Handlebars.compile(source);

      source = $('#record-detail-template').html();
      recordDetailTemplate = Handlebars.compile(source);

      // Handle filter panel button.
      $('#filter-btn').on('click', function() {
        methods.showFilterPanel(!filterPanelShowing);
      });

      // Handle add new record button.
      $('#new-rental-btn').on('click', function() {
        $('#addRentalModal').modal('show');
      });

      // Handle filter panel submits.
      $('#query-submit').on('click', function() {
        methods.renderRecords();
      });

      // Handle Enter and Esc keys.
      $(document).keyup(function(e) {
        if (e.which == 27) {  // Esc
          $('#myModal').modal('hide');
          $('#addRentalModal').modal('hide');
          methods.showFilterPanel(false);
        }
      });

      $('#query-checkin').datepicker();
      $('#query-checkout').datepicker();

      $('#addon-checkin').on('click', function() {
        $('#query-checkin').datepicker('show');
      });

      $('#addon-checkout').on('click', function() {
        $('#query-checkout').datepicker('show');
      });

      methods.renderRecords();
    },

    drawRecordDetail: function(data) {
      var html = recordDetailTemplate(data);
      $('#modal-container').empty().append(html);

      var bookBtn = $('#book-btn');
      bookBtn.off();
      bookBtn.on('click', function(e) {
        methods.bookRental(data.id);
        $('#myModal').modal('hide');
      });

      //$('#booking-bookstart').datepicker();
      //$('#booking-bookend').datepicker();
      $('#addon-bookstart').on('click', function() {
        $('#booking-bookstart').datepicker('show');
      });

      $('#addon-bookend').on('click', function() {
        $('#booking-bookend').datepicker('show');
      });

      $('#myModal').modal('show');
    },

    bookRental: function(id) {
      jQuery.ajax({
        url: 'http://localhost:3000/rentals/' + id + '/bookings',
        method: 'POST',
        data: {
          startDate: $('#booking-bookstart').val(),
          endDate: $('#booking-bookend').val()
        },

        success: function() {
          console.log('Booked.');
        }
      });
    },

    showFilterPanel: function(showPanel) {
      filterPanelShowing = showPanel;
      var panelHeight = filterPanel.css('height');

      if (filterPanelShowing) {
        filterPanel.show();
        filterPanel.css({
          'webkit-transform': 'translate3d(0, 0, 0)',
          'moz-transform': 'translate3d(0, 0, 0)',
          'transform': 'translate3d(0, 0, 0)'
        });
      } else {
        filterPanel.css({
          'webkit-transform': 'translate3d(0, -' + panelHeight + ', 0)',
          'moz-transform': 'translate3d(0, -' + panelHeight + ', 0)',
          'transform': 'translate3d(0, -' + panelHeight + ', 0)'
        });
      }
    },

    renderRecords: function() {
      overlay.show();
      var params = {
        url: '/rentals',
        //dataType: 'jsonp',

        data: {
          type: $('#query-type').val(),
          capacity: $('#query-guests').val(),
          checkin: $('#query-checkin').val(),
          checkout: $('#query-checkin').val(),
          price: $('#query-price').val()
        },

        success: function(records) {
          console.log(records);
          var mainContent = $('#main-content');
          var currentRecordRow = null;

          var children = $('#main-content').empty();

          for (var i = 0; i < records.length; i++) {
            var data = {
              id: records[i].id,
              //image: 'http://xanadu.logicparty.org:4000' + records[i].image_urls[0],
              image: 'http://localhost:3000' + records[i].image_url,
              title: records[i].title,
              price: '$' + records[i].price + ' per night',
              subtitle: records[i].type + ' - ' + records[i].location,
              bookings: records[i].bookings
            };

            recordsMap[records[i].id] = data;
            var html = recordTemplate(data);

            if (i % 3 === 0) {
              currentRecordRow = $('<div>').addClass('row-fluid');
            }

            currentRecordRow.append(html);
            mainContent.append(currentRecordRow);
          }

          $('.record-panel').on('click', function(e) {
            methods.drawRecordDetail(recordsMap[e.currentTarget.id]);
          });


          overlay.hide();
        }
      };

      jQuery.ajax(params);
    }
  }; // End methods.

  window.AirBnb = methods;
})();


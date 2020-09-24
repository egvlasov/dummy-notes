$(document).ready(function() {
  // open note from index
  $(document).on('click', '.open-note', function() {
    $.ajax({
      type: 'GET',
      url: '/notes/' + $(this).attr('id'),
      success: function(response) {
        $('.modal-content').html(response);
        $('.modal').modal('show');
      }
    });
  });

  // open modal with form for new note
  $(document).on('click', '#new-modal', function() {
    $.ajax({
      type: 'GET',
      url: '/notes/new',
      success: function(response) {
        $('.modal-content').html(response);
        $('.modal').modal('show');
      }
    });
  });

  // add new note and open it
  $(document).on('click', '#new-note', function() {
    $.ajax({
      type: 'POST',
      url: '/notes',
      data: {
        title: $('input[name=title]').val(),
        tags: $('input[name=tags]').val(),
        content: $('textarea[name=content]').val(),
        references: $('input[name=references]').val()
      },
      success: function(response) {
        $.ajax({
          type: 'GET',
          url: '/notes',
          success: function(response2) {
            $('.modal').modal('hide');
            $('.modal').on('hidden.bs.modal', function() {
              $('.container.py-3').html(response2);
              $('.modal-content').html(response);
              $('.modal').modal('show');
            });
          }
        });
      }
    });
  });

  // open edit modal from current note
  $(document).on('click', '#edit-note', function() {
    $.ajax({
      type: 'GET',
      url: '/notes/' + $('.modal-header').attr('data-note-id') + '/edit',
      success: function(response) {
        $('.modal').modal('hide');
        $('.modal').one('hidden.bs.modal', function() {
          $('.modal-content').html(response);
          $('.modal').modal('show');
        });
      }
    });
  });

  // delete current note and update index
  $(document).on('click', '#delete-note', function() {
    $.ajax({
      type: 'DELETE',
      url: '/notes/' + $('.modal-header').attr('data-note-id'),
      success: function(response) {
        $('.modal').modal('hide');
        $('.modal').on('hidden.bs.modal', function() {
          $('.container.py-3').html(response);
        });
      }
    });
  });

  // update index on searching by tag from current note
  $(document).on('click', '[data-search-tag]', function() {
    $.ajax({
      type: 'GET',
      url: '/notes',
      data: {
        search_tags: $(this).attr('data-search-tag')
      },
      success: function(response) {
        $('.modal').modal('hide');
        $('.modal').on('hidden.bs.modal', function() {
          $('.container.py-3').html(response);
        });
      }
    });
  });

  // open another note from current note
  $(document).on('click', '[data-ref-id]', function() {
    $.ajax({
      type: 'GET',
      url: '/notes/' + $(this).attr('data-ref-id'),
      success: function(response) {
        $('.modal').modal('hide');
        $('.modal').one('hidden.bs.modal', function() {
          $('.modal-content').html(response);
          $('.modal').modal('show');
        });
      }
    });
  });

  // cofirm editing and open edited note

  // close edit modal and open current note
});

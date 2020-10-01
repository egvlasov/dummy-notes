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

  // show matching tags
  $(document).on('keyup', "[name='tags']", function() {
    var value = $(this).val().toLowerCase();
    $("#tagsList li").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });

  // add chosen tag to input field
  $(document).on('click', '.item-tag', function() {
    $("[name='tags']").val($(this).text());
  });

  // add tag
  $(document).on('click', 'button.add-tag', function() {
    $('.tags-field').append("<button class='btn btn-sm btn-dark text-light border-0 ml-1 mb-1 added-tag'>" + $("[name='tags']").val() + "</button>");
    $("[name='tags']").val('');
  });

  // show matching references
  $(document).on('keyup', "[name='references']", function() {
    var value = $(this).val().toLowerCase();
    $("#referencesList li").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });

  // add reference
  $(document).on('click', '.item-reference', function() {
    $('.references-field').append("<button class='btn btn-sm btn-dark text-light border-0 ml-1 mb-1 added-reference' data-add-ref='" + $(this).attr('data-add-ref') + "'>" + $(this).text() + "</button>");
    $("[name='references']").val('');
  });

  // delete tag or reference
  $(document).on('click', '.added-tag,.added-reference', function() {
    $(this).remove();
  });

  // add new note and open it
  $(document).on('click', '#new-note', function() {
    $.ajax({
      type: 'POST',
      url: '/notes',
      data: {
        title: $('textarea[name=title]').val(),
        tags: $('button.added-tag').map(function() { return $(this).text(); }).get().join(' '),
        content: $('textarea[name=content]').val(),
        references: $('button.added-reference').map(function() { return $(this).attr('data-add-ref'); }).get().join(' ')
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
  $(document).on('click', '#confirm-editing', function() {
    $.ajax({
      type: 'PATCH',
      url: '/notes/' + $('.modal-header').attr('data-note-id'),
      data: {
        title: $('textarea[name=title]').val(),
        tags: $('button.added-tag').map(function() { return $(this).text(); }).get().join(' '),
        content: $('textarea[name=content]').val(),
        references: $('button.added-reference').map(function() { return $(this).attr('data-add-ref'); }).get().join(' ')
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

  // close edit modal and open current note
  $(document).on('click', '#close-editing', function() {
    $.ajax({
      type: 'GET',
      url: '/notes/' + $('.modal-header').attr('data-note-id'),
      success: function(response) {
        $('.modal').modal('hide');
        $('.modal').one('hidden.bs.modal', function() {
          $('.modal-content').html(response);
          $('.modal').modal('show');
        });
      }
    });
  });

  // open modal with tags
  $(document).on('click', '#tags-modal', function() {
    $.ajax({
      type: 'GET',
      url: '/notes/tags',
      success: function(response) {
        $('.modal-content').html(response);
        $('.modal').modal('show');
      }
    });
  });
});

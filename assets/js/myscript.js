// // Author       : Hamed Musa
// // email: -        cartzedan"gmail.com
// // Version      : 1.0 for note paddy
// // created: 6th June, 2023

$(document).ready(function() {
  // Initialize an empty array to store notes
  var notes = [];
  // Load notes from local storage
  if (localStorage.getItem('notes')) {
    notes = JSON.parse(localStorage.getItem('notes'));
  }

  function renderNoteList() {
    var list = $('.list-group');
    list.empty();
  
    for (var i = 0; i < notes.length; i++) {
      var note = notes[i];
      var listItem = $('<li class="list-group-item"></li>').text(note.title);
  
  // Add data attribute to store the note index
      listItem.attr('data-index', i);
  
  // Create delete button
      var deleteButton = $('<i class="fas fa-trash-alt float-right text-danger ">');
      deleteButton.attr('data-index', i);
  
  // Add click event listener to delete button
      deleteButton.click(function(e) {
        e.stopPropagation();
        var index = $(this).attr('data-index');
        deleteNoteByIndex(index);
      });
  
  // Append delete button to list item
      listItem.append(deleteButton);
  
      listItem.click(function() {
    // Toggle active class for selected item
        $('.list-group-item').removeClass('active');
        $(this).addClass('active');
  
        var index = $(this).attr('data-index');
        renderNoteContent(index);
      });
  
      list.append(listItem);
    }
  }

  // Function to render the content of a selected note
  function renderNoteContent(index) {
    var note = notes[index];
    $('.note-title').val(note.title);
    $('.note-textarea').val(note.text);
  }

//function to update save icon visibilitty
  function updateSaveNoteVisibility() {
    var title = $('.note-title').val();
    var text = $('.note-textarea').val();
    var saveNoteIcon = $('.save-note');

    if (title === '' || text === '') {
      saveNoteIcon.hide();
    } else {
      saveNoteIcon.show();
    }
  }

// A Function to open new note/ clear note
  function clearNote() {
    $('.note-title').val('');
    $('.note-textarea').val('');
    updateSaveNoteVisibility();
  }




  // A Function to save created and edited note
  function saveNote() {
    var activeItem = $('.list-group-item.active');
    var title = $('.note-title').val();
    var text = $('.note-textarea').val();
    var saveNoteIcon = $('.save-note');

    if (title === '' || text === '') {
      return;
    }

    if (activeItem.length === 0) {
      // Create a new note
      var newNote = {
        title: title,
        text: text
      };

      notes.push(newNote);
      renderNoteList();
      renderNoteContent(notes.length - 1);
    } else {
      // Edit the selected note
      var index = activeItem.attr('data-index');

      if (index < 0 || index >= notes.length) {
        return;
      }

      var note = notes[index];
      note.title = title;
      note.text = text;
      renderNoteList();
    }
    // Clear note fields
    $('.note-title').val('');
    $('.note-textarea').val('');
    saveNoteIcon.hide();

    // Save notes to local storage
    localStorage.setItem('notes', JSON.stringify(notes));
  }

 
    //A function to delete note
    function deleteNoteByIndex(index) {
      if (index < 0 || index >= notes.length) {
        // Invalid index
        return;
      }

      // Remove the note from the notes array
      notes.splice(index, 1);

      // Render the updated note list
      renderNoteList();

      // Clear the input fields
      $('.note-title').val('');
      $('.note-textarea').val('');

      // Save notes to local storage
      localStorage.setItem('notes', JSON.stringify(notes));
    }


  // Render initial note list
  renderNoteList();

  // Event listener for the new note icon
  $('.new-note').click(function() {
    $('.list-group-item').removeClass('active');
    clearNote();
  });

  // Event listener for the save note icon
  $('.save-note').click(function() {
    saveNote();
  });

  // Event listener for note title and textarea input
  $('.note-title, .note-textarea').on('input', function () {
    updateSaveNoteVisibility();
  });

  // Event listener for the delete note icon
  $('.delete-note').click(function() {
    deleteNote();
  });
});
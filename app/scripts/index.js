var $ = require('jquery');
var Firebase = require('firebase');



$.fn.serializeObject = function() {
  return this.serializeArray().reduce(function(acum, i) {
    acum[i.name] = i.value;
    return acum;
  }, {});
};

$(function(){


  var myDataRef = new Firebase('https://tiy-authentication-project.firebaseio.com/');
  var auth;
  var name;


        $('#messageInput').keypress(function (e) {
          if (e.keyCode == 13) {
            // var name = $('#nameInput').val();
            var text = $('#messageInput').val();
            myDataRef.push({name: name, text: text, auth: auth});
            $('#messageInput').val('');
          }
        });

        myDataRef.on('child_added', function(snapshot) {
          var message = snapshot.val();
          displayChatMessage(message.name, message.text);
        });

        function displayChatMessage(name, text) {
          $('<div/>').text(text).prepend($('<em/>').text(name+': ')).appendTo($('#messagesDiv'));
          $('#messagesDiv')[0].scrollTop = $('#messagesDiv')[0].scrollHeight;
        };

        $('#signup').on('submit', function(event){
          event.preventDefault();
          var $form = $(this);
          var formData = $form.serializeObject();

          myDataRef.createUser(formData, function(error, userData) {
            if (error) {
              switch (error.code) {
                case "EMAIL_TAKEN":
                  console.log("The new user account cannot be created because the email is already in use.");
                  break;
                case "INVALID_EMAIL":
                  console.log("The specified email is not a valid email.");
                  break;
                default:
                  console.log("Error creating user:", error);
              }
            } else {
              console.log("Successfully created user account with uid:", userData.uid);
              alert("Successfully created an account.");
              $('.signup-form').addClass('hidden');

            }
          });
        }),

          $('#login').on('submit', function(event){
            event.preventDefault();
            console.log('yes');
            var $form = $(this);
            var formData = $form.serializeObject();

            myDataRef.authWithPassword(formData, function(error, authData) {
              if (error) {
                console.log("Login Failed!", error);
              } else {
                console.log("Authenticated successfully with payload:", authData);
                auth = authData.token;
                name = $('#username').val();
                $('.login-form').addClass('hidden');
                $('.signup-form').addClass('hidden');
                $('.chat-container').removeClass('hidden');

              }
            });

          });

  });

// create user
var createUser = function(){
  var email = $('#r-e');
  var pwd = $('#r-pwd');

  firebase.auth().createUserWithEmailAndPassword(email.val(),pwd.val())
    .then(function(data){
        console.log(data);
        email.val('');
        pwd.val('');
        sendEmail();

  }).catch(function(err){
      console.log('error with firebase');
  });

  getUser();
  return false;
}

// send email confirmation
var sendEmail = function(){
  var user = firebase.auth().currentUser; // get the current User
  user.sendEmailVerification()
  .then(function(data){
    console.log('email Sent, Firebase email default format');
  })
  .catch(function(err){
    console.log('Firebase error ', err);
  });
}


// get user
var getUser = function(){
  firebase.auth().onAuthStateChanged(function(user){
    // detecta si existe o no existe, en la plataforma o en la sesion
    var authAs = $('#auth-email');
    if(user){
      // welcome
      console.log(user);
      authAs.html(user.email);
      $('#access').hide();
      $('#logged').show();
    } else {
      // not found
      $('#access').show();
      $('#logged').hide();
    }
  });
}

var login = function(){
  var email = $('#log-e');
  var pwd = $('#log-pwd');
  firebase.auth().signInWithEmailAndPassword(email.val(),pwd.val())
    .catch(function(err){
      console.log(err);
    });
  // por defecto corre onAuthStateChanged -> auth listener
}


var logout = function(){
  // logging out
  firebase.auth().signOut()
  .then(function(){
    console.log('Firebase SignOut Done');
  })
  .catch(function(err){
    console.log('Firebase error, logging out', err);
  })
}

var sendRecoverPass = function() {
   var auth = firebase.auth();
   var emailAddress = $('#recovery-e').val();
   auth.sendPasswordResetEmail(emailAddress)
   .then(function(data){
     alert('Firebase recovery email sent to your account')
   })
   .catch(function(err){
     console.log('Firebase Recovery Email error',err);
   });
}

getUser();

// Otros metodos
/*
  1. firebase.auth().currentUser
  2. firebase.auth().currentUser.updateProfile({ objeto con datos}) -> promise
  3. firebae.auth().currentUser.updatePassword(newPassword) -> promise
  4. firebase.auth().currentUser.updateEmail(email) -> promise
  5. firebase.auth().currentUser.delete() -> promise
  6. Re-autenticacion, lapsos de tiempo en casos de que no exista actividad en X periodo de tiempo
     firebase.auth.EmailAuthProvider.credential(user, password)
     firebase.auth().currentUser.reauthenticate(credentials) -> promise
*/

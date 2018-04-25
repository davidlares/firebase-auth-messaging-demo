// messaging refence
var messaging = firebase.messaging();
var myToken = ''

// browser permissions
  messaging.requestPermission() // otorgado por el usuario en un prompt
  .then(function(){
    console.log('FCM access granted');
    return messaging.getToken(); //
  })
  .then(function(token){  // promesa resultante del firebase.getToken()
      console.log(token);
      myToken = token
  })
  .catch(function(err){
      console.log(err);
  });

  // recibir mensaje
  messaging.onMessage(function(payload){ // carga de datos
    console.log(payload)
    alert(payload.notification.body); // saca un alerta con el cuerpo de la notificacion
  })

  // enviar mensajes

  var sendMessage = function(member,role,company){
      var json = {
        notification: {
          "title": "New member",
          "body": `Welcome, ${member} as ${role} working or representing ${company}`,
          "icon": "https://cdn0.iconfinder.com/data/icons/social-messaging-ui-color-shapes/128/notification-circle-blue-64.png"
        },
        to: myToken
      }

      // peticion post para enviar el objeto
      $.ajax({
        type: 'POST',
        url: 'https://fcm.googleapis.com/fcm/send',
        headers: {
          Authorization: "key=AAAAALERxOc:APA91bHtRfWk833VaUm6cPusJiCuQDAMbnSduOaifbAFUp0sMpU73YIStjWIw6bIzSb9-mRPvqgt-CP_I5D3uJjipGG7VqzqTkS2vGqVYJbM6Z3Q0Hqj495_Xyx4jkKQKmjHNV4Z-IUT"
        },
        contentType: "application/json",
        data: JSON.stringify(json),
        success: function(response){
          console.log(response);
        },
        error: function(xhr,status,error){
          console.log(status,error);
        }
      })
  }

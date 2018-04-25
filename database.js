$(document).ready(function(){
  console.log('getting records');
  getRecords();
});

$.getScript('fcm.js', function() {
  console.log('load performed')
});

// database instance
var db = firebase.database().ref('/players')

// new record
var saveRecord = function() {
    var person = $('#name').val();
    var member = {
      name: person,
      role: $('#role').val(),
      company: $('#company').val()
    }
    // confirm duplicated cotents
    db.orderByChild('name').equalTo(person) // consulta ordenada y luego es consultada
      // order by child -> ordenar regitros  -- equalTo -> lo que tengan el mismo criterio
    .once('value', function(snapshot) {
        // snapshot con la respuesta
        if(snapshot.hasChildren()){ // comprobar si es que existen o no registros
          console.error('Firebase - Duplicated error');
        } else {
          // push object -> genera un ID unico y aleatorio
          // set -> pushea el objeto
          db.push().set(member, function(error){
            // en error case
            if(error){
              console.error('Firebase error, sync failed', error);
            } else {
              console.log('Firebase Sync Succeded');
              sendMessage(person, $('#role').val(),$('#company').val());
            }
          });
        }
    });
}
var getRecords = function() {
   db.on('value',function(snapshot){  // objeto value -> listener
      // bloque de informacion que ya trajo -> listener de cambios
      var members = snapshot.val() // parsear la informacion
      $('#members-table').empty();
      var row = "";
      for(member in members){
        console.log(members);
        row +=
        `<tr id="${member}">
          <td class="text-center">${member}</td>
          <td class="text-center name">${members[member].name}</td>
          <td class="text-center role">${members[member].role}</td>
          <td class="text-center company">${members[member].company}</td>
          <td class="text-center">
            <div class="btn btn-sm btn-warning btnEdit">Edit</div>
          </td>
          <td class="text-center">
            <div class="btn btn-sm btn-danger btnDelete">Delete</div>
          </td>
        </tr>`;
      }

      $('#members-table').append(row);
      row = "";
      // delete record
      $('.btnDelete').click(function(){
        var playerID = $(this).closest('tr').attr('id');
        db.child(playerID).remove(); // se debe indicar el child al registro referenciado
      });

      // update record
      $(".btnEdit").click(function(){

        var playerID = $(this).closest('tr').attr('id');
        $('#name').val($('#' + playerID).find(".name").text());
        $('#role').val($('#' + playerID).find(".role").text());
        $('#company').val($('#' + playerID).find(".company").text());
        $("#submit-login").val("Actualizar").unbind('click').click(function(){

          db.child(playerID).update({
            name: $('#name').val(),
            role: $('#role').val(),
            company: $('#company').val()
          }, function(){
            name: $('#name').val("");
            role: $('#role').val("");
            company: $('#company').val("");
            $("#submit-login").val("Enviar").unbind('click').on('click','saveRecord');
          })
      })

  })}, function(err){
      console.log('Firebase database reading failed', err);
  });
}

// metodos online y offline
// firebase.database().goOffline();
// firebase.database().goOnline();

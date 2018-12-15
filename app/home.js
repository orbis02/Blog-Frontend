$(document).ready(function(){
    validar_sesion();
    datosuser();
    GetlistPost();



});
//funcion para validar sesion 
function validar_sesion()
{ 
    if (localStorage.getItem("Api") == null) {

        logout();
    
      } else {
        let token = JSON.parse(localStorage.getItem('Api')).token;
        // wsConnect(token);
      }

}
//funcion para ver post
function viewPost(id)
{  localStorage.setItem('PosId',id);
window.location ="post.html";
}
//funcion para cerrar sesion
function logout()
{
   
  
    var userdata=JSON.parse(localStorage.getItem('Api'));

    fetch("http://68.183.27.173:8080/logout", {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' +userdata.token
        }
      }).then(function (response) {
        localStorage.removeItem('Api');
        window.location = "login.html";
      })
      .catch(error =>  window.location = "login.html");

 
}
//funcion para abrir web sockect
function wsConnect(token) {
    
    // console.log("WS- connect ", token);
    var websocket = new WebSocket(`ws://68.183.27.173:8080/?token=${token}`);
    // console.log(websocket);
    websocket.onopen = function (evt) {
        // console.log(evt)
    };
    websocket.onclose = function (evt) {
        // console.log(evt)
    };
    websocket.onerror = function (evt) {
        // console.log(evt)
    };

    websocket.onmessage = function (evt) {
        var data = JSON.parse(evt.data);
       
   

        for(var i in data.users){
            console.log(data.users[i].userId);
            if($(`#online-${data.users[i].userId}`).hasClass('text-success'))
            {
                $(`#online-${data.users[i].userId}`).removeClass("text-success" );
                
            }
            else
            {
                console.log( `#online-${data.users[i].userId}`)  ;
                $(`#online-${data.users[i].userId}`).addClass("text-success");
            }
            

        }
        switch (data.type) {
            case "likes":
                $('#articulo-like-' + data.postId).text(data.likes);
                break;
            case "view-post":
                // TODO: cambias likes por views
                $('#articulo-view-' + data.postId).text(data.views);
                break;

                case "new-comment":
                // TODO: cambias likes por views
                $('#articulo-comment-' + data.postId).text(data.comments);
                break; 
                
                case "user-connected":
                tipo="success";
                notificacion=data.userEmail;
                mensaje="Se ha conectado";
                mostrar_notificaciones(tipo,notificacion,mensaje);
                break;
        
              case "logged":
              tipo="success";
              notificacion=data.userName;
              mensaje="Se ha logueado";
              mostrar_notificaciones(tipo,notificacion,mensaje);
                break;
        
              case "disconnected":
              tipo="danger";
              notificacion=data.userName;
              mensaje="Se ha desconectado";
              mostrar_notificaciones(tipo,notificacion,mensaje);
              break;
        
                case "new-post":
                tipo="info";
                notificacion=data.userName;
                mensaje=" ha creado un nuevo post.";
                mostrar_notificaciones(tipo,notificacion,mensaje);
                break; 

        }
    };
}
function mostrar_notificaciones(tipo,notificacion,mensaje)
{  
    $.notify({
        icon: 'ti-bell',
        message: "<b>Blog Api</b> - "+notificacion+" " +mensaje

    },{
        type: `${tipo}`,
        timer: 4000
    });
   
    
}
function datosuser()
{
    var userdata=JSON.parse(localStorage.getItem('Api'));
    //  console.log(userdata);
   let data=`<h4>${userdata.name}</h4>`
    $("#username").html(data);

  
}
function showprofile()
{   var userdata=JSON.parse(localStorage.getItem('Api'));
    var URL =location.protocol + "//" +location.host; 
    localStorage.setItem('userId',userdata.id);
    
     window.location.href=URL+"/UserProfile.html";

}
function GetlistPost()
{    
    
      if(localStorage.getItem('Api'))
        {   
             var userdata=JSON.parse(localStorage.getItem('Api'));
                  
            fetch("http://68.183.27.173:8080/post",{
                method:'GET',
                // body:null,
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':'Bearer '+userdata.token

                }
            }).then(res=>res.json())
             .then((response)=>{
                //  console.log(response);
                $("#ListPost").html("");
           
                for(var i=0; i< response.length; i++)
                {
                var data=`<div class="row">
 
                  <div class="col-md-12">
                      <div class="card">
                              <div class="header">
                                      <h4 class="title">${response[i].title}</h4>
                                      <small class="pull-right">${response[i].tags}</small>
                                      <p class="category"><a onclick="ShowUser(${response[i].userId});" >By: ${response[i].userName} (${response[i].userEmail})</a><i id="online-${response[i].userId}"  class="fa fa-circle" ></i></p>
                                  </div>
                              
                                  <div class="content">
                                        ${response[i].body}
                                          <div class="footer">
                                              <div class="chart-legend">
                                              <button class="btn btn-small btn-link " onclick="Like(${response[i].liked},${response[i].id});">${(response[i].liked)?'<i class="fa fa-star text-info"></i>':'<i class="fa fa-star-o text-info"></i>'} </button> <span id="articulo-like-${response[i].id}">${response[i].likes}</span> Me gustas
                                              <button class="btn btn-small btn-link " onclick="viewPost(${response[i].id});"> <i class="fa fa-eye text-info"></i></button> <span id="articulo-view-${response[i].id}"> ${response[i].views} </span>Visitas 
                                              <button class="btn btn-small btn-link " onclick="AddComment(${response[i].id});"> <i class="fa fa-comment text-warning"></i> </button> Comentar
                                              </div>
                                              <hr>
                                              
                                               <i class="fa fa-calendar"></i> ${new Date(response[i].createdAt).toLocaleDateString()}
                                              <div class="pull-right" >  <button class="btn btn-small btn-link" onclick=" GetlistComment(${response[i].id});"> <i class="fa fa-comments text-danger"></i> </button> <span id="articulo-comment-${response[i].id}">${response[i].comments}</span> Ver Comentarios </div>
                                              
                                          </div>
                            </div>
                           <div id="agregarComentario${response[i].id}" style="display:none;">
                           <hr>
                           <div class="header">
                         
                           </div>
               <div class="content">
                   <div class="form-group">
                       <label>Comentar</label>
                       <textarea id="comentar${response[i].id}" rows="1" class="form-control border-input" placeholder="Here can be your description" value="">                                     
                       </textarea>
                    <br>
                       <button onclick="PostComment(${response[i].id});" class="btn btn-small btn-link">Publicar</button>
                   </div>               
               </div>
                           </div>
                          <div style="displa:none;" id="ListadoComentario${response[i].id}"></div>
                      </div>
                  </div>
              </div>`;
              $("#ListPost").prepend(data);
                }
             
                wsConnect(userdata.token);
                
             })
            .catch(error=>console.log("Error:",error));


        }
       
}
//funcio para agregar post
function addPost()
{
   let tituloPost= $("#tituloPost").val();
   
   let tagpost= $("#tagpost").val();
     var tag= tagpost.split(",");
   
   let contendiopost=$("#contendiopost").val();
   var data={title:tituloPost,tags:tag,body:contendiopost};
   var userdata=JSON.parse(localStorage.getItem('Api'));
// console.log(userdata.token);
fetch(`http://68.183.27.173:8080/post`,{
    method: 'POST',
    body:JSON.stringify(data),
    headers:{
        'Content-Type':'application/json',
        'Authorization':`Bearer ${userdata.token}`

    }
})
 .then((response)=>{
    location.reload();
 }).catch(error=>console.log("Error:",error));

   

}
//funcion para agregar comentario
function AddComment(id)
{ 
   var style=$(`#agregarComentario${id}`).css("display");
   (style=="none") ? $(`#agregarComentario${id}`).css("display","block"): $(`#agregarComentario${id}`).css("display","none");

 
}
function showformnewpost()
{
    var style=$(`#nuevopost`).css("display");
    (style=="none") ? $(`#nuevopost`).css("display","block"): $(`#nuevopost`).css("display","none");
 

}
//funcion para agregar comentario a un post especifico.
function PostComment(idPost)
{   let comentario=$(`#comentar${idPost}`).val();
var data={body:comentario};
var userdata=JSON.parse(localStorage.getItem('Api'));
// console.log(userdata.token);
fetch(`http://68.183.27.173:8080/post/${idPost}/comment`,{
    method: 'POST',
    body:JSON.stringify(data),
    headers:{
        'Content-Type':'application/json',
        'Authorization':`Bearer ${userdata.token}`

    }
})
 .then((response)=>{
    GetlistPost();
 }).catch(error=>console.log("Error:",error));
    
}

function  ShowUser(userId)
{   var URL =location.protocol + "//" +location.host; 
    localStorage.setItem('userId',userId);
    
     window.location.href=URL+"/UserProfile.html";
    
}
//funcion para agregar y quitar like
function Like(like,id)
{ 
    var userdata=JSON.parse(localStorage.getItem('Api'));
      
     console.log(id,userdata);
    fetch(`http://68.183.27.173:8080/post/${id}/like`,{
        method: (like == true) ? 'DELETE': 'PUT',
        headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${userdata.token}`

        }
    })
     .then((response)=>{
         GetlistPost();
     }).catch(error=>console.log("Error:",error));

 

}


function GetlistComment(idPost)
{       var style=$(`#ListadoComentario${idPost}`).css("display");
         if(style=="none")
         {  
            $(`#ListadoComentario${idPost}`).css("display","block");
            if(localStorage.getItem('Api'))
            {   
                 var userdata=JSON.parse(localStorage.getItem('Api'));
            
                fetch(`http://68.183.27.173:8080/post/${idPost}/comment`,{
                    method:'GET',
                    headers:{
                        'Content-Type':'application/json',
                        'Authorization':'Bearer '+userdata.token
    
                    }
                }).then(res=>res.json())
                 .then((response)=>{
                    console.log(response);
                    $(`#ListadoComentario${idPost}`).html("");
                   for(var i=0; i< response.length; i++)
                   {
                   var data=`  <hr>
                   <div class="header">
                   <small> <i class="fa fa-user"></i> <a onclick="ShowUser(${response[i].userId});" >By:${response[i].userName}</a></samll>  
                   </div>
                   <div class="content">
                <div class="form-group">
               <label>Comentario</label>
                                                    <textarea rows="1" class="form-control border-input" placeholder="Here can be your description" >
                                                    ${response[i].body}
                                                    </textarea>
                                                </div>
                      
                   </div>`;
                 $(`#ListadoComentario${idPost}`).prepend(data);
                   }
                
                    
                 })
                .catch(error=>console.log("Error:",error));
    
    
            }
    

         }
       else
       {
        $(`#ListadoComentario${idPost}`).css("display","none");
       }
     
}
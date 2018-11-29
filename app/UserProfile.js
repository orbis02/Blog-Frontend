$(document).ready(function(){
  
GetlistPost();
GetProfile();
});

function GetProfile()
{
    if(localStorage.getItem('Api'))
    {
        var userdata=JSON.parse(localStorage.getItem('Api'));
        let Puser=JSON.parse(localStorage.getItem('userId'));
        fetch(`http://68.183.27.173:8080/users/${Puser}`,{
            method:'GET',
            // body:null,
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer '+userdata.token

            }
        }).then(res=>res.json())
         .then((response)=>{
            console.log(response);
            $("#UserProfile").html("");
        //    for(var i=0; i< response.length; i++)
        //    {
                 
           var data=`<div class="col-lg-4 col-md-5">
           <div class="card card-user">
               <div class="image">
                   <img src="assets/img/background.jpg" alt="..."/>
               </div>
               <div class="content">
                   <div class="author">
                     <img class="avatar border-white" src="assets/img/faces/face-0.jpg" alt="..."/>
                     <h4 class="title">${response.name}<br />
                        <a href="#"><small>${response.email}</small></a>
                     </h4>
                   </div>
                
               </div>
               <hr>
               <div class="text-center">
                   <div class="row">
                       <div class="col-md-4 col-md-offset-1">
                           <h5>${response.posts}<br /><small>Publicaciones</small></h5>
                       </div>
                       <div class="col-md-6">
                           <h5>${new Date(response.createdAt).toLocaleDateString()}<br /><small>Fecha Ingreso</small></h5>
                       </div>
                      
                   </div>
               </div>
           </div>
          
       </div>`;
          $("#UserProfile").html(data);
        //    }
        
            
         })
        .catch(error=>console.log("Error:",error));


    }


        
}
function GetlistPost()
{    
    
      if(localStorage.getItem('Api'))
        {   
             var userdata=JSON.parse(localStorage.getItem('Api'));
             let Puser=JSON.parse(localStorage.getItem('userId'));
            fetch(`http://68.183.27.173:8080/post?userId=${Puser}`,{
                method:'GET',
                // body:null,
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':'Bearer '+userdata.token

                }
            }).then(res=>res.json())
             .then((response)=>{
                
                $("#ListPost").html("");
               for(var i=0; i< response.length; i++)
               {
               var data=`<div class="row">

                 <div class="col-md-12">
                     <div class="card">
                             <div class="header">
                                     <h4 class="title">${response[i].title}</h4>
                                     <small class="pull-right">${response[i].tags}</small>
                                     <p class="category"><a onclick="ShowUser(${response[i].userId});" >By: ${response[i].userName} (${response[i].userEmail})</a></p>
                                 </div>
                             
                                 <div class="content">
                                       ${response[i].body}
                                         <div class="footer">
                                             <div class="chart-legend">
                                             <button class="btn btn-small btn-link " onclick="Like(${response[i].liked},${response[i].id});">${(response[i].liked)?'<i class="fa fa-star text-info"></i>':'<i class="fa fa-star-o text-info"></i>'} </button>  ${response[i].likes} Me gustas
                                                <i class="fa fa-eye text-info"></i> ${response[i].views} Visitas 
                                                 <i class="fa fa-comment text-warning"></i> Comentar
                                             </div>
                                             <hr>
                                             
                                              <i class="fa fa-calendar"></i> ${new Date(response[i].createdAt).toLocaleDateString()}
                                             <div class="pull-right" >  <button class="btn btn-small btn-link" onclick=" GetlistComment(${response[i].id});"> <i class="fa fa-comments text-danger"></i> </button> ${response[i].comments} Ver Comentarios </div>
                                             
                                         </div>
                           </div>
                         <div id="ListadoComentario${response[i].id}"></div>
                     </div>
                 </div>
             </div>`;
             $("#ListPost").prepend(data);
               }
            
                
             })
            .catch(error=>console.log("Error:",error));


        }

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
{    
    
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
                                                <textarea rows="1" class="form-control border-input" placeholder="Here can be your description" value="Mike">
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
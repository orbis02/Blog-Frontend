$(document).ready(function(){
$("#login").click(function()
{  
   
    
    login();
   
});
});


function login()
{    var URL =location.protocol + "//" +location.host; 
     var email=$("#email").val();
     var password=$("#password").val();



    var data={
        email: email,
        password:password
        
    }
    fetch("http://68.183.27.173:8080/login",{
        method:'POST',
        body:JSON.stringify(data),
        headers:{
            'Content-Type':'application/json'
        }
    }).then(res=>res.json())
     .then((response)=>{
       
          if(response.token.length==36)
          { 
            var userdata=JSON.stringify(response);
            localStorage.setItem('Api',userdata);
            var data= localStorage.getItem('Api');
            window.location.href=URL+"/home.html"; 
          }
          else
          {
              alert("Favor verificar su usuario");
          }
            
        
     })
    .catch(error=>console.log("Error:",error));
}
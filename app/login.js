$(document).ready(function(){
$("#login").click(function()
{ 
     alert("Iniciaste secion");
  
});
});


function registrar()
{  var name=$("#name").val();
  var email=$("#email").val();
  var password=$("#password").val();
  var password2=$("#password2").val();

  if(password!=password2)
    {
        alert("las contrase;as son diferentes");
        return;
    }
    var data={
        name: name,
        email:email,
        password:password
    }
    fetch("http://68.183.27.173:8080/register",{
        method:'POST',
        body:JSON.stringify(data),
        headers:{
            'Content-Type':'application/json'
        }
    }).then(res=>res.json())
    .then(response=>console.log('Success:',JSON.stringify(response)))
    .catch(error=>console.log("Error:",error));
}
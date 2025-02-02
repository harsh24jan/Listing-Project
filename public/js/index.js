let taxSwitch=document.getElementById("flexSwitchCheckDefault");
let tax=document.querySelectorAll("#tax-info");

taxSwitch.addEventListener("click",()=>{
    tax.forEach(ta=>{
        if(ta.style.display!="inline"){
            ta.style.display="inline";  
        }
        else{
            ta.style.display="none";
        }
       
    })
 
})
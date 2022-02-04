
 
const logOutBtn = document.querySelector('.nav__el--logout')


const logout = async()=>{
    
    try{
     
        const res = await axios({
    
            method:'get',
            url:'/api/v1/users/logout',
        });
    
        console.log(res);
        if(res.data.status ='success'){
            location.reload(true);
        }
    }catch{
        alert(err);
        showAlert('error','Error logging out')
    }
    
    
    
    }

logOutBtn.addEventListener('click',logout)

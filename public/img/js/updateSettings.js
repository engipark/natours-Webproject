




// type is either 'password' or 'data'
const updateSettings = async (data,type)=>{
    try{

        const url = type ==='password' ? 'http://127.0.0.1:3000/api/v1/Users/updateMyPassword' : 'http://127.0.0.1:3000/submit-user-data'
        const method = type ==='password'? 'patch' : 'post'

        console.log('hi?');
        const res = await axios ({

            method:method,
            url:url,
            data:data})

          
            

       if(res.data.status === 'success'){

        alert(`${type.toUpperCase()} updated successfully!`)

       }
    }catch(err){

       console.log(err)
    }
    // window.setTimeout(()=>{
      
    //     location.assign('/me');

    // },500);



}




document.querySelector('.form-user-data').addEventListener('submit',async (e)=>{


        
        
        e.preventDefault();
       
        const name = document.getElementById('name').value
        const email = document.getElementById('email').value

        await updateSettings({name,email},'data')


    })



    document.querySelector('.form-user-settings').addEventListener('submit',async (e)=>{


    

        e.preventDefault();
        document.querySelector('.btn--save-password').value = 'Updating...'
        const password = document.getElementById('password-current').value
        const newpassword = document.getElementById('password').value
        const passwordConfirm = document.getElementById('password-confirm').value


       await updateSettings({password,newpassword,passwordConfirm},'password')

       document.querySelector('.btn--save-password').value = 'save password'
    })
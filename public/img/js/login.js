document.querySelector('.form').addEventListener('submit',(e)=>{






const login = async (email,password)=>{
  try{
    console.log(email,password);
    const res =  await axios({
        method:'POST',
        url:'http://127.0.0.1:3000/api/v1/users/login',
        data:{
            email:email,
            password

        } 
    })
    console.log(res);
}catch(err){


    alert('아이디 비밀번호 오류입니다.');
}
   
    
    
}


e.preventDefault();
const email = document.getElementById('email').value;
const password = document.getElementById('password').value;

login(email,password);

})
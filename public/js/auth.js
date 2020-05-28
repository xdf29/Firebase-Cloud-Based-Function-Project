const authSwitchLinks = document.querySelectorAll('.switch')
const authModals = document.querySelectorAll('.auth .modal')
const authWrapper = document.querySelector('.auth')
const registerForm = document.querySelector('.register')
const loginForm = document.querySelector('.login')
const signOut = document.querySelector('.sign-out')

//toggle auth modal
authSwitchLinks.forEach((link)=>{
    link.addEventListener('click', ()=>{
        authModals.forEach(modal=>modal.classList.toggle('active'))
    })
})

//register form
registerForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const email = registerForm.email.value
    const password = registerForm.password.value
    firebase.auth().createUserWithEmailAndPassword(email, password)
     .then((user)=>{
        console.log(JSON.stringify(user))
        registerForm.reset()
     })
     .catch((error)=>{
        console.log(JSON.stringify(error))
        registerForm.querySelector('.error').textContent = error.message
     })
})

//login 
loginForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const email = loginForm.email.value
    const password = loginForm.password.value
    firebase.auth().signInWithEmailAndPassword(email, password)
     .then((user)=>{
        console.log(JSON.stringify(user))
        loginForm.reset()
     })
     .catch((error)=>{
        console.log(JSON.stringify(error))
        loginForm.querySelector('.error').textContent = error.message
     })
})

// auth listener
firebase.auth().onAuthStateChanged((user)=>{
    if(user){
        //login 
        authWrapper.classList.remove('open')
        authModals.forEach(modal=>modal.classList.remove('active'))
    }else{
        //logout 
        authWrapper.classList.add('open')
        authModals[0].classList.add('active')
    }
})

//signout
signOut.addEventListener('click', ()=>{
    firebase.auth().signOut()
     .then(()=>console.log('Signed out successfully'))
})
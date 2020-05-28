const requestModal = document.querySelector('.new-request');
const requestLink = document.querySelector('.add-request');
const requestForm = document.querySelector('.new-request form')

// open request modal
requestLink.addEventListener('click', () => {
  requestModal.classList.add('open');
});

// close request modal
requestModal.addEventListener('click', (e) => {
  if (e.target.classList.contains('new-request')) {
    requestModal.classList.remove('open');
  }
});

//add a new request
requestForm.addEventListener('submit', (e)=>{
  e.preventDefault()
  const addRequest = firebase.functions().httpsCallable('addRequest')
  addRequest({text: requestForm.request.value})
   .then(()=>{
     requestForm.reset()
     requestForm.querySelector('.error').textContent = ''
     requestForm.classList.remove('open')
   })
   .catch((error)=>{
     console.log(error)
     requestForm.querySelector('.error').textContent = error.message
   })
})

// say hello fn call
/*const button = document.querySelector('.call')
button.addEventListener('click', ()=>{
  //Get Function Reference
  const sayHelloFn = firebase.functions().httpsCallable('sayHello')
  sayHelloFn({name: 'XD'})
    .then(result => {
      console.log(JSON.stringify(result.data))
    })
  
})*/
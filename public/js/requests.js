var app = new Vue({
    el: '#app',
    data: {
      requests: []
    },
    methods:{
        upvoteRequest(id){
            const upvote = firebase.functions().httpsCallable('upvote')
            upvote({id})
            .catch(error => {
                const notification = document.querySelector('.notification')
                notification.textContent = error.message
                notification.classList.add('active')
                setTimeout(()=>{
                    notification.textContent = ''
                    notification.classList.remove('active')
                },4000)
            })
            
            
        }
    },
    mounted(){
        const ref = firebase.firestore().collection('requests').orderBy('upvotes', 'desc')

        //Callback Fn Fired everytime the collection has changes
        ref.onSnapshot(snapshot => {
            let requests = []
            snapshot.forEach(doc => {
                requests.push({id: doc.id, ...doc.data()})
            })
            this.requests = requests
        })
    }
  })

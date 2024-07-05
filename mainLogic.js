const baseUrl = "https://tarmeezacademy.com/api/v1"
//===============post requests=============
function createNewPostClicked()
{
    let postid = document.getElementById("post-id-input").value
    let iscreate = postid == null || postid ==""

    
    const title = document.getElementById("post-title-input").value
    const body = document.getElementById("post-body-input").value
    const image = document.getElementById("post-image-input").files[0]
    const token = localStorage.getItem("token")

   let formdata = new FormData()
   formdata.append("body",body)
   formdata.append("title",title)
   formdata.append("image",image)

    let url = ``
    let typemessag = ""
    const headers ={
        "Content-Type": "multipart/form-dada",
        "authorization": `Bearer ${token}`
    }

    if(iscreate){
        url = `${baseUrl}/posts`
        typemessag = "Post Has Been Created"
    }else{
        formdata.append("_method","put")
        url = `${baseUrl}/posts/${postid}`          
        typemessage = "Post Has Been Edited"
    }
    toggleloader(true)
    axios.post(url,formdata,{         
        headers:headers
    })
    .then((response) => {
        const modal = document.getElementById("create-post-modal")
        const modalinstance = bootstrap.Modal.getInstance(modal)
        modalinstance.hide()
        showAlert(typemessage,"success")
        getposts()    
    })
    .catch((error)=>{
        const message = error.response.data.message
        showAlert(message,"danger")
    }).finally(()=>{
        toggleloader(false)
    })           

    
}

function editpostbtnclicked(postobject)
{
    let post = JSON.parse(decodeURIComponent(postobject))
    console.log(post)
    
    document.getElementById("post-modal-submit-btn").innerHTML= "Update"
    document.getElementById("post-id-input").value= post.id

    document.getElementById("post-modal-title").innerHTML="Edit Post"
    document.getElementById("post-title-input").value = post.title
    document.getElementById("post-body-input").value = post.body
    let postmodal =new bootstrap.Modal(document.getElementById("create-post-modal"),{})
    postmodal.toggle()
}

// function deletepostbtnclicked(postid)
function deletepostbtnclicked(postobject)
{
    let post = JSON.parse(decodeURIComponent(postobject))
    console.log(post)  
    
    document.getElementById("delete-post-id-input").value = post.id

    let postmodal =new bootstrap.Modal(document.getElementById("delete-post-modal"),{})
        postmodal.toggle()       
        /* const token = localStorage.getItem("token")
        const headers ={
            "Content-Type": "multipart/form-dada",
            "authorization": `Bearer ${token}`
        }
        url = `${baseUrl}/posts/${postid}`            
        axios.delete(url,{
            headers:headers
        })
        .then((response) => {
            showAlert("Post Has Been Deleted","success")
            getposts()    
        })
        .catch((error)=>{
            const message = error.response.data.message
            showAlert(message,"danger")
        })      */

}

function confirmpostdelete()
{
    const token = localStorage.getItem("token")
    const postid = document.getElementById("delete-post-id-input").value 
    const url = `${baseUrl}/posts/${postid}`
    const headers ={
        "Content-Type": "multipart/form-dada",
        "authorization": `Bearer ${token}`
    }
    axios.delete(url,{
        headers:headers
    })
    .then((response)=>{   
        // hide modal
        const modal = document.getElementById("delete-post-modal")
        const modalinstance = bootstrap.Modal.getInstance(modal)
        modalinstance.hide()
        showAlert("The Post Has Been Deleted Successfuly","success")
        getposts()
    }) 
    .catch((error)=>{
        const message = error.response.data.message
        showAlert(message,"danger")      
    })
}

function userclicked(userId)
{
    window.location = `profile.html?userid=${userId}`
}

function profileclicked()
{
    const user = getcurrentuser()
    const userId = user.id
    window.location = `profile.html?userid=${userId}`
}

function setupui()
{
    const token = localStorage.getItem("token")

    const logindiv = document.getElementById("logged-in-div")
    const logoutdiv = document.getElementById("logout-div")
    // add btn
    const addbtn = document.getElementById("add-btn")

    if(token==null)//user is gust (not logged in)
    { 
        if(addbtn!=null){
            addbtn.style.setProperty("display","none","important")
        }
        logindiv.style.setProperty("display","flex","important")
        logoutdiv.style.setProperty("display","none","important") 
       
    }else { // for logged in user
        if(addbtn!=null){
            addbtn.style.setProperty("display","block","important")
        }
        logindiv.style.setProperty("display","none","important")
        logoutdiv.style.setProperty("display","flex","important")
        

        const user = getcurrentuser()          
        document.getElementById("nav-username").innerHTML = user.username
        document.getElementById("nav-user-image").src = user.profile_image
    }
}

function getcurrentuser()
    {
    let user = null
    const storageUser = localStorage.getItem("user")
    if(storageUser!=null){
        user = JSON.parse(storageUser)
    }
    return user
    }
//=============AUTN FUNCTION===============//
    function LoginBtnClicked()
    {
        const username = document.getElementById("username-input").value
        const password = document.getElementById("password-input").value

        const params ={
            "username":username,
            "password":password
        }
        const url = `${baseUrl}/login`
        toggleloader(true)
        axios.post(url,params)
        .then((response)=>{
            toggleloader(false)
            localStorage.setItem("token",response.data.token)
            localStorage.setItem("user",JSON.stringify(response.data.user))

            const modal = document.getElementById("login-modal")
            const modalinstance = bootstrap.Modal.getInstance(modal)
            modalinstance.hide()

            showAlert("Logged in successfully","success")
            setupui()
        }).catch((error)=>{
            const message = error.response.data.message
            showAlert(message,"danger")
        }).finally(()=>{
            toggleloader(false)
        })              
    }


    function toggleloader(show = true)
    {
        if(show)
        {
            document.getElementById("loader").style.visibility = "visible"
        }else{
            document.getElementById("loader").style.visibility = "hidden"
        }
            
    }

    function registerBtnClicked()
    {
        const name = document.getElementById("register-name-input").value
        const username = document.getElementById("register-username-input").value
        const password = document.getElementById("register-password-input").value
        const image = document.getElementById("register-image-input").files[0]
        
        let formdata = new FormData()
        formdata.append("name",name)
        formdata.append("username",username)
        formdata.append("password",password)
        formdata.append("image",image)
        
        

        const url = `${baseUrl}/register`
        const headers ={
           "Content-Type": "multipart/form-dada",
        }
        toggleloader(true)
        axios.post(url,formdata,{
            headers:headers
        })

        // axios.post(url,params)
        .then((response)=>{
            localStorage.setItem("token",response.data.token)
            localStorage.setItem("user",JSON.stringify(response.data.user))

            const modal = document.getElementById("register-modal")
            const modalinstance = bootstrap.Modal.getInstance(modal)
            modalinstance.hide()
            showAlert("New user register successfully","success")
            // alert("user logged in successfuly")
            setupui()


            // console.log(response.data)
        }).catch((error)=>{
            const message = error.response.data.message
            showAlert(message,"danger")
        }).finally(()=>{
            toggleloader(false)
        })                     
    }

    function logout()
    {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        alert("logged out successfully")
        showAlert("Logged out successfully","success")
        setupui()
    }
//=============//AUTN FUNCTION//===============//

 //===========  show successalert==============//
 function showAlert(customMessage,type="success")
   {
     const alertPlaceholder = document.getElementById('success-alert')

     const appendAlert = (message, type) => {
     const wrapper = document.createElement('div')
     wrapper.innerHTML = [
         `<div class="alert alert-${type} alert-dismissible" role="alert">`,
         `   <div>${message}</div>`,
         '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
         '</div>'
     ].join('')

     alertPlaceholder.append(wrapper)
     }

         appendAlert(customMessage, type)

         // todo:hide the alert
         setTimeout(()=>{
             const alert = bootstrap.Alert.getOrCreateInstance('#success-alert');
            //  alert.close()
         },2000)
        
        
    } 
//=========== // show successalert//==============//


const navbar = 
`
    <div class="container">
        <div class="d-flex justify-content-center">
            <div class="col-9">
                <nav class="navbar navbar-expand-lg bg-light shadow rounded pt-3">
                    <div class="container-fluid">
                    <a class="navbar-brand" href="home.html">Goldsoft</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav">
                            <li class="nav-item">
                            <a class="nav-link active" aria-current="page" href="home.html">Home</a>
                            </li>
                            <li class="nav-item">
                            <a class="nav-link" onclick="profileclicked()" style="cursor:pointer">Profile</a>
                            </li>
                        </ul>

                        <!-- NON-LOGGED IN USER -->
                        <div class="d-flex w-100 justify-content-end" id="logged-in-div">
                            <button id="login-btn" type="button" data-bs-toggle="modal" data-bs-target="#login-modal" class="btn btn-outline-success mx-2">Login</button>
                            <button id="register-btn" type="button" data-bs-toggle="modal" data-bs-target="#register-modal" class="btn btn-outline-success">Rigister</button>
                        </div>
                        <!--// NON-LOGGED IN USER //-->

                        <!-- FOR LOGGED IN USER -->
                        <div class="d-flex w-100 justify-content-end align-items-center " id="logout-div">
                            <img id="nav-user-image" class="rounded-circle border border-2" src="./profile-pics/User.png" style="width: 40px;height: 40px;" alt="">

                            <b id="nav-username" class="mx-2">
                                @mofawzy
                            </b>

                            <button onclick="logout()" id="logout-btn" type="button" data-bs-toggle="modal"  class="btn btn-outline-danger mx-2">Logout</button>
                        </div>
                        <!--// FOR LOGGED IN USER //-->

                    </div>
                    </div>
                </nav>
            </div>
        </div>
    </div>
`


 
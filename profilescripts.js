setupui()
getuser()
getposts()
function getcurrentuserid()
{
    const urlparams = new URLSearchParams(window.location.search)
    const id = urlparams.get("userid") 
    return id
}
function getuser()
{
    const id = getcurrentuserid()
    // alert(id)
    // return
    axios.get(`${baseUrl}/users/${id}`)
    // axios.get(`${baseUrl}/tags/1/posts`)
    .then((response)=> {
        const user  = response.data.data
        //console.log(user)
        document.getElementById("main-info-image").src = user.profile_image
        document.getElementById("main-info-email").innerHTML = user.email
        document.getElementById("main-info-name").innerHTML = user.name
        document.getElementById("main-info-username").innerHTML = user.username

        // posts & comments count
        document.getElementById("posts-count").innerHTML = user.posts_count
        document.getElementById("comments-count").innerHTML = user.comments_count

        document.getElementById("name-posts").innerHTML = `${user.username}'s`
    })    
}

//نسنتخدم الوظيفة بهذا الشكل فى حالةوجود بوستتات كثيره للمستخدم
// ونرغب فى تقسيمها على صفحات
//function getposts(reload = true,page=1)
function getposts()
    {
            const id= getcurrentuserid()
            //axios.get(`${baseUrl}/posts?limit=2&page=${page}`)
            axios.get(`${baseUrl}/users/${id}/posts`)
            .then((response)=> {
                const posts = response.data.data
                document.getElementById("user-posts").innerHTML=""
                //lastpage=response.data.meta.last_page

                /* if (reload){
                    document.getElementById("posts").innerHTML=""
                } */
                
                for(post of posts)
                {
                        const author = post.author
                        let posttitle = ""

                        // show or hide (edit) button
                        let user = getcurrentuser()
                        let ismypost = user !=null && post.author.id == user.id
                        let editbuttoncontent = ``
                        let deletebuttoncontent =``
                        
                        if (ismypost){
                            editbuttoncontent = `<button class='btn btn-secondary' style="float:right" onclick="editpostbtnclicked('${encodeURIComponent(JSON.stringify(post))}')">edit</button>`
                            deletebuttoncontent = `<button class='btn btn-danger mx-1' style="float:right" onclick="deletepostbtnclicked('${encodeURIComponent(JSON.stringify(post))}')">delete</button>`
                            // deletebuttoncontent = `<button class='btn btn-danger mx-1' style="float:right" onclick="deletepostbtnclicked(${post.id})">delete</button>`
                        }


                        if (post.title != null)
                        {
                            posttitle = post.title
                        }

                        let content =
                        `
                        <div class="card shadow ">
                            <div class="card-header">
                               <span onclick="userclicked(${author.id})" style="cursor: pointer">
                                    <img class="rounded-circle border border-2" src="${author.profile_image}" alt="" style="width: 40px;height: 40px;">
                                    <b>${author.username}</b>
                               </span>
                                ${editbuttoncontent}
                                ${deletebuttoncontent}
                            </div>

                            <div class="card-body" onclick="postclicked(${post.id})" style="cursor:pointer" >
                                <img class="w-100" src="${post.image}" >

                                <h6 style="color:gray"class="mt-1">
                                    ${post.created_at}
                                </h6>

                                <h5>
                                    ${posttitle}
                                </h5>

                                <p>
                                    ${post.body}
                                </p>
                                
                                <hr>
                                
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                                    </svg>
                                    <span>
                                        (${post.comments_count}) comments

                                        <span id="post-tags-${post.id}">
                                                    
                                        </span>    
                                    </span>
                                </div>
                            </div>
                        </div>
                        `                    
                        document.getElementById("user-posts").innerHTML+=content 

                        const currentposttagsid = `post-tags-${post.id}`
                        document.getElementById(currentposttagsid).innerHTML=""
                        
                        
                        for(tag of post.tags)
                        {
                            let alltags =
                            `
                            <button class ="btn btn-sm rounded-5" style="background-color:gray;color:white">
                                ${tag.name}
                            </button>    
                            `
                            document.getElementById(currentposttagsid).innerHTML+=alltags
                        }
 
                }

                // handle success
                // console.log(response.data.data);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .finally(function () {
                // always executed
            }); 
    }
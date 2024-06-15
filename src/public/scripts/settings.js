const tabs = Array.prototype.slice.call(document.getElementsByClassName("side-select"))
const tabContents = Array.prototype.slice.call(document.getElementsByClassName("tab-content"))
const settingTitle = document.getElementById("settings-title")
const settingDesc = document.getElementById("settings-desc")

//api 
const userid = getUserID()
const initialData = get(`/users/complete/${userid}`)

//input fields
const profileImg = document.getElementById("profile-img")
const imgInput = document.getElementById("upload-img")
const firstName = document.getElementById("first_name")
const lastName = document.getElementById("last_name")
const email = document.getElementById("email")
const country = document.getElementById("country")
const aboutMe = document.getElementById("about_me")
const currentPassword = document.getElementById("current_password")
const newPassword = document.getElementById("new_password")
const repeatNewPassword = document.getElementById("repeat_new_password")


imgInput.addEventListener("input", inputChanged)
firstName.addEventListener("input", inputChanged)
lastName.addEventListener("input", inputChanged)
email.addEventListener("input", inputChanged)
aboutMe.addEventListener("input", inputChanged)
currentPassword.addEventListener("input", inputChanged)
newPassword.addEventListener("input", inputChanged)
repeatNewPassword.addEventListener("input", inputChanged)

//hide the error message when the input field is changed
function inputChanged(e){
    //get the associated error message based on the id of the input field
    const error = document.getElementById(`${e.target.id.replaceAll("-","_")}-error`)
    error.style.display = "none"
}



// Now, you can safely use .forEach()
tabs.forEach( (ele) => {
    ele.addEventListener("click", () => {
        switchTab(ele)
    });
})


//switch tabs
//hide and show tabs based on the element clicked
function switchTab(tabEle){
    //remove active class from all tabs
    tabs.forEach((ele) => {
        ele.classList.remove("active")
    })
    //hide all tab contents
    tabContents.forEach((ele) => {
        ele.style.display = "none"
    })

    //add active class and show tab
    tabEle.classList.add("active")
    document.getElementById(`${tabEle.id}-tab`).style.display = "block"
    //update the title and desc of the setting tab with the data attributes
    settingDesc.innerText = tabEle.dataset.desc
    settingTitle.innerText = tabEle.dataset.title
}

function imageInput(){
    profileImg.src = URL.createObjectURL(imgInput.files[0])
}

function success(){
    //shows the success alrt for 2 secs
    //start playing the lottie animation + enter text
    document.getElementById("setting-success-content").innerHTML = 
    `<dotlottie-player src="https://lottie.host/4377115b-47bb-4c44-9302-598d7f225602/qpO9TCh4pH.json" background="transparent" speed="0.9" style="width: 60px; height: 60px;" autoplay></dotlottie-player>
    Settings saved`
    //use a slide down animation
    $("#setting-success").slideDown(400)
    setTimeout(function() {
        document.getElementById("setting-success").style.display = "none";
    }, 2000)
}

async function saveAccount(){
    
    //save profile img
    //check that an image has been input
    if (imgInput.files[0]){
        //send it via a form data
        var formDataSend = new FormData();
        formDataSend.append("pic",imgInput.files[0], "fileName.jpg");
        fetch(`/users/update/pic/${userid}`, {method: "PUT", body: formDataSend})
    }

    //save main settings
    const updateData = {
        "id": data.id,
        "first_name": firstName.value,
        "last_name": lastName.value,
        "email": email.value,
        "about_me": aboutMe.value,
        "country": country.value,
    }

    const response = await put("/users/update", updateData)
    const body = await response.json()
    if (response.status == 400 && "message" in body){
        //iterate through all errors, display the error message
        for (var i = 0; i < body.errors.length; i++){
            const x  = body.errors[i]
            console.log(x[0])
            const errorEle = document.getElementById(`${x[0]}-error`) //get the error messasge element associated with the error
            errorEle.innerText = x[1].replaceAll("_"," ").replaceAll('"','') //do a bit of formatting to make the message more readable
            errorEle.style.display = "block"
        }
        return
    }
    //display success message
    success()
}

async function resetSettings(load = false){
    if (load){
        //take initial data
        const response = await initialData
        if (response.status == 500) return
        //cant find user
        if (response.status == 404){
            //log user out and redirect to login page
            localStorage.removeItem("userid")
            sessionStorage.removeItem("userid")
            window.location.href = "login.html"
            return
        }
        //data is global variable
        data = await response.json()
    }
    //set input values
    profileImg.src = `data:image/png;base64,${data.img}`
    firstName.value = data.first_name
    lastName.value = data.last_name
    email.value = data.email
    country.value = data.country
    aboutMe.value = data.about_me
    currentPassword.value = ""
    newPassword.value = ""
    repeatNewPassword.value = ""
}

//call functions on load
resetSettings(true)
switchTab(document.getElementById("account"))
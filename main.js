let currentPage = 1
const API = `http://localhost:8000/contactbook?_page=${currentPage}&_limit=3`

const SECOND_API = "http://localhost:8000/contactbook"
let contactName = $('#contact-name')
let contactSurname = $('#contact-surname')
let contactPhone = $('#contact-phone')
let contactInsta = $('#contact-insta')
let btnSave = $('.btn-save')
let modal = $('.modal')

//! Create
async function addProduct() {
    let name = contactName.val();
    let surname = contactSurname.val()git
    let phone = contactPhone.val()
    let insta = contactInsta.val()
    let product = {
        name,
        surname,
        phone,
        insta,
    }
    try {
        const response = await axios.post(API, product)
        console.log(response)
        Toastify({
            text: response.statusText,
            duration: 3000,
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "center", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "lightblue",
            }
        }).showToast();
        modal.modal("hide")
        render(API)
    } catch (e) {
        Toastify({
            text: e.response.statusText,
            duration: 3000,
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "center", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "red",
            }
        }).showToast();
    }
}

btnSave.on('click', addProduct)

// ! Read 

let list = $('.list')
let prev = $('.prev')
let next = $('.next')
async function render(url) {
    try {
        const response = await axios(url)
        console.log(response.headers.link)
        list.html("")
        response.data.forEach((item) => {
            list.append(`
            <div class="card mt-3 mb-3" style="width: 18rem;">
  <img style="width:100%; object-fit: contain; height: 190px; background-color: orange" src="http://cdn.onlinewebfonts.com/svg/download_357118.png" class="card-img-top" alt="..." >
  <div class="card-body" style="background-color: orange">
    <h5 class="card-title">${item.name}</h5>
    <p class="card-text">${item.surname}</p>
    <p class="card-phone">${item.phone}</p>
    <a href="#" ">${item.insta}</a><br />
    <button style="background-color: purple" id=${item.id} type="button" class="btn btn-primary edit-btn" data-bs-toggle="modal" data-bs-target="#editModal">Change</button>
    <button style="background-color: purple" id=${item.id} type="button" class="btn btn-primary delete-btn" data-bs-target="#editModal">Delete</button>
  </div>
</div>
            `)
        })
        let links = response.headers.link.match(/(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gim)
        if (!links) {
            prev.attr('disabled', 'true')
            next.attr('disabled', 'true')
            return
        }
        if (links.length === 4) {
            prev.attr('id', links[1])
            next.attr('id', links[2])
            prev.removeAttr('disabled')
            next.removeAttr('disabled')
        } else if (links.length === 3 && currentPage === 1) {
            prev.attr('disabled', 'true')
            next.attr('id', links[1])
        } else if (links.length === 3 && currentPage !== 1) {
            next.attr('disabled', 'true')
            prev.attr('id', links[1])
        }
    } catch (e) {
        console.log(e)
    }
}
render(API)

next.on('click', (e) => {
    let url = e.target.id
    render(url)
    currentPage++
})
prev.on('click', (e) => {
    let url = e.target.id
    render(url)
    currentPage--
})

// ! Search 

let searchInp = $('.inp-search')
searchInp.on('input', (e) => {
    let value = e.target.value
    let url = `${API}&q=${value}`
    render(url)
})

// ! Update
let contactNameEdit = $('#contact-name-edit')
let contactSurnameEdit = $('#contact-surname-edit')
let contactPhoneEdit = $('#contact-phone-edit')
let contactInstaEdit = $('#contact-insta-edit')
let btnSaveEdit = $('.btn-save-edit')


$(document).on('click', ".edit-btn", async (e) => {
    let id = e.target.id
    try {
        const response = await axios(`${SECOND_API}/${id}`)
        contactNameEdit.val(response.data.name)
        contactSurnameEdit.val(response.data.surname)
        contactPhoneEdit.val(response.data.phone)
        contactInstaEdit.val(response.data.insta)
        btnSaveEdit.attr('id', id)
    } catch (e) {
        console.log(e)
    }
})

btnSaveEdit.on('click', async (e) => {
    let id = e.target.id
    let name = contactNameEdit.val()
    let surname = contactSurnameEdit.val()
    let phone = contactPhoneEdit.val()
    let insta = contactInstaEdit.val()
    let product = {
        name,
        surname,
        phone,
        insta,
    }
    try {
        await axios.patch(`${SECOND_API}/${id}`, product)
        modal.modal('hide')
        let url = `http://localhost:8000/contactbook?_page=${currentPage}&_limit=3`
        render(url)
    } catch {
        console.log(e)
    }
})

//  ! DElETE

$(document).on('click', '.delete-btn', async (e) => {
    let id = e.target.id
    await axios.delete(`${SECOND_API}/${id}`)
    render(API)
})

<template>
  <div class="mt-2">
    <div v-if="show_files_and_folders" class="mb-5" style="position:relative;">

      <div>
        <draggable
            v-model="website_and_folders"
            group="people"
            @start="drag=true"
            @end="drag=false"
            style=""
            class="show_files_and_folders_div"
            draggable=".item"
        >
          <div class="files_and_folders_div me-2 mt-3">
            <div>
              <span style="height: 15px; width: 50px; background-color: #cecdcd; display: inline-block"></span>
              <span style="height: 15px; width: 150px; background-color: white;display: inline-block;"></span>
            </div>
            <div class="text-center">
              <h6 class="text-center mt-3"><b>My Favorites</b></h6>
              <i class="fas fa-star my-fav-star"></i>
            </div>
          </div>
          <div v-for="item in website_and_folders" :key="item.id" class="files_and_folders_div me-2 mt-3 item">
            <span class="files_and_folder_delete badge bg-danger mt-1 me-1" @click="deleteFileAndFolder(item.id)"><i class="fas fa-trash-alt"></i></span>
            <span v-if="item.type == 'website'" class="files_and_folder_fav badge text-dark mt-1 me-1" v-bind:class="{ 'bg-light': !item.fav, 'bg-warning': item.fav }" @click="favFileAndFolder(item.id)"><i class="far fa-star"></i></span>
            <div v-if="item.type == 'folder'">
              <span style="height: 15px; width: 50px; background-color: #cecdcd; display: inline-block"></span>
              <span style="height: 15px; width: 150px; background-color: white;display: inline-block;"></span>
            </div>

            <div class="text-center" @click="openFolderOrWebsite(item)">

              <h6 class="text-center mt-3"><b>{{ item.name }}</b></h6>
              <img :src="item.image" alt="" v-if="item.type != 'folder'" class="website_image" style="">

              <div class="row ms-3" v-if="item.websites">
                <div class="col-auto" v-if="item.websites.length >= 1">
                  <img :src="item.websites[0].image" alt="" v-if="item.websites" style="max-width: 60px;">
                </div>
                <div class="col-auto" v-if="item.websites.length >= 2">
                  <img :src="item.websites[1].image" alt="" v-if="item.websites" style="max-width: 60px;">
                </div>
              </div>
              <div class="row mt-2 ms-3" v-if="item.websites">
                <div class="col-auto" v-if="item.websites.length >= 3">
                  <img :src="item.websites[2].image" alt="" v-if="item.websites" style="max-width: 60px;">
                </div>
                <div class="col-auto" v-if="item.websites.length >= 4">
                  <img :src="item.websites[3].image" alt="" v-if="item.websites" style="max-width: 60px;">
                </div>
              </div>

            </div>
          </div>
          <div class="add-button" @click="addSiteOrFolder()" style="margin-top: 70px;">
            <div style="padding-top: 20px;">
              <i class="fas fa-plus text-center"></i>
            </div>
            <div>
              Add new site or folder
            </div>
          </div>
        </draggable>




      </div>

      <div v-if="show_folder" class="files_and_folders_div_folder_folder_div">
        <div class="files_and_folders_div_folder">
          <div>
            <span style="height: 15px; width: 3rem; background-color: #cecdcd; display: inline-block; border-left: 1px solid black; border-top: 1px solid black; border-right: 1px solid black;"></span>
            <span style="height: 15px; width: 67rem; background-color: white;display: inline-block; background: transparent; border-bottom: 1px solid black;"></span>
          </div>
          <div v-for="item in selected_folder.websites" :key="'folder_'+item.id" class="files_and_folders_div_folder_inside me-2 mt-3 item">
            <span class="files_and_folder_delete badge bg-danger mt-1 me-1" @click="deleteFileAndFolder(item.id)"><i class="fas fa-trash-alt"></i></span>
            <span v-if="item.type == 'website'" class="files_and_folder_fav badge text-dark mt-1 me-1" v-bind:class="{ 'bg-light': !item.fav, 'bg-warning': item.fav }" @click="favFileAndFolder(item.id)"><i class="far fa-star"></i></span>
            <div v-if="item.type == 'folder'">
              <span style="height: 15px; width: 50px; background-color: #cecdcd; display: inline-block"></span>
              <span style="height: 15px; width: 150px; background-color: white;display: inline-block;"></span>
            </div>

            <div class="text-center" @click="openFolderOrWebsite(item)">

              <h6 class="text-center mt-3"><b>{{ item.name }}</b></h6>
              <img :src="item.image" alt="" v-if="item.type != 'folder'" class="website_image" style="">

            </div>
          </div>
          <div class="add-button" @click="addSiteInFolder()" style="margin-top: 70px; display: inline-block;">
            <div style="padding-top: 20px;">
              <i class="fas fa-plus text-center"></i>
            </div>
            <div>
              Add new site
            </div>
          </div>

          <button class="btn btn-sm btn-secondary" style="position:absolute; top: 17px; right: 4px;" @click="closeFolder()">Close</button>
        </div>
      </div>


    </div>

    <div v-if="add_site_or_folder_form">
      <div class="text-center mt-5">
        <h4 style="display:inline-block;">Add New</h4>
        <a href="javascript:void(0)" style="display:inline-block;" @click="closeSiteOrFolder()" class="ms-5"><span class="badge bg-secondary">Close</span></a>
        <div class="mt-3">
          <button class="btn btn-primary btn-lg me-2" @click="addWebsiteForm()"><i class="fas fa-globe"></i> Website</button>
          <button class="btn btn-primary btn-lg" @click="addFolderForm()"><i class="fas fa-folder"></i> Folder</button>
        </div>
      </div>



    </div>

    <div v-if="add_website_form">
      <div class="row">
        <div class="col-md-3"></div>
        <div class="col-md-6">
          <h4 class="mt-3">Add Website</h4>
          <form action="" @submit.prevent="addWebsite()">
            <div class="mb-3">
              <label for="text_to_put_on_button" class="form-label">Text to Put on Button</label>
              <input type="text" v-model="text_to_put_on_button" class="form-control" id="text_to_put_on_button">
            </div>
            <div class="mb-3">
              <label for="website_url" class="form-label">Website URL</label>
              <input type="text" v-model="website_url" class="form-control" id="website_url">
            </div>
            <div class="mb-3">
              <label for="image_for_button" class="form-label">Image for button</label>
              <div class="row">
                <div class="col-md-6">
                  <img src="https://picsum.photos/200/152" alt="" id="image_for_button" style="max-width: 200px; max-height: 152px;">
                </div>
                <div class="col-md-6">
                  <button class="btn btn-sm btn-outline-primary d-block mb-2">Use this Image</button>
                  <button class="btn btn-sm btn-outline-primary d-block mb-2">Use Favicon</button>
                  <button class="btn btn-sm btn-outline-primary d-block mb-2">Upload Image</button>
                </div>
              </div>
            </div>
            <div class="mb-3">
              <button class="btn btn-primary me-2">Save</button>
              <button class="btn btn-secondary" @click="closeAddWebsiteForm">Close</button>
            </div>

          </form>
        </div>
      </div>

    </div>

    <div v-if="add_folder_form">
      <div class="mt-5 mb-5">
<!--        <div style="background-color: #e0a800; width: 10vw; height: 2vh; margin-left: 13.1vw;"></div>-->
        <svg width="244" height="31" viewBox="0 0 244 31" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-left: 13.1vw;">
          <path d="M0 0H229.5L244 31H0V0Z" fill="#D8C874"/>
        </svg>
        <div style="width: 75vw; height: 75vh;background-color: #ceb874;margin: auto; overflow-y: auto; position: relative;" class="p-3">
          <form @submit.prevent="saveFolder()">
            <div class="row g-3 align-items-center">
              <div class="col-auto">
                <label for="folder_name" class="col-form-label">Folder Name</label>
              </div>
              <div class="col">
                <input type="text" id="folder_name" v-model="folder_name" class="form-control">
              </div>
              <div class="col-auto">
                <button class="btn btn-primary">Add</button>
              </div>
            </div>
          </form>
        </div>



<!--        <svg width="244" height="31" viewBox="0 0 244 31" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0H229.5L244 31H0V0Z" fill="#D8C874"/>
        </svg>-->

<!--        <svg width="1024" height="562" viewBox="0 0 1024 562" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="1024" height="562" fill="#D8C874"/>
        </svg>-->


      </div>
    </div>

  </div>
</template>

<style scoped src="@/assets/bootstrap-5/css/bootstrap.css">
</style>
<style scoped>
.add-button {
  border-radius: 50%;
  background-color: #424143;
  width: 100px;
  height: 100px;
  text-align: center;
  color: white;
  cursor: pointer;
}
.show_files_and_folders_div {
  display:flex;
  flex-wrap: wrap;
}
.files_and_folders_div {
  width: 200px;
  height: 200px;
  background: #ededed;
  position: relative;
  cursor: pointer;
}
.files_and_folder_delete {
  position: absolute;
  top: -9px;
  right: 0px;
  cursor:pointer;
}
.files_and_folder_fav {
  position: absolute;
  top: -9px;
  right: 28px;
  cursor:pointer;
}
.website_image {
  width: 100%;
  max-height: 9.5rem;
}
.my-fav-star {
  font-size: 7rem;
  color: #ffc107;
}

.files_and_folders_div_folder_folder_div {
  position: absolute;
  top: 3rem;
  left: 5rem;
  margin-bottom: 5rem;
}
.files_and_folders_div_folder {
  width: 70rem;
  min-height: 23rem;
  height: auto;
  background: #ededed;
  position: relative;
  cursor: pointer;
  overflow: auto;
  margin-bottom: 5rem;
}
.files_and_folders_div_folder_inside {
  width: 200px;
  height: 200px;
  background: #ededed;
  position: relative;
  cursor: pointer;
  display: inline-block;
}
</style>

<script>
import swal from 'sweetalert'
import draggable from 'vuedraggable'
export default {
  name: 'AddressBook',
  components: {
    draggable
  },
  data() {
    return {
      website_and_folders: [
        {
          id: 1,
          type: "folder",
          name: "First Folder",
          websites: [
            {
              id: 1001,
              type: "website",
              name: "Google",
              link: "https://www.google.co.in/",
              image: "https://picsum.photos/200/200"
            },
            {
              id: 1002,
              type: "website",
              name: "Lorem Picsum",
              link: "https://picsum.photos/",
              image: "https://picsum.photos/200/200"
            },
            {
              id: 1003,
              type: "website",
              name: "Lorem Ipsum",
              link: "https://www.lipsum.com/",
              image: "https://picsum.photos/200/200"
            }
          ],
        },
        {
          id: 2,
          type: "website",
          name: "Google",
          link: "https://www.google.co.in/",
          image: "https://picsum.photos/200/152",
          fav: false
        },
        {
          id: 3,
          type: "website",
          name: "Lorem Picsum",
          link: "https://picsum.photos/",
          image: "https://picsum.photos/200/152",
          fav: false
        },
        {
          id: 4,
          type: "website",
          name: "Figma",
          link: "https://www.figma.com/",
          image: "https://picsum.photos/200/152",
          fav: false
        },
        {
          id: 5,
          type: "website",
          name: "Picsum Photos",
          link: "https://picsum.photos/",
          image: "https://picsum.photos/200/152",
          fav: false
        },
        {
          id: 6,
          type: "website",
          name: "Sample1",
          link: "https://www.lipsum.com/",
          image: "https://picsum.photos/200/152",
          fav: false
        },
        {
          id: 7,
          type: "website",
          name: "Sample2",
          link: "https://www.lipsum.com/",
          image: "https://picsum.photos/200/152",
          fav: false
        }
      ],
      fav_files: [],
      show_files_and_folders: true,
      show_folder: false,
      add_site_or_folder_form: false,
      add_folder_form: false,
      add_website_form: false,
      folder_name: null,
      selected_folder: {},

      //website form
      text_to_put_on_button: null,
      website_url: null

    }
  },
  methods: {
    addSiteOrFolder() {
      this.show_files_and_folders = false
      this.add_site_or_folder_form = true
    },
    closeSiteOrFolder() {
      this.show_files_and_folders = true
      this.add_site_or_folder_form = false
    },
    addWebsiteForm() {
      this.add_site_or_folder_form = false
      this.add_website_form = true
    },
    addFolderForm() {
      //this.show_files_and_folders = true
      this.add_site_or_folder_form = false
      this.add_folder_form = true
    },
    //save new folder
    saveFolder() {
      let folder_obj = {
        type: "folder",
        name: this.folder_name,
        websites: []
      }

      this.website_and_folders.push(folder_obj)
      this.folder_name = null
      this.add_folder_form = false
      this.show_files_and_folders = true
    },
    //delete file or folder
    async deleteFileAndFolder(id) {
      let website = this.website_and_folders.find(obj => obj.id == id)
      //console.log(id)
      let willDelete = await swal({
        title: "Are you sure, you want to delete "+ website.name +"?",
        text: "You can add it again at any time.",
        icon: "warning",
        buttons: ["Don't Delete", "Yes, I'm sure"],
        dangerMode: true,
      })

      if (willDelete) {
        this.website_and_folders = this.website_and_folders.filter(obj => obj.id != id)
        //this.users = this.users.filter(user => user.id != id)
        //this.deleteUser(id)
      } else {
        //pressed cancel button
      }


    },
    //fav file or folder
    favFileAndFolder(id) {
      for (let i = 0; i < this.website_and_folders.length; i++)
      {
        if(this.website_and_folders[i].id == id)
        {
          this.website_and_folders[i].fav = !this.website_and_folders[i].fav
        }
      }
    },
    //add website
    addWebsite() {

    },
    closeAddWebsiteForm() {
      this.add_website_form = false
      this.show_files_and_folders = true
    },
    openFolderOrWebsite(item) {
      if(item.type == "folder")
      {
        //open folder
        this.show_folder = true
        this.selected_folder = item
      }
    },
    addSiteInFolder() {
      this.show_folder = false
      this.selected_folder = {}

      this.add_website_form = true
      this.show_files_and_folders = false
    },
    closeFolder() {
      this.show_folder = false
      this.selected_folder = {}
    }
  }
}
</script>
<!--
Copyright 2020 Raising the Floor - International

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt

The R&D leading to these results received funding from the:
* Rehabilitation Services Administration, US Dept. of Education under
grant H421A150006 (APCP)
* National Institute on Disability, Independent Living, and
Rehabilitation Research (NIDILRR)
* Administration for Independent Living & Dept. of Education under grants
H133E080022 (RERC-IT) and H133E130028/90RE5003-01-00 (UIITA-RERC)
* European Union's Seventh Framework Programme (FP7/2007-2013) grant
agreement nos. 289016 (Cloud4all) and 610510 (Prosperity4All)
* William and Flora Hewlett Foundation
* Ontario Ministry of Research and Innovation
* Canadian Foundation for Innovation
* Adobe Foundation
* Consumer Electronics Association Foundation
-->
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
            :options="{handle:'.item'}"
            animation="200"
            @change="changeOrderOfWebsitesAndFolders"
        >
          <div class="files_and_folders_div me-2 mt-3 folder_background" slot="header" @click="openMyFavoritesFolder()">
            <div class="text-center">
              <h6 class="text-center mt-3"><b>My Favorites</b></h6>
              <font-awesome-icon :icon="['fas', 'star']" class="my-fav-star" />
            </div>
          </div>

          <div v-for="item in website_and_folders" :key="item.id" class="files_and_folders_div me-2 mt-3 item" v-bind:class="{ folder_background: (item.type == 'folder') }">
            <span class="files_and_folder_delete badge bg-info mt-1 me-1" @click="editFolderForm(item.id)" style="right: 30px;" v-if="item.type == 'folder'">
              <font-awesome-icon :icon="['fas','edit']"></font-awesome-icon>
            </span>
            <span class="files_and_folder_delete badge bg-info mt-1 me-1" @click="editWebsite(item.id)" style="right: 28px;" v-if="item.type == 'website'">
              <font-awesome-icon :icon="['fas','edit']"></font-awesome-icon>
            </span>
            <span class="files_and_folder_delete badge bg-danger mt-1 me-1" @click="deleteFileAndFolder(item.id)">
              <font-awesome-icon :icon="['fas','trash']"></font-awesome-icon>
            </span>
            <span v-if="item.type == 'website'" class="files_and_folder_fav badge text-dark mt-1 me-1" v-bind:class="{ 'bg-light': !item.fav, 'bg-warning': item.fav }" @click="favFileAndFolder(item.id)" style="right: 60px;">
              <font-awesome-icon :icon="['fas', 'star']" />
            </span>

            <div class="text-center" @click="openFolderOrWebsite(item)">

              <h6 class="text-center mt-3"><b>{{ item.name }}</b></h6>
              <easy-web-image :image="item" v-if="item.type != 'folder'"></easy-web-image>

              <div class="row ms-3" v-if="item.websites">
                <div class="col-auto" v-if="item.websites.length >= 1">
                  <easy-web-image :image="item.websites[0]" :folderthumb="true" v-if="item.websites" style="max-width: 60px;"></easy-web-image>
                </div>
                <div class="col-auto" v-if="item.websites.length >= 2">
                  <easy-web-image :image="item.websites[1]" :folderthumb="true" v-if="item.websites" style="max-width: 60px;"></easy-web-image>
                </div>
              </div>
              <div class="row mt-2 ms-3" v-if="item.websites">
                <div class="col-auto" v-if="item.websites.length >= 3">
                  <easy-web-image :image="item.websites[2]" :folderthumb="true" v-if="item.websites" style="max-width: 60px;"></easy-web-image>
                </div>
                <div class="col-auto" v-if="item.websites.length >= 4">
                  <easy-web-image :image="item.websites[3]" :folderthumb="true" v-if="item.websites" style="max-width: 60px;"></easy-web-image>
                </div>
              </div>

            </div>
          </div>


          <div class="add-button" @click="addSiteOrFolder()" style="margin-top: 70px;" slot="footer">
            <div style="padding-top: 20px;">
              <font-awesome-icon :icon="['fas', 'plus']" class="text-center"></font-awesome-icon>
            </div>
            <div>
              Add new site or folder
            </div>
          </div>
        </draggable>




      </div>

      <div v-if="show_folder" class="files_and_folders_div_folder_folder_div">
        <div class="files_and_folders_div_folder">

          <div class="m-2">
            <draggable
                v-model="selected_folder.websites"
                group="people1"
                @start="drag=true"
                @end="drag=false"
                style=""
                class="show_files_and_folders_div"
                :options="{handle:'.item'}"
                animation="200"
                @change="changeOrderOfWebsitesAndFolders"
            >
              <div v-for="item in selected_folder.websites" :key="'folder_in_'+item._id" class="files_and_folders_div_folder_inside me-2 mt-3 item" >
                <span class="files_and_folder_delete badge bg-danger mt-1 me-1" @click="deleteFileAndFolder(item._id, selected_folder.id)" v-if="!show_favorites_folder">
                  <font-awesome-icon :icon="['fas', 'trash']"></font-awesome-icon>
                </span>
                <span class="files_and_folder_delete badge bg-info mt-1 me-1" @click="editWebsite(item._id, selected_folder.id)" style="right: 28px;" v-if="item.type == 'website'">
                  <font-awesome-icon :icon="['fas','edit']"></font-awesome-icon>
                </span>

                <div class="text-center" @click="openFolderOrWebsite(item)">

                  <h6 class="text-center mt-3"><b>{{ item.name }}</b></h6>
                  <easy-web-image :image="item" v-if="item.type != 'folder'"></easy-web-image>
                </div>
              </div>

              <div v-for="item in getFavWebsites" :key="'folder_in_fav_'+item.id" class="files_and_folders_div_folder_inside me-2 mt-3 item">

                <div class="text-center" @click="openFolderOrWebsite(item)">

                  <h6 class="text-center mt-3"><b>{{ item.name }}</b></h6>
                  <easy-web-image :image="item" v-if="item.type != 'folder'"></easy-web-image>
<!--                  <img :src="getImageURL(item)" alt="" v-if="item.type != 'folder'" class="website_image" style="">-->

                </div>
              </div>

              <div class="add-button" @click="addSiteInFolder()" style="margin-top: 70px; display: inline-block;" v-if="!show_favorites_folder">
                <div style="padding-top: 20px;">
                  <font-awesome-icon :icon="['fas', 'plus']" class="text-center"></font-awesome-icon>
                </div>
                <div>
                  Add new site
                </div>
              </div>
            </draggable>

            <button class="btn btn-sm btn-secondary" style="position:absolute; top: 17px; right: 4px;" @click="closeFolder()">Close</button>
          </div>

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
          <h4 class="mt-3">Add Website <span v-if="selected_folder.name">to folder {{ selected_folder.name }}</span></h4>
          <form action="" @submit.prevent="addWebsite()">
            <div class="mb-3">
              <label for="text_to_put_on_button" class="form-label">Text to Put on Button</label>
              <input type="text" v-model="text_to_put_on_button" class="form-control" id="text_to_put_on_button" required>
              <small class="text-danger" v-if="text_to_put_on_button_error">{{ text_to_put_on_button_error }}</small>
            </div>
            <div class="mb-3">
              <label for="website_url" class="form-label">Website URL</label>
              <input type="text" v-model="website_url" class="form-control" id="website_url" @blur="getImageFromLink()" required>
              <small class="text-danger" v-if="website_url_error">{{ website_url_error }}</small>
            </div>
            <div class="mb-3">
              <label for="image_for_button" class="form-label">Image for button</label>
              <div class="row">
                <div class="col-md-6">
                  <div v-if="website_autogenerated_image">
                    <img src="@/assets/images/no-image.png" alt="" id="image_for_button" style="max-width: 200px; max-height: 152px;">
                  </div>
                  <div v-if="website_autogenerated_favicon">
                    <img :src="website_sample_image_url" alt="" id="image_for_button_favicon" style="max-width: 200px; max-height: 152px;" v-if="!favicon_loading">
                    <span v-if="favicon_loading">Loading...</span>
                  </div>
                  <div v-if="website_uploaded_image">
                    <vue-dropzone
                        ref="avatarDropzone"
                        id="dropzone"
                        :options="dropzoneOptions"
                        @vdropzone-complete="handleVueDropzoneComplete"
                        class="mb-2"
                        @vdropzone-removed-file="onRemoveUploadingFile"
                    ></vue-dropzone>
                  </div>

                  <small class="text-danger" v-if="website_image_error">{{ website_image_error }}</small>
                </div>
                <div class="col-md-6">
                  <a href="javascript:void(0)" class="btn btn-sm btn-outline-primary d-block mb-2" @click="useAutoGeneratedFavicon()">Use Favicon</a>
                  <a href="javascript:void(0)" class="btn btn-sm btn-outline-primary d-block mb-2" @click="useUploadedImage()">Upload Image</a>
                </div>
              </div>
            </div>
            <div class="mb-3">
              <button class="btn btn-primary me-2" type="submit">Save</button>
              <button class="btn btn-secondary" @click="closeAddWebsiteForm">Close</button>
            </div>

          </form>
        </div>
      </div>

    </div>

    <div v-if="edit_website_form">
      <div class="row">
        <div class="col-md-3"></div>
        <div class="col-md-6">
          <h4 class="mt-3">Edit Website <span v-if="selected_folder.name">to folder {{ selected_folder.name }}</span></h4>
          <form action="" @submit.prevent="updateWebsite()">
            <div class="mb-3">
              <label for="text_to_put_on_button" class="form-label">Text to Put on Button</label>
              <input type="text" v-model="text_to_put_on_button" class="form-control" id="text_to_put_on_button" required>
              <small class="text-danger" v-if="text_to_put_on_button_error">{{ text_to_put_on_button_error }}</small>
            </div>
            <div class="mb-3">
              <label for="website_url" class="form-label">Website URL</label>
              <input type="text" v-model="website_url" class="form-control" id="website_url" @blur="getImageFromLink()" required>
              <small class="text-danger" v-if="website_url_error">{{ website_url_error }}</small>
            </div>
            <div class="mb-3">
              <label for="image_for_button" class="form-label">Image for button</label>
              <div class="row">
                <div class="col-md-6">

                  <div v-if="imageType == 'favcon'">
                    <img :src="website_sample_image_url" alt="" id="image_for_button_favicon" style="max-width: 200px; max-height: 152px;" v-if="!favicon_loading">
                    <span v-if="favicon_loading">Loading...</span>
                  </div>
                  <div v-if="imageType == 'uploaded'">
                    <vue-dropzone
                        ref="avatarDropzone"
                        id="dropzone"
                        :options="dropzoneOptions"
                        @vdropzone-complete="handleVueDropzoneComplete"
                        class="mb-2"
                        :image="edit_website_signed_image_url"
                        @vdropzone-removed-file="onRemoveUploadingFile"
                    ></vue-dropzone>
                  </div>

                  <small class="text-danger" v-if="website_image_error">{{ website_image_error }}</small>
                </div>
                <div class="col-md-6">
                  <a href="javascript:void(0)" class="btn btn-sm btn-outline-primary d-block mb-2" @click="useAutoGeneratedFavicon()">Use Favicon</a>
                  <a href="javascript:void(0)" class="btn btn-sm btn-outline-primary d-block mb-2" @click="useUploadedImage()">Upload Image</a>
                </div>
              </div>
            </div>
            <div class="mb-3">
              <button class="btn btn-primary me-2" type="submit">Save</button>
              <button class="btn btn-secondary" @click="closeAddWebsiteForm" type="button">Close</button>
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
                <input type="text" id="folder_name" v-model="folder_name" class="form-control" autocomplete="off">
              </div>
              <div class="col-auto">
                <button class="btn btn-primary" type="submit">Add</button>
                <button class="btn btn-secondary ms-3" @click="closeAddFolderForm">Close</button>
              </div>
            </div>
          </form>
        </div>


      </div>
    </div>
    <div v-if="edit_folder_form">
      <div class="mt-5 mb-5">
        <!--        <div style="background-color: #e0a800; width: 10vw; height: 2vh; margin-left: 13.1vw;"></div>-->
        <svg width="244" height="31" viewBox="0 0 244 31" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-left: 13.1vw;">
          <path d="M0 0H229.5L244 31H0V0Z" fill="#D8C874"/>
        </svg>
        <div style="width: 75vw; height: 75vh;background-color: #ceb874;margin: auto; overflow-y: auto; position: relative;" class="p-3">
          <form @submit.prevent="updateFolder()">
            <div class="row g-3 align-items-center">
              <div class="col-auto">
                <label for="folder_name" class="col-form-label">Folder Name</label>
              </div>
              <div class="col">
                <input type="text" id="folder_name" v-model="folder_name" class="form-control" autocomplete="off">
              </div>
              <div class="col-auto">
                <button class="btn btn-primary" type="submit">Update</button>
                <button class="btn btn-secondary ms-3" @click="closeAddFolderForm">Close</button>
              </div>
            </div>
          </form>
        </div>


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
.folder_background {
  /*background: #cecdcd;*/
  background: #f5e593;
}
.website_background {
  background: #ededed;
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
  max-width: 100%;
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
  background: #fff6bd;
  position: relative;
  cursor: pointer;
  overflow: auto;
  margin-bottom: 5rem;
  border: 1px solid black;
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
import axios from "axios"
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import noImage from '@/assets/images/no-image.png'
import EasyWebImage from "./EasyWebImage";
//import captureWebsite from 'capture-website'


export default {
  name: 'EasyWeb',
  components: {
    draggable,
    vueDropzone: vue2Dropzone,
    EasyWebImage
  },
  data() {
    return {
      website_and_folders: [],
      fav_files: [],
      show_files_and_folders: true,
      show_folder: false,
      add_site_or_folder_form: false,
      add_folder_form: false,
      edit_folder_form: false,
      add_website_form: false,
      edit_website_form: false,
      folder_name: null,
      selected_folder: {},
      show_favorites_folder: false,

      //website form
      text_to_put_on_button: null,
      website_url: null,
      website_image: null,

      text_to_put_on_button_error: null,
      website_url_error: null,
      website_image_error: null,

      website_autogenerated_image: false,
      website_autogenerated_favicon: true,
      website_uploaded_image: false,
      website_sample_image_url: noImage,

      websiteImageFileName: null,
      websiteImageMimeType: null,
      websiteImagePath: null,


      change_edit_image: false,
      edit_website_object: null,
      edit_website_signed_image_url: null,
      imageType: null,
      edit_id: null,


      //loading
      favicon_loading: false

    }
  },
  computed: {
    dropzoneOptions() {
      return {
        paramName: 'avatar',
        url: process.env.VUE_APP_API_HOST_NAME + "/api/temp/upload-image",
        thumbnailWidth: 150,
        maxFilesize: 50, //in MB
        maxFiles: 1,
        params: {
          id: this.$route.params.id,
          type: 'website_temp_image'
        },
        addRemoveLinks: true
      }

    },
    getFavWebsites() {
      if(this.show_favorites_folder)
        return this.website_and_folders.filter(obj => obj.fav == true)
      else
        return []
    }
  },
  mounted() {
    this.loadWebsiteAndFolders()
  },
  methods: {
    //load existing website & folders
    loadWebsiteAndFolders() {
      let self = this
      axios.post(process.env.VUE_APP_API_HOST_NAME+"/api/assistant/user/easyweb/get-all-websites-and-folders", {
        id: self.$route.params.id
      })
      .then((response) => {
        if(response.data.status)
        {
          let websitesAndFolders = response.data.data
          websitesAndFolders.map((obj, index) => {
            obj.order = index + 1
          })

          this.website_and_folders = websitesAndFolders

        }
        else
        {
          console.log(response.data)
        }

      }, (error) => {
        console.log(error)
      })
    },
    //get image URL for website
    getImageURL(item) {
      if(item.imageType == "uploaded" || !item.imageType)
      {
        let b64 = 'data:'

        b64 = b64 + item.imageMimeType
        b64 = b64 + ';base64,'
        b64 = b64 + item.imageData
        return b64
        //return process.env.VUE_APP_API_HOST_NAME + image
      }
      else
      {
        return item.image
      }

    },
    //click on add site or folder button
    addSiteOrFolder() {
      this.show_files_and_folders = false
      this.add_site_or_folder_form = true
    },
    //close the main add site or folder button
    closeSiteOrFolder() {
      this.show_files_and_folders = true
      this.add_site_or_folder_form = false
    },
    //show add website form
    addWebsiteForm() {
      this.add_site_or_folder_form = false
      this.add_website_form = true
    },
    //show add folder form
    addFolderForm() {
      //this.show_files_and_folders = true
      this.add_site_or_folder_form = false
      this.add_folder_form = true
    },
    /** show edit folder form **/
    editFolderForm(item_id) {
      this.add_site_or_folder_form = false
      this.edit_folder_form = true
      this.show_files_and_folders = false

      let folder = this.website_and_folders.find(obj => obj.id == item_id)
      this.folder_name = folder.name
      this.edit_id = item_id
    },
    //save new folder
    saveFolder() {
      let self = this
      if (this.folder_name)
      {
        //console.log(self, axios)
        //console.log("here", self.folder_name)
        axios.post(process.env.VUE_APP_API_HOST_NAME+'/api/assistant/user/easyweb/add-folder', {
          id: self.$route.params.id,
          folder_name: self.folder_name
        })
        .then((response) => {
          if(response.data.status)
          {
            self.website_and_folders.push(response.data.data)

            self.closeAddFolderForm()
          }


        }, (error) => {
          console.log(error)
        })

        /*let folder_obj = {
          type: "folder",
          name: this.folder_name,
          websites: []
        }

        this.website_and_folders.push(folder_obj)
        this.folder_name = null
        this.add_folder_form = false
        this.show_files_and_folders = true*/
      }
      else {
        console.log("no folder name")
      }

    },
    /** update folder name **/
    updateFolder() {
      if(this.folder_name)
      {
        let self = this
        axios.post(process.env.VUE_APP_API_HOST_NAME+'/api/assistant/user/easyweb/update-folder', {
          id: self.$route.params.id,
          edit_id: self.edit_id,
          folder_name: self.folder_name
        })
        .then((response) => {
          if(response.data.status)
          {
            //console.log(response.data)
            self.website_and_folders = response.data.data


            self.closeAddFolderForm()
          }


        }, (error) => {
          console.log(error)
        })
      }

    },
    //delete file or folder
    async deleteFileAndFolder(id, parent_id) {
      let self = this
      let website = null
      let parent_folder = null
      if(parent_id)
      {
        parent_folder = this.website_and_folders.find(obj => obj.id == parent_id)
        //console.log("parent folder", parent_folder)
        website = parent_folder.websites.find(obj => obj._id == id)
      }
      else
      {
        website = this.website_and_folders.find(obj => obj.id == id)
      }


      let willDelete = await swal({
        title: "Are you sure, you want to delete "+ website.name +"?",
        text: "You can add it again at any time.",
        icon: "warning",
        buttons: ["Don't Delete", "Yes, I'm sure"],
        dangerMode: true,
      })

      if (willDelete) {
        axios.post(process.env.VUE_APP_API_HOST_NAME+"/api/assistant/user/easyweb/delete-website-or-folder", {
          id: self.$route.params.id,
          item_id: id,
          parent_id: parent_id
        })
        .then((response) => {
          if(response.data.status)
          {
            if(parent_id)
            {
              for (let i = 0; i < self.website_and_folders.length; i++)
              {
                if(self.website_and_folders[i].id == parent_id)
                {
                  self.website_and_folders[i].websites = self.website_and_folders[i].websites.filter(obj => obj._id != id)
                }
              }
            }
            else
            {
              self.website_and_folders = self.website_and_folders.filter(obj => obj.id != id)
            }

          }
          else
          {
            //
          }
        }, (error) => {
          console.log(error)
        })

        //this.users = this.users.filter(user => user.id != id)
        //this.deleteUser(id)
      } else {
        //pressed cancel button
        console.log("Canceled")
      }


    },
    //fav file or folder
    favFileAndFolder(id) {
      let self = this
      //this.website_and_folders.filter(obj => obj.)
      for (let i = 0; i < this.website_and_folders.length; i++)
      {
        if(this.website_and_folders[i].id == id)
        {
          //console.log("websites_and_folders[i]", this.website_and_folders[i].fav)
          axios.post(process.env.VUE_APP_API_HOST_NAME+"/api/assistant/user/easyweb/website-fav", {
            id: self.$route.params.id,
            website_id: self.website_and_folders[i],
            website_fav: !self.website_and_folders[i].fav
          })
          .then(() => {

            self.website_and_folders[i].fav = !self.website_and_folders[i].fav
          }, (error) => {
            console.log(error)
          })
          //this.website_and_folders[i].fav = !this.website_and_folders[i].fav
        }
      }
    },
    //add website
    addWebsite() {
      let self = this
      if(!this.text_to_put_on_button || this.text_to_put_on_button == "")
      {
        this.text_to_put_on_button_error = "Please enter correct value."
      }
      else if (!this.website_url || this.website_url == "")
      {
        this.website_url_error = "Please enter correct website URL."
      }
      else if (this.website_uploaded_image && (!this.websiteImageFileName || this.websiteImageFileName == ""))
      {
        this.website_image_error = "Image is not valid"
      }
      else if (this.website_autogenerated_favicon && (!this.website_sample_image_url || this.website_sample_image_url == ""))
      {
        this.website_image_error = "Image is not valid"
      }
      else
      {
        this.text_to_put_on_button_error = null
        this.website_url_error = null
        this.website_image_error = null
        //validation success
        axios.post(process.env.VUE_APP_API_HOST_NAME+"/api/assistant/user/easyweb/add-website", {
          id: self.$route.params.id,
          text_to_put_on_button: self.text_to_put_on_button,
          website_url: self.website_url,
          website_image: self.website_image,
          websiteImageFileName: self.websiteImageFileName,
          websiteImageMimeType: self.websiteImageMimeType,
          websiteImagePath: self.websiteImagePath,
          selected_folder: self.selected_folder,
          website_sample_image_url: self.website_sample_image_url
        })
        .then((response) => {
          if(response.data.status)
          {
            let website_obj = response.data.data
            //console.log("website_obj", website_obj)
            //console.log("website obj", website_obj.image)
            if(self.selected_folder.id)
            {
              for(let i = 0; i < self.website_and_folders.length; i++)
              {
                if(self.website_and_folders[i].id == self.selected_folder.id)
                {
                  self.website_and_folders[i].websites = website_obj.websites
                  //self.website_and_folders[i].websites.push(website_obj)
                }
              }
            }
            else
            {
              self.website_and_folders.push(website_obj)

              self.website_and_folders.map((obj, index) => {
                obj.order = index + 1
              })
            }


            self.closeAddWebsiteForm()
          }
          else
          {
            console.log(response.data)
          }

        }, (error) => {
          console.log(error)
        })
      }
    },
    /** change edit image flag only useful for updating website, true for uploading new image **/
    changeEditImage() {
      this.change_edit_image = true
    },
    /** change_edit_image flag only useful for updating website, false false for using previous image **/
    usePrevEditImage() {
      this.change_edit_image = false
    },
    /** editWebsite **/
    editWebsite(item_id) {
      this.edit_id = item_id
      console.log("edit website", item_id)
      this.show_files_and_folders = false
      this.edit_website_form = true

      //get editing item
      let website
      if(this.selected_folder && this.selected_folder.id)
      {
        website = this.selected_folder.websites.find(obj => obj._id == item_id)
        console.log("website", item_id, this.selected_folder, website)
      }
      else
      {
        website = this.website_and_folders.find(obj => obj.id == item_id)
      }
      //console.log(website)

      this.text_to_put_on_button = website.name
      this.website_url = website.link

      this.imageType = website.imageType

      if (this.imageType == "favcon")
      {
        this.website_sample_image_url = website.image
      }
      else if (this.imageType == "uploaded")
      {
        this.websiteImageFileName = website.imageFileName
        this.websiteImagePath = website.imagePath
        this.websiteImageMimeType = website.imageMimeType

        //get signed url
        let self = this
        axios.post(process.env.VUE_APP_API_HOST_NAME+"/api/get-private-image", {
          photo: {
            path: website.imagePath,
            name: website.imageFileName
          },
          signed: true
        })
          .then((response) => {

            let imageData = response.data.data

            self.$nextTick(function () {
              let file = { size: 123, name: "Website Image", type: "image/png" }
              let url = imageData
              self.$refs.avatarDropzone.manuallyAddFile(file, url)
            })

            //self.edit_website_signed_image_url = imageData

          }, (error) => {
            console.log(error)
          })




      }

      /*if(website.imageType == "favcon")
      {
        this.website_autogenerated_favicon = true
        this.website_uploaded_image = false
      }
      else if (website.imageType == "uploaded")
      {
        this.website_autogenerated_favicon = false
        this.website_uploaded_image = true
      }*/

      /*let self = this
      axios.post(process.env.VUE_APP_API_HOST_NAME+"/api/get-private-image", {
        photo: {
          path: website.imagePath,
          name: website.imageFileName
        },
        signed: true
      })
          .then((response) => {

            let imageData = response.data.data

            self.edit_website_signed_image_url = imageData

            /!*setTimeout(function () {
              self.showEditAvatar = true
            }, 1000)*!/

          }, (error) => {
            console.log(error)
          })*/

      this.$nextTick(function () {
        this.edit_website_object = website
      })

    },
    /** delete file from dropzone params(file, error, xhr)**/
    onRemoveUploadingFile()
    {
      this.websiteImageFileName = null
      this.websiteImageMimeType = null
      this.websiteImagePath = null
    },
    /** update website **/
    updateWebsite() {
      let self = this
      let selected_folder_id
      if(this.selected_folder && this.selected_folder.id)
      {
        selected_folder_id = this.selected_folder.id
      }
      if(!this.text_to_put_on_button || this.text_to_put_on_button == "")
      {
        this.text_to_put_on_button_error = "Please enter correct value."
      }
      else if (!this.website_url || this.website_url == "")
      {
        this.website_url_error = "Please enter correct website URL."
      }
      //else if (this.imageType == "uploaded" && (!this.websiteImageFileName || this.websiteImageFileName == "") && this.change_edit_image)
      else if (this.imageType == "uploaded" && !this.websiteImageFileName)
      {
        this.website_image_error = "Image is not valid"
      }
      //else if (this.imageType == "favcon" && this.website_autogenerated_favicon && (!this.website_sample_image_url || this.website_sample_image_url == "") && this.change_edit_image)
      else if (this.imageType == "favcon" && !this.website_autogenerated_favicon)
      {
        this.website_image_error = "Image is not valid"
      }
      else
      {
        this.text_to_put_on_button_error = null
        this.website_url_error = null
        this.website_image_error = null

        let update_object = {
          id: self.$route.params.id,
          edit_id: self.edit_id,
          text_to_put_on_button: self.text_to_put_on_button,
          website_url: self.website_url,
          website_image: self.website_image,
          websiteImageFileName: self.websiteImageFileName,
          websiteImageMimeType: self.websiteImageMimeType,
          websiteImagePath: self.websiteImagePath,
          selected_folder: self.selected_folder,
          website_sample_image_url: self.website_sample_image_url,
          change_edit_image: self.change_edit_image
        }

        //validation success
        axios.post(process.env.VUE_APP_API_HOST_NAME+"/api/assistant/user/easyweb/update-website", update_object)
        .then((response) => {
          if(response.data.status)
          {
            let website_obj = response.data.data
            if(response.data.status)
            {
              self.website_and_folders = website_obj
              let sf = self.website_and_folders.find(obj => obj.id == selected_folder_id)
              self.show_folder = false
              self.$nextTick(function () {
               self.openFolderOrWebsite(sf)
              })


            }

            self.closeAddWebsiteForm()
          }
          else
          {
            console.log(response.data)
          }

        }, (error) => {
          console.log(error)
        })
      }
    },
    /** close the add website form **/
    closeAddWebsiteForm() {
      this.add_website_form = false
      this.show_files_and_folders = true

      //clear form
      this.selected_folder = {}
      this.text_to_put_on_button = null
      this.website_url = null
      this.website_image = null
      this.website_sample_image_url = noImage

      this.websiteImageFileName = null
      this.websiteImageMimeType = null
      this.websiteImagePath = null

      this.change_edit_image = false
      this.edit_website_object = null
      this.edit_website_form = false

      this.imageType = null
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
      //this.selected_folder = {}
      this.add_website_form = true
      this.show_files_and_folders = false
    },
    closeFolder() {
      this.show_folder = false
      this.selected_folder = {}
      this.show_favorites_folder = false
    },
    //add folder
    addFolder() {

    },
    //closer the add folder form
    closeAddFolderForm() {
      this.add_site_or_folder_form = false
      this.add_folder_form = false
      this.edit_folder_form = false
      this.folder_name = null
      this.show_files_and_folders = true
      this.edit_id = null

    },
    //handle response of uploaded image via dropzone
    handleVueDropzoneComplete(response) {
      if(response.status == "success")
      {
        let data = response.xhr.response
        //let filename = response.upload.filename
        data = JSON.parse(data)
        if(data.data && data.data.imageFileName)
        {
          this.websiteImageFileName = data.data.imageFileName
          this.websiteImageMimeType = data.data.imageMimeType
          this.websiteImagePath = data.data.imagePath
        }
        else
        {
          this.website_image = data.data
        }

        //this.website_image = data.data
      }
    },
    useAutoGeneratedImage() {
      this.website_autogenerated_image = true
      this.website_autogenerated_favicon = false
      this.website_uploaded_image = false
    },
    useAutoGeneratedFavicon() {
      this.website_autogenerated_image = false
      this.website_autogenerated_favicon = true
      this.website_uploaded_image = false
      this.imageType = "favcon"
    },
    useUploadedImage() {
      this.website_autogenerated_image = false
      this.website_autogenerated_favicon = false
      this.website_uploaded_image = true
      this.imageType = "uploaded"
    },
    //after changing the order of websites & folders
    changeOrderOfWebsitesAndFolders() {
      let self = this
      this.website_and_folders.map((obj, index) => {
        obj.order = index + 1
      })

      axios.post(process.env.VUE_APP_API_HOST_NAME+"/api/assistant/user/easyweb/change-order-websites-and-folders", {
        website_and_folders: self.website_and_folders
      })
      .then((response) => {
        console.log(response.data)
      }, (error) => {
        console.log(error)
      })
    },
    //get a image from a link
    async getImageFromLink() {
      let self = this
      if(this.website_autogenerated_favicon)
      if (!this.website_url || this.website_url == "")
      {
        self.website_sample_image_url = noImage
        //console.log("you are in if")
      }
      else
      {
        if(self.website_autogenerated_favicon)
        {
          self.favicon_loading = true
          //let image = await captureWebsite.file('https://sindresorhus.com', 'screenshot.png')
          //console.log("image", image)
          axios.post(process.env.VUE_APP_API_HOST_NAME+"/api/assistant/user/easyweb/get-website-snapshot-from-url", {
            website_url: self.website_url,
            website_autogenerated_image: self.website_autogenerated_image,
            website_autogenerated_favicon: self.website_autogenerated_favicon,
            website_uploaded_image: self.website_uploaded_image
          })
          .then((response) => {
            self.favicon_loading = false
            //console.log(response.data)
            if(response.data.status && response.data.data)
            {
              self.website_sample_image_url = response.data.data
            }
            else
            {
              self.website_sample_image_url = noImage
              //
            }
            //website_sample_image_url
          }, (error) => {
            self.favicon_loading = false
            console.log(error)
          })
        }
        else {
          self.website_autogenerated_favicon = noImage
        }
      }
    },
    //open my favorites folder
    openMyFavoritesFolder()
    {
      this.show_favorites_folder = true
      this.show_folder = true
      console.log("openMyFavoritesFolder")
    }
  }
}
</script>
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
  <div class="container-fluid row">
    <div class="col-md-12">

      <button class="btn btn-primary float-end mt-3 mb-2" @click="addFolder">Add Folder</button>
      <!--      <button class="btn btn-primary float-end mt-3" @click="uploadImages" v-if="current_folder != null">Upload Images</button>-->

    </div>
    <div class="col-md-12">
      <!--      <i class="fas fa-folder-open"></i>-->
      <div class="row">
        <div class="col-md-3">
          <div style="border-right: 1px solid #d4d4d4">
            <draggable
                v-model="folders"
                group="people"
                @start="drag=true"
                @end="drag=false"
                style=""
                :options="{ animation:200 }"
                @change="folderMoved"
            >
              <a href="javascript:void(0)" class="user-folder me-3 mb-3" :ref="'folder_'+index" v-bind:class="(current_folder && current_folder.id == folder.id)?'folder-selected':''" v-for="(folder, index) in folders" :key="folder.id" @click="openFolder(folder.id)" style="text-decoration: none;" @keydown="folderKeyDown($event, index)">
                  <i class="fas fa-folder folder-icon me-2"></i>
                  <div>{{ folder.name }}</div>
              </a>

            </draggable>
          </div>
        </div>
        <div class="col-md-4">
          <div class="photos-list" style="position: relative;" v-if="current_folder != null">
            <vue-dropzone
                ref="avatarDropzone"
                id="dropzone"
                :options="dropzoneOptions"
                @vdropzone-complete="handleVueDropzoneComplete"
                @vdropzone-sending="sendingDropzoneEvent"
                class="mb-2"
            ></vue-dropzone>

            <div class="list-group address-book-contact-list mb-5" id="address-book-contact-list" style="max-height: 75vh; overflow-y: scroll;">
              <a href="javascript:void(0)" class="list-group-item list-group-item-action address-book-list-item" :ref="'photo_'+index" v-bind:class="(current_photo.id == photo._id)?'active':''"  v-for="(photo, index) in current_folder.photos" :key="photo._id" @click="showPhoto(photo)" @keydown="photoKeyDown($event, index)">
                {{ photo.name }}
              </a>
            </div>
          </div>
        </div>
        <div class="col-md-5 text-center">
          <img :src="getImageData(current_photo)" v-if="!loading_image" alt="" style="max-height: 100%; max-width: 100%;" class="mb-5">
          <h4 class="text-center mt-5" v-if="loading_image">Loading...</h4>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped src="@/assets/bootstrap-5/css/bootstrap.css">
</style>

<style scoped>
.user-folder {
  background-color: #fff;
  border: 1px solid #dadce0;
  border-radius: 6px;
  display: flex;
  overflow: hidden;
  position: relative;
  transition: box-shadow 200ms cubic-bezier(0.4,0.0,0.2,1);
  padding: 15px;
  font-size: 20px;
  flex: 0 0 100%;
  cursor: pointer;
}
.folder-selected {
  background-color: #d4d4d4;
}

/* width */
.address-book-contact-list::-webkit-scrollbar {
  width: 3px;
}

/* Track */
.address-book-contact-list::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
.address-book-contact-list::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
.address-book-contact-list::-webkit-scrollbar-thumb:hover {
  background: #555;
}

a.list-group-item.list-group-item-action.address-book-list-item:focus {
  border: 1px solid black;
}
</style>

<script>
import swal from 'sweetalert'
import draggable from 'vuedraggable'

//Dropzone
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import axios from "axios";

export default {
  name: 'Photos',
  components: {
    draggable,
    vueDropzone: vue2Dropzone
  },
  data() {
    return {
      id: 1,
      photo_id: null,
      folders: [],
      current_folder: null,
      myFiles: [],
      current_photo: {},
      loading_image: false,
      current_photo_index: 0,
      current_folder_index: 0,
      current_index_scroll: 'folder'

    }
  },
  computed: {
    dropzoneOptions() {
      return {
        paramName: 'avatar',
        url: process.env.VUE_APP_API_HOST_NAME + "/api/upload-image",
        thumbnailWidth: 150,
        maxFilesize: 50, //in MB
        headers: { "My-Awesome-Header": "header value" },
        params: {
          id: this.$route.params.id
        }
      }

    }
  },
  mounted() {
    this.loadFolders()

    window.addEventListener('keydown', (e) => {
      switch (e.keyCode) {
        case 37:
          //alert('left');
            //this.current_index_scroll = "photo"
          break;
        case 38:
          //alert('up');
          /*if(this.current_photo.id && this.current_index_scroll == "photo")
          {
            let new_photo_index
            if(this.current_photo_index == 0)
            {
              new_photo_index = this.current_folder.photos.length - 1
              let el = this.$refs['photo_'+new_photo_index][0]
              if(el)
              {
                el.focus({
                  behavior: "smooth"
                })
              }
              this.current_photo_index = new_photo_index
            }
            else {
              new_photo_index = this.current_photo_index - 1
              let el = this.$refs['photo_'+new_photo_index][0]
              if(el)
              {
                el.focus({
                  behavior: "smooth"
                })
              }

              this.current_photo_index = new_photo_index
            }

          }
          else if(this.folders.length && this.current_index_scroll == "folder")
          {
            let new_folder_index
            if(this.current_folder_index == 0)
            {
              new_folder_index = this.folders.length - 1
              let el = this.$refs['folder_'+new_folder_index][0]
              if(el)
              {
                el.focus({
                  behavior: "smooth"
                })
              }
              this.current_folder_index = new_folder_index
            }
            else
            {
              new_folder_index = this.current_folder_index - 1
              let el = this.$refs['folder_'+new_folder_index][0]
              if(el)
              {
                el.focus({
                  behavior: "smooth"
                })
              }

              this.current_folder_index = new_folder_index
            }
          }*/
          break;
        case 39:
          //alert('right');
            /*if(this.folders && this.folders.length && this.folders[this.current_folder_index])
            {
              this.openFolder(this.folders[this.current_folder_index].id)
            }*/

          break;
        case 40:
          //alert('down');
            /*if(this.current_photo.id && this.current_index_scroll == "photo")
            {
              let new_photo_index = this.current_photo_index + 1
              if(this.current_folder.photos && this.current_folder.photos[new_photo_index])
              {
                let el = this.$refs['photo_'+new_photo_index][0]
                if(el)
                {
                  el.focus({
                    behavior: "smooth"
                  })
                }
                this.current_photo_index = new_photo_index
              }
              else {
                let el = this.$refs['photo_0'][0]
                if(el)
                {
                  el.focus({
                    behavior: "smooth"
                  })
                }
                this.current_photo_index = 0
              }
            }
            else if(this.folders.length && this.current_index_scroll == "folder")
            {
              let new_folder_index = this.current_folder_index + 1
              if(this.folders && this.folders[new_folder_index])
              {
                let el = this.$refs['folder_'+new_folder_index][0]
                if(el)
                {
                  el.focus({
                    behavior: "smooth"
                  })
                }
                this.current_folder_index = new_folder_index
              }
              else {
                let el = this.$refs['folder_0'][0]
                if(el)
                {
                  el.focus({
                    behavior: "smooth"
                  })
                }
                this.current_folder_index = 0
              }
            }*/


          break;
      }
    });
  },
  methods: {
    /** Load existing folders **/
    loadFolders() {
      let self = this
      axios.post(process.env.VUE_APP_API_HOST_NAME+'/api/assistant/user/get-all-folders', {
        id: self.$route.params.id
      }).then((response) => {
        let folders = response.data.data
        folders.sort((a, b) => {
          return a.order - b.order
        })
        self.folders = response.data.data
        /*console.log("self.folders", self.folders)
        console.log("self.folders.photos", self.folders.photos)
        console.log("self.folders.photos.length", self.folders.photos.length)*/
        /*if(self.folders.photos.length)
        {
          self.loading_image = true
          axios.post(process.env.VUE_APP_API_HOST_NAME+"/api/get-private-image", {
            id: self.$route.params.id,
            photo: self.folders.photos[0]
          })
          .then((response)=>{
            console.log("photos", response.data)
          }, (error) => {
            console.log(error)
          })
        }*/


      }, (error) => {
        console.log(error)
      })
    },
    /**get image data from current photo object **/
    getImageData(current_photo) {
      if(current_photo && current_photo.mimetype)
      {
        let b64 = 'data:'

        b64 = b64 + current_photo.mimetype
        b64 = b64 + ';base64,'
        b64 = b64 + current_photo.data
        return b64
      }
      else {
        return ''
      }

    },
    /** Add folder popup & add folder if not existing **/
    addFolder() {
      let self = this
      swal({
        text: "Enter folder name",
        content: 'input',
        button: {
          text: "Create",
          closeModal: false,
        },
        closeOnClickOutside: false,
        closeOnEsc: false
      })
          .then((value) => {
            if(value && value != "") {
              //check if folder name already exists
              let existing = null
              console.log("folders le", self)
              if(self.folders.length)
                existing = self.folders.find(obj => obj.name == value)

              if(!existing)
              {


                //save entry to database
                axios.post(process.env.VUE_APP_API_HOST_NAME+'/api/assistant/user/add-folder/',{
                  id: self.$route.params.id,
                  name: value
                })
                .then((response) => {
                  console.log(response)

                  self.folders.push({
                    "id": response.data.data.id,
                    "name": value,
                    "photos": []
                  })
                }, (error) => {
                  console.log(error)
                })
              }


            }
            swal.stopLoading();
            swal.close();
          })
    },
    openFolder(id) {
      this.current_folder = this.folders.find(obj => obj.id == id)
      if(this.current_folder.photos && this.current_folder.photos.length)
      {
        this.showPhoto(this.current_photo = this.current_folder.photos[0])
      }
      else
      {
        this.current_photo = {}
      }

    },
    /** show photo after getting it from the server **/
    showPhoto(photo) {
      let self = this
      this.loading_image = true
      axios.post(process.env.VUE_APP_API_HOST_NAME+"/api/get-private-image", {
        id: this.$route.params.id,
        photo: photo
      })
      .then((response) => {
        self.loading_image = false
        //console.log(response.data)
        self.current_photo = {
          id: photo._id,
          mimetype: photo.mimetype,
          data: response.data.data
        }
      }, (error) => {
        self.loading_image = false
        console.log(error)
      })

    },
    /** handle dropzone response after uploading image **/
    handleVueDropzoneComplete(response) {
      if(response.status == "success")
      {
        let data = response.xhr.response
        //let filename = response.upload.filename
        data = JSON.parse(data)
        //console.log("Data", data)
        if(data.data.id == this.current_folder.id)
        {
          this.current_folder = data.data
        }

        for (let i = 0; i < this.folders.length; i++) {
          if (this.folders[i].id == data.data.id)
          {
            this.folders[i] = data.data
          }
        }

        //this.current_folder.photos.push(data.data)

        this.$refs.avatarDropzone.removeFile(response)
      }
    },
    /** add params before uploading image **/
    sendingDropzoneEvent(file, xhr, formData) {
      formData.append('folderId', this.current_folder.id);
    },
    folderMoved() {

      this.folders.map((folder, index) => {
        folder.order = index + 1
      })

      axios.post(process.env.VUE_APP_API_HOST_NAME+"/api/assistant/user/update-folders-order", {
        folders: this.folders
      })
      .then((response) => {
        console.log(response)
      }, (error) => {
        console.log(error)
      })

    },
    /** keydown event for folder **/
    folderKeyDown(event, folder_index) {
      /*if (event.keyCode == 37) // key left event
      {
        console.log("left")
      }*/
      if (event.keyCode == 38) // key up event
      {
        if(this.folders.length)
        {
          let new_index
          if(folder_index == 0)
          {
            new_index = this.folders.length - 1
          }
          else
          {
            new_index = folder_index - 1
          }

          let el = this.$refs['folder_'+new_index][0]
          if(el)
          {
            el.focus({
              behavior: "smooth"
            })
          }
        }
      }
      else if (event.keyCode == 39) // key right event
      {
        this.openFolder(this.folders[folder_index].id)
        this.$nextTick(function () {
          let el = this.$refs['photo_0'][0]
          if(el)
          {
            el.focus({
              behavior: "smooth"
            })
          }
        })

        //console.log("right")
      }
      else if (event.keyCode == 40) // key down event
      {
        if(this.folders.length)
        {
          let new_index = folder_index + 1
          if(!(this.folders && this.folders.length && this.folders[new_index]))
          {
            new_index = 0
          }

          let el = this.$refs['folder_'+new_index][0]
          if(el)
          {
            el.focus({
              behavior: "smooth"
            })
          }
        }
      }

      //else if (event.keyCode == )
      //console.log("event", event)
      //console.log("folder", folder_index)
    },

    /** keydown event for photo **/
    photoKeyDown(event, photo_index) {
      if (event.keyCode == 37) // key left event
      {
        //this.$refs['folder_'+this.current_folder]
        let i = this.folders.findIndex(item => item.id === this.current_folder.id)
        console.log("index", i)
        let el = this.$refs['folder_'+i][0]
        if(el)
        {
          el.focus({
            behavior: "smooth"
          })
        }
      }
      else if (event.keyCode == 38) // key up event
      {
        if(this.current_folder.photos.length)
        {
          let new_index
          if(photo_index == 0)
          {
            new_index = this.current_folder.photos.length - 1
          }
          else
          {
            new_index = photo_index - 1
          }

          let el = this.$refs['photo_'+new_index][0]
          if(el)
          {
            el.focus({
              behavior: "smooth"
            })
          }
        }
      }
      else if (event.keyCode == 39) // key right event
      {

        /*this.openFolder(this.folders[folder_index].id)
        let el = this.$refs['photo_0'][0]
        if(el)
        {
          el.focus({
            behavior: "smooth"
          })
        }*/
        //console.log("right")
      }
      else if (event.keyCode == 40) // key down event
      {
        if(this.current_folder.photos.length)
        {
          let new_index = photo_index + 1
          if(!(this.current_folder && this.current_folder.photos && this.current_folder.photos.length && this.current_folder.photos[new_index]))
          {
            new_index = 0
          }

          let el = this.$refs['photo_'+new_index][0]
          if(el)
          {
            el.focus({
              behavior: "smooth"
            })
          }
        }
      }

      console.log("event", event)
      console.log("photo_index", photo_index)
    }
  }
}
</script>


<template>
  <div class="container-fluid row">
    <div class="col-md-12">

      <button class="btn btn-primary float-end mt-3" @click="addFolder">Add Folder</button>
<!--      <button class="btn btn-primary float-end mt-3" @click="uploadImages" v-if="current_folder != null">Upload Images</button>-->

    </div>
    <div class="col-md-12">
        <!--      <i class="fas fa-folder-open"></i>-->
      <div class="row">
        <div class="col-md-3">
          <div>
            <draggable
                v-model="folders"
                group="people"
                @start="drag=true"
                @end="drag=false"
                style=""
            >
              <div class="user-folder me-3 mb-3" style="cursor: pointer;" v-for="folder in folders" :key="folder.id" @dblclick="openFolder(folder.id)">
                <i class="fas fa-folder folder-icon me-2"></i>
                <div>{{ folder.name }}</div>
              </div>
            </draggable>
          </div>
        </div>
        <div class="col-md-4">
          <div class="photos-list" style="position: relative;" v-if="current_folder != null">
            <file-pond
                name="avatar"
                ref="avatarpond"
                allow-image-crop="true"
                label-idle="Drop picture here... or choose from library"
                v-bind:allow-multiple="false"
                accepted-file-types="image/jpeg, image/png"
                :server="getUploadURL"
                max-files="1"
                v-bind:files="myFiles"
                v-on:init="handleFilePondInit"
                v-on:processfile="handleFilePondProcessfile"
                class="mt-2"
            />
            <div class="list-group address-book-contact-list" id="address-book-contact-list" style="max-height: 75vh; overflow-y: scroll;">
              <a href="#" class="list-group-item list-group-item-action address-book-list-item" v-bind:class="(current_photo.id == photo.id)?'active':''"  v-for="photo in current_folder.photos" :key="photo.id" @click="showPhoto(photo)">
                {{ photo.name }}
              </a>
            </div>
          </div>
        </div>
        <div class="col-md-5">
          <img :src="current_photo.path" alt="" style="max-height: 100%; max-width: 100%;" class="mb-3">
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
  width: 200px;
  cursor: pointer;
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
</style>

<script>
// Import Vue FilePond
import vueFilePond from "vue-filepond";

// Import FilePond styles
import "filepond/dist/filepond.min.css";

// Import image preview plugin styles
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";
// Import the plugin code
import FilePondPluginImageCrop from 'filepond-plugin-image-crop';

// Import image preview and file type validation plugins
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";

// Create component
const FilePond = vueFilePond(
    FilePondPluginFileValidateType,
    FilePondPluginImagePreview,
    FilePondPluginImageCrop
)

import swal from 'sweetalert'
import draggable from 'vuedraggable'

export default {
  name: 'Photos',
  components: {
    draggable,
    FilePond
  },
  data() {
    return {
      id: 1,
      photo_id: null,
      folders: [],
      current_folder: null,
      myFiles: [],
      current_photo: {}
    }
  },
  computed: {
    getUploadURL() {
      return process.env.VUE_APP_API_HOST_NAME + "/api/upload-image"
    }
  },
  methods: {
    addFolder() {
      let self = this
      swal({
        text: "Enter folder name",
        content: 'input',
        button: {
          text: "Create",
          closeModal: false,
        }
      })
      .then((value) => {
        if(value && value != "") {
          //check if folder name already exists
          let existing = self.folders.find(obj => obj.name == value)

          if(!existing)
          {
            self.folders.push({
              "id": ++self.id,
              "name": value,
              "photos": []
            })
          }


        }
        swal.stopLoading();
        swal.close();
      })
    },
    openFolder(id) {
      this.current_folder = this.folders.find(obj => obj.id == id)
    },
    handleFilePondInit: function () {
      //console.log("FilePond has initialized");

      // FilePond instance methods are available on `this.$refs.pond`
    },
    handleFilePondProcessfile: function (err, file) {
      console.log("FilePond has handleFilePondProcessfile", file);
      let imageData = JSON.parse(file.serverId)

      this.current_folder.photos.push({
        id: ++this.photo_id,
        name: file.file.name,
        path: imageData.data
      })

      this.$refs.avatarpond.removeFile()

      //console.log("imageURL", imageData)
    },
    showPhoto(photo) {
      this.current_photo = photo
    },
    redirectToAllFolders() {
      this.current_folder = null
      this.current_photo = null
    }
  }
}
</script>


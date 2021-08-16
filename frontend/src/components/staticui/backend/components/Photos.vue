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
            >
              <div class="user-folder me-3 mb-3" v-bind:class="(current_folder && current_folder.id == folder.id)?'folder-selected':''" v-for="folder in folders" :key="folder.id" @dblclick="openFolder(folder.id)" >
                <i class="fas fa-folder folder-icon me-2"></i>
                <div>{{ folder.name }}</div>
              </div>
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
                class="mb-2"

            ></vue-dropzone>

            <div class="list-group address-book-contact-list mb-5" id="address-book-contact-list" style="max-height: 75vh; overflow-y: scroll;">
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
</style>

<script>
import swal from 'sweetalert'
import draggable from 'vuedraggable'

//Dropzone
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'

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
      dropzoneOptions: {
        paramName: 'avatar',
        url: process.env.VUE_APP_API_HOST_NAME + "/api/upload-image",
        thumbnailWidth: 150,
        maxFilesize: 50, //in MB
        headers: { "My-Awesome-Header": "header value" }
      }
    }
  },
  computed: {
    getUploadURL() {
      return process.env.VUE_APP_API_HOST_NAME + "/api/upload-image"
    }
  },
  mounted() {
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
      this.current_photo = {}
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
    },
    handleVueDropzoneComplete(response) {
      if(response.status == "success")
      {
        let data = response.xhr.response
        let filename = response.upload.filename
        data = JSON.parse(data)

        this.current_folder.photos.push({
          id: ++this.photo_id,
          name: filename,
          path: data.data
        })

        this.$refs.avatarDropzone.removeFile(response)
        console.log("data", data)
      }
      console.log("response", response)
    }
  }
}
</script>


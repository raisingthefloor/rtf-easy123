<template>
  <div class="container-fluid row">
    <div class="col-md-12">
      <button class="btn btn-primary float-end mt-3" @click="addFolder" v-if="current_folder == null">Add Folder</button>
      <button class="btn btn-primary float-end mt-3" @click="uploadImages" v-if="current_folder != null">Upload Images</button>

    </div>
    <div class="col-md-12">
        <!--      <i class="fas fa-folder-open"></i>-->

      <div v-if="current_folder == null">
        <draggable
            v-model="folders"
            group="people"
            @start="drag=true"
            @end="drag=false"
            style="display:flex; flex-wrap: wrap;"
        >
          <div class="user-folder me-3 mt-3" v-for="folder in folders" :key="folder.id" @dblclick="openFolder(folder.id)">
            <i class="fas fa-folder folder-icon me-2"></i>
            <div>{{ folder.name }}</div>
          </div>
        </draggable>
      </div>
      <div v-if="current_folder != null">
        <div class="row">
          <div class="col-md-12">

          </div>
          <div class="col-md-3">

          </div>
          <div class="col-md-9"></div>
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
}
</style>

<script>
import swal from 'sweetalert'
import draggable from 'vuedraggable'

export default {
  name: 'Photos',
  components: {
    draggable
  },
  data() {
    return {
      id: 1,
      folders: [],
      current_folder: null,
      show_upload_image_form: false
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
              "name": value
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
    uploadImages() {
      this.show_upload_image_form = true
    }
  }
}
</script>


<template>
  <div class="container-fluid row">
    <div class="col-md-12">
      <button class="btn btn-primary float-end mt-3" @click="addFolder">Add Folder</button>

    </div>
    <div class="col-md-12">
<!--      <i class="fas fa-folder-open"></i>-->
      <div style="display:flex; flex-wrap: wrap;">
        <div class="user-folder me-3 mt-3" v-for="folder in folders" :key="folder.id">
          <i class="fas fa-folder folder-icon me-2"></i>
          <div>{{ folder.name }}</div>
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

export default {
  name: 'Photos',
  data() {
    return {
      id: 1,
      folders: []
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
          self.folders.push({
            "id": ++self.id,
            "name": value
          })

        }
        swal.stopLoading();
        swal.close();
      })
    }
  }
}
</script>


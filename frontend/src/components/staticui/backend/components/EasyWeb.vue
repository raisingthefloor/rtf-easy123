<template>
  <div class="container-fluid mt-2">
    <div v-if="show_files_and_folders">
      <div class="add-button" @click="addSiteOrFolder()">
        <div style="padding-top: 20px;">
          <i class="fas fa-plus text-center"></i>
        </div>
        <div>
          Add new site or folder
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
      Add Website Form
    </div>

    <div v-if="add_folder_form">
      Add Folder Form
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
</style>

<script>
export default {
  name: 'AddressBook',
  data() {
    return {
      folders: [],
      show_files_and_folders: true,
      add_site_or_folder_form: false,
      add_folder_form: false,
      add_website_form: false
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
      this.show_files_and_folders = true
      this.add_site_or_folder_form = false
      this.add_folder_form = true
    }
  }
}
</script>
<template>
  <div id="admin-app">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Easy123</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="#">Users</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Config</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="javascript:void(0)" @click="logoutUser">Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <router-view></router-view>
  </div>

</template>

<style scoped src="../assets/bootstrap-5/css/bootstrap.min.css">
</style>

<script>
import 'bootstrap/dist/js/bootstrap.bundle'
export default {
  methods: {
    logoutUser() {
      this.$store.commit('LOGOUT_USER', this.$router)
    }
  }
}
</script>
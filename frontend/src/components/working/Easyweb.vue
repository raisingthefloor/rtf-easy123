<template>
  <div class="easyweb-main" style="background-color: #818182">
    <div id="easyweb-content" class="easyweb-content-pre">
      <div class="easyweb-grid">

        <div class="file-prev" @click="openMyFav()" ref="my_ref">
          <div class="text-center">
            <h6 class="text-center" style="margin-top: 1rem; margin-bottom: 0.7rem;"><b>{{ $t('my_favorites') }}</b></h6>
            <font-awesome-icon :icon="['fas', 'star']" class="my-fav-star" />
          </div>

        </div>

        <div class="file-prev" v-for="(item, index) in $store.state.home.easyweb" :key="'easyweb_'+index" v-bind:class="{ 'folder': item.type == 'folder' }" @click="openEasyweb(item)" :ref="'file_'+item.id">
          <div class="text-center">

            <h6 class="text-center" style="margin-top: 1rem; margin-bottom: 0.7rem;"><b>{{ item.name }}</b></h6>
            <easy-web-image :image="item" v-if="item.type != 'folder'"></easy-web-image>

            <div v-if="item.websites" style="display:flex; flex-wrap: wrap;">
              <div class="thumb_in_folder" v-if="item.websites.length >= 1">
                <easy-web-image :image="item.websites[0]" :folderthumb="true" v-if="item.websites" style="max-width: 60px;"></easy-web-image>
              </div>
              <div class="thumb_in_folder" v-if="item.websites.length >= 2">
                <easy-web-image :image="item.websites[1]" :folderthumb="true" v-if="item.websites" style="max-width: 60px;"></easy-web-image>
              </div>
              <div class="thumb_in_folder" v-if="item.websites.length >= 3">
                <easy-web-image :image="item.websites[2]" :folderthumb="true" v-if="item.websites" style="max-width: 60px;"></easy-web-image>
              </div>
              <div class="thumb_in_folder" v-if="item.websites.length >= 4">
                <easy-web-image :image="item.websites[3]" :folderthumb="true" v-if="item.websites" style="max-width: 60px;"></easy-web-image>
              </div>
            </div>

          </div>
        </div>



      </div>



    </div>

    <div class="open-folder-pre" style="display: none"></div>


    <div v-if="openWebsite" class="open-website" >
      <div style="position: relative; text-align: center; padding: 10px;">
        <div style="float: left; display: inline-block;" v-if="!openFolder" v-show="openWebsite.fav" @click="alterMyFav('fav', openWebsite)">
          <button style="background-color: #ffffff; border: 1px solid black; color: #6c757d; text-align: center; text-decoration: none; padding: 0.2rem 0.6rem; border-radius: 0.25rem;">
            <font-awesome-icon :icon="['fas','star']" style="color: #ffc107;"></font-awesome-icon>
            Remove From My Favorites
          </button>
        </div>
        <div style="float: left; display: inline-block;" v-if="!openFolder" v-show="!openWebsite.fav" @click="alterMyFav('add', openWebsite)">
          <button style="background-color: #ffffff; border: 1px solid black; color: #6c757d; text-align: center; text-decoration: none; padding: 0.2rem 0.6rem; border-radius: 0.25rem;">
            <font-awesome-icon :icon="['fas','star']" style="color: #ffc107;"></font-awesome-icon>
            Add to My Favorites
          </button>
        </div>
        <div style="display:inline-block;">
          <h6 style="margin-top: 0; margin-bottom: 0; font-size: 1rem;">{{ openWebsite.name }}</h6>
        </div>
        <div style="float: right; display: inline-block;">
          <button @click="closeWebsite()" style="background-color: #ffffff; border: 1px solid black; color: #6c757d; text-align: center; text-decoration: none; padding: 0.2rem 0.6rem; border-radius: 0.25rem;">Close</button>
        </div>
      </div>
      <div style="padding-right: 4px; position: relative;">
        <iframe :src="openWebsite.link" style="height:90vh;width:100% ;" title="Iframe Example" id="itemIframe"></iframe>
      </div>

    </div>


    <div v-if="openFolder" id="openFolder" class="open-folder">
      <div style="position: relative; text-align: center; padding: 10px;" >

        <div style="display:inline-block;">
          <h6 style="margin-top: 0; margin-bottom: 0; font-size: 1rem;">{{ openFolder.name }}</h6>
        </div>
        <div style="float: right; display: inline-block;">
          <button @click="closeFolder()" style="background-color: #ffffff; border: 1px solid black; color: #6c757d; text-align: center; text-decoration: none; padding: 0.2rem 0.6rem; border-radius: 0.25rem;">Close</button>
        </div>
      </div>
      <div style="padding-right: 4px; padding-left: 4px; position: relative; display:flex;
  flex-wrap: wrap;">
        <div class="file" v-for="(item, index) in openFolder.websites" :key="'easyweb_'+index" :ref="'file_'+item._id" v-bind:class="{ 'folder': item.type == 'folder' }" @click="openEasyweb(item)">
          <div class="text-center">

            <h6 class="text-center" style="margin-top: 1rem; margin-bottom: 0.7rem;"><b>{{ item.name }}</b></h6>
            <easy-web-image :image="item" v-if="item.type != 'folder'"></easy-web-image>

            <div v-if="item.websites" style="display:flex; flex-wrap: wrap;">
              <div class="thumb_in_folder" v-if="item.websites.length >= 1">
                <easy-web-image :image="item.websites[0]" :folderthumb="true" v-if="item.websites" style="max-width: 60px;"></easy-web-image>
              </div>
              <div class="thumb_in_folder" v-if="item.websites.length >= 2">
                <easy-web-image :image="item.websites[1]" :folderthumb="true" v-if="item.websites" style="max-width: 60px;"></easy-web-image>
              </div>
              <div class="thumb_in_folder" v-if="item.websites.length >= 3">
                <easy-web-image :image="item.websites[2]" :folderthumb="true" v-if="item.websites" style="max-width: 60px;"></easy-web-image>
              </div>
              <div class="thumb_in_folder" v-if="item.websites.length >= 4">
                <easy-web-image :image="item.websites[3]" :folderthumb="true" v-if="item.websites" style="max-width: 60px;"></easy-web-image>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>

    <div v-if="openMyFavorites" class="open-folder">

      <div style="position: relative; text-align: center; padding: 10px;">

        <div style="display:inline-block;">
          <h6 style="margin-top: 0; margin-bottom: 0; font-size: 1rem;"><font-awesome-icon :icon="['fas', 'star']" style="color: #ffc107;" /> {{ $t('my_favorites') }}</h6>
        </div>
        <div style="float: right; display: inline-block;">
          <button @click="closeMyFavFolder()" style="background-color: #ffffff; border: 1px solid black; color: #6c757d; text-align: center; text-decoration: none; padding: 0.2rem 0.6rem; border-radius: 0.25rem;">Close</button>
        </div>
      </div>
      <div style="padding-right: 4px; padding-left: 4px; display:flex; flex-wrap: wrap;">
        <div class="file" v-for="(item, index) in getMyFavorites" :key="'easyweb_'+index" v-bind:class="{ 'folder': item.type == 'folder' }" :ref="'my_fav_'+item.id">
          <span class="star-badge website-fav" @click="alterMyFav('fav', item)">
            <font-awesome-icon :icon="['fas', 'star']" style="color: #ffc107;" />
          </span>
          <div class="text-center" @click="openEasyweb(item)">
            <h6 class="text-center" style="margin-top: 1rem; margin-bottom: 0.7rem;"><b>{{ item.name }}</b></h6>
            <easy-web-image :image="item" v-if="item.type != 'folder'"></easy-web-image>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style>
#easyweb-content {
}
.easyweb-content-pre {
  position: absolute;
  left: 0px;
  top: 510px;
  opacity: 0;
  font-size: 20px;
  text-shadow: -2px 2px 2px #ccc;
}
.easyweb-content {
  position: absolute;
  left: 250px;
  right: 0px;
  top: 40px;
  bottom: 0px;
  font-size: 20px;
  text-shadow: -2px 2px 2px #ccc;
  opacity: 1;
}
.file-prev {
  width: 200px;
  height: 200px;
  background: #ededed;
  opacity: 0;
}
.file {
  width: 200px;
  height: 200px;
  background: #ededed;
  position: relative;
  cursor: pointer;
  margin-right: 1rem;
  margin-bottom: 1rem;
  opacity: 1;
}
.folder {
  background: #F5E593;
}
.easyweb-grid {
  display:flex;
  flex-wrap: wrap;
}
.text-center {
  text-align: center !important;
}
.thumb_in_folder {
  width: 80px;
  padding-left: 16px;
  margin-bottom: 5px;
}
.open-website {
  position: absolute;
  top: 34px;
  left: 105px;
  background-color: aliceblue;
  width: 90vw;
  height: 100vh;
  z-index: 5;
}
.open-folder-pre {
  position: absolute;
  top: 41px;
  left: 466px;
  background-color: black;
  width: 200px;
  height: 200px;
  z-index: 10;
  opacity: 0.5;
}
.open-folder {
  position: absolute;
  top: 34px;
  left: 105px;
  background-color: aliceblue !important;
  width: 71rem !important;
  height: 40rem;
  z-index: 4;
  opacity: 1;
}
.my-fav-star {
  font-size: 7rem;
  color: #ffc107;
}
.website-fav {
  position: absolute;
  right: 2px;
  top: 2px;
  cursor: pointer;
}
.star-badge {
  display: inline-block;
  padding: 0.35em 0.65em;
  font-size: 0.75em;
  font-weight: 700;
  line-height: 1;
  color: #fff;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: 0.25rem;
}
</style>

<script type="text/javascript" src="jquery/jquery-ui.min.js"></script>
<script>
import EasyWebImage from "../assistant/user/components/EasyWebImage";
import axios from "axios";
import swal from "sweetalert";
export default {
  name: 'Easyweb',
  components: {
    EasyWebImage
  },
  data() {
    return{
      showIframe: false,
      iframeUrl: null,
      openWebsite: null,
      openFolder: null,
      openMyFavorites: false
    }
  },
  computed: {
    /** return fav **/
    getMyFavorites() {
      return this.$store.state.home.easyweb.filter(obj => obj.fav)
    }
  },
  mounted() {
    //$("#openFolder").hide()
    /*let pos = $('#easyweb').position()
    var contentsWidth = $('#easyweb-content').width();

    var css = {
      top: pos.top + 50 + 'px',
      left: pos.left + 100 - $('#easyweb-content').position().left + 'px',
      opacity: 0
    };*/

    $('#easyweb-content').removeClass('easyweb-content-prev')

    $('#easyweb-content').addClass('easyweb-content', 1000)

    var filePrev = $('.file-prev');

    if (filePrev.length)
    {
      for(var i=0; i<filePrev.length; i++) {
        $(filePrev[i]).removeClass('file-prev')
        $(filePrev[i]).addClass('file', 1000)

      }
    }

  },
  methods: {
    /** open easyweb item **/
    openEasyweb(item)
    {
      let el
      if(this.openMyFavorites)
      {
        el = this.$refs['my_fav_'+item.id][0]

      }
      else
      {
        if(this.openFolder)
        {
          el = this.$refs['file_'+item._id][0]
        }
        else {
          el = this.$refs['file_'+item.id][0]
        }
        //el = this.$refs['file_'+item.id][0]
      }

      //console.log("el", el)

      let self = this
      if(item.type == "website")
      {
        if(item.openInNewTab)
        {
          window.open(item.link, "_blank")
          return
        }
        let properties = el.getBoundingClientRect()
        let cssObj = {
          "position": "absolute",
          "backgroundColor": "#f0f8ff",
          "width": "200px",
          "height": "200px",
          "top": properties.top,
          "left": properties.left
        }

        //console.log(cssObj)
        let newCssObj = {
          "position": "absolute",
          "top": "34px",
          "left": "105px",
          "backgroundColor": "#f0f8ff",
          "width": "71rem",
          "height": "40rem",
          "z-index": "5",
          "opacity": "1",
        }
        $(".open-folder-pre").css(cssObj)
        $(".open-folder-pre").animate(newCssObj, 1000, function () {
          //$(".open-folder-pre").css(cssObj)
          $(".open-folder-pre").hide()
          self.openWebsite = item
        })
        //this.openWebsite = item
      }
      else
      {
        let properties = el.getBoundingClientRect()
        let cssObj = {
          "position": "absolute",
          "backgroundColor": "#f0f8ff",
          "width": "200px",
          "height": "200px",
          "top": properties.top,
          "left": properties.left
        }
        let newCssObj = {
          "position": "absolute",
          "top": "34px",
          "left": "105px",
          "backgroundColor": "#f0f8ff",
          "width": "71rem",
          "height": "40rem",
          "z-index": "5",
          "opacity": "1",
        }

        $(".open-folder-pre").css(cssObj)
        $(".open-folder-pre").animate(newCssObj, 1000, function () {
          $(".open-folder-pre").css(cssObj)
          $(".open-folder-pre").hide()
          self.openFolder = item
        })

      }
    },
    /** close website **/
    closeWebsite() {
      //console.log("here")
      let el
      if(this.openMyFavorites)
      {
        el = this.$refs['my_fav_'+this.openWebsite.id][0]
        //console.log("el", el)
      }
      else
      {
        if(this.openFolder)
        {
          el = this.$refs['file_'+this.openWebsite._id][0]
        }
        else {
          el = this.$refs['file_'+this.openWebsite.id][0]
        }
        //el = this.$refs['file_'+this.openWebsite.id][0]
      }
      //console.log("el", el)
      //el = this.$refs['file_'+this.openWebsite.id][0]

      let properties = el.getBoundingClientRect()
      let cssObj = {
        "position": "absolute",
        "backgroundColor": "#f0f8ff",
        "width": "200px",
        "height": "200px",
        "top": properties.top,
        "left": properties.left
      }
      let newCssObj = {
        "position": "absolute",
        "top": "34px",
        "left": "105px",
        "backgroundColor": "#f0f8ff",
        "width": "71rem",
        "height": "40rem",
        "z-index": "5",
        "opacity": "1",
      }

      $(".open-folder-pre").css(newCssObj)
      this.openWebsite = null
      $(".open-folder-pre").animate(cssObj, 1000, function () {
        $(".open-folder-pre").hide()
      })

    },
    /** close folder **/
    closeFolder: function () {
      let el = this.$refs['file_'+this.openFolder.id][0]

      let properties = el.getBoundingClientRect()
      let cssObj = {
        "position": "absolute",
        "backgroundColor": "#f0f8ff",
        "width": "200px",
        "height": "200px",
        "top": properties.top,
        "left": properties.left
      }
      let newCssObj = {
        "position": "absolute",
        "top": "34px",
        "left": "105px",
        "backgroundColor": "#f0f8ff",
        "width": "71rem",
        "height": "40rem",
        "z-index": "5",
        "opacity": "1",
      }

      $(".open-folder-pre").css(newCssObj)
      this.openFolder = null
      $(".open-folder-pre").animate(cssObj, 1000, function () {
        //$(".open-folder-pre").css(cssObj)
        $(".open-folder-pre").hide()
      })
    },
    /** open my fav folder **/
    openMyFav() {
      let self = this
      //my_ref
      let el = this.$refs.my_ref
      let properties = el.getBoundingClientRect()
      let cssObj = {
        "position": "absolute",
        "backgroundColor": "#f0f8ff",
        "width": "200px",
        "height": "200px",
        "top": properties.top,
        "left": properties.left
      }
      let newCssObj = {
        "position": "absolute",
        "top": "34px",
        "left": "105px",
        "backgroundColor": "#f0f8ff",
        "width": "71rem",
        "height": "40rem",
        "z-index": "5",
        "opacity": "1",
      }

      $(".open-folder-pre").css(cssObj)
      $(".open-folder-pre").animate(newCssObj, 1000, function () {
        $(".open-folder-pre").hide()
        self.openMyFavorites = true
      })

    },
    /** close my fav folder **/
    closeMyFavFolder() {
      this.openMyFavorites = false

      let el = this.$refs.my_ref
      let properties = el.getBoundingClientRect()
      let cssObj = {
        "position": "absolute",
        "backgroundColor": "#f0f8ff",
        "width": "200px",
        "height": "200px",
        "top": properties.top,
        "left": properties.left
      }
      let newCssObj = {
        "position": "absolute",
        "top": "34px",
        "left": "105px",
        "backgroundColor": "#f0f8ff",
        "width": "71rem",
        "height": "40rem",
        "z-index": "5",
        "opacity": "1",
      }


      $(".open-folder-pre").css(newCssObj)
      $(".open-folder-pre").animate(cssObj, 1000, function () {
        $(".open-folder-pre").hide()
      })

    },
    /** alter my fav **/
    async alterMyFav(type, item)
    {
      let self = this
      if(type == "fav")
      {
        let willDelete = await swal( {
          title: "Remove "+ item.name +" from My Favorites?",
          text: "It will still be available in your games. \n You can add it back to My Favorites again at any time.",
          icon: "warning",
          buttons: ["Cancel", "Ok"],
          dangerMode: true,
        })
        if(willDelete)
        {
          axios.post(process.env.VUE_APP_API_HOST_NAME+"/api/user/easyweb/change-fav", {
            type: type,
            item_id: item.id,
            folder_id: null
          })
              .then((response) => {
                if(response.data.status)
                {
                  self.$store.commit('CHANGE_EASYWEB_FAV', {
                    type: "fav",
                    item_id: item.id,
                    folder_id: null
                  })
                }
                else {
                  swal(self.$t('server_error_occurred_please_contact_admin'), {
                    icon: "warning",
                  })
                }
              }, (error) => {
                console.log(error)
                swal(self.$t('server_error_occurred_please_contact_admin'), {
                  icon: "warning",
                })

              })
        }
      }
      else if (type == "add")
      {
        axios.post(process.env.VUE_APP_API_HOST_NAME+"/api/user/easyweb/change-fav", {
          type: type,
          item_id: item.id,
          folder_id: null
        })
        .then((response) => {
          if(response.data.status)
          {
            self.$store.commit('CHANGE_EASYWEB_FAV', {
              type: "add",
              item_id: item.id,
              folder_id: null
            })

            swal(item.name + " has been added to My Favorites.", {
              icon: "success",
            })
          }
          else {
            swal(self.$t('server_error_occurred_please_contact_admin'), {
              icon: "warning",
            })
          }
        }, (error) => {
          console.log(error)
          swal(self.$t('server_error_occurred_please_contact_admin'), {
            icon: "warning",
          })

        })
      }


      //console.log("alter my fav", type, item)
    }

  }
}
</script>

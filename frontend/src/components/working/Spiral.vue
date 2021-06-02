<template>
  <img class="spiral spiral-img" src="mail/spiral1.png"/>
</template>

<script type="text/javascript" src="jquery/jquery-1.3.2.js"></script>
<script type="text/javascript" src="jquery/jquery-ui.min.js"></script>
<script type="text/javascript" src="mail/jquery-css-transform.js"></script>
<script type="text/javascript" src="mail/rotate3Di.js"></script>

<script>
export default {
  name: 'Spiral',
  props: ['top'],
  data() {
    return {
    }
  },
  mounted() {
    //console.log("top", this.top)
    this.$el.style.top = this.top+"px"
  },
  methods: {

  }
}
</script>

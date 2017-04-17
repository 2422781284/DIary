<template>
  <div class="container">
  <div class="container_inner">
    <div class="item" v-for="note in note_wall" :data-name="note.name" @click="show_note(note.noteId)">
      <img :src="note.headImg">
      <strong>{{note.title}}</strong>
      <p>{{note.summary}}</p>
    </div>
  </div>
    </div>
</template>
<style lang="less" scoped>
  .container {
    min-height: 98vh;
  }
  .container_inner {
    height: 100%;
    position: relative;
  }
  .item {
    visibility: hidden;
    &:hover::after {
      border-radius: 3px;
      width: 100%;
      padding: 3px;
      height: 100%;
      opacity: 0.8;
      text-align: left;
      font-size: 2em;
      // font-family: 华文行楷;
      font-weight: bold;
      content: attr(data-name);    //取到data-title属性的值
      display: inline-block;
      background: rgba(255, 255, 255, 0.64);
      position: absolute;
      top: 0px;
      left: 0px;
    }
    position: absolute;
    background: #fff;
    border: 10px solid #fff;
    border-radius: 5px;
    color: black;
    strong {
      color: #A92733;
      margin: 5px;
    }
    p{
      margin: 5px;
    }
  }

  .item img {
    margin: 5px;
    width: 50%;
    // max-width: 200px;
    border-radius: 3px;
    float: left;
    // display: block;
  }

  .load, .title {
    text-align: center;
    color: #fff;
    font-family: Arial, sans-serif;
  }
</style>
<script>
export default {
  data () {
    return {
      note_wall: '',
      offset: 0,
      request: true
    }
  },
  components: {
  },
  methods: {
    addNote() {
      let self = this
      let offset = self.offset
      self.$http.get(`/api/web/getNotes.php?offset=${offset}`).then(response => {
        let data = response.data
        if(!data) {
          self.request = false
        }
        // $('.item').css('visibility', 'hidden')
        for(let i = 0; i < data.length; i++) {
          self.note_wall.push(data[i])
        }
        self.$nextTick(function(){
          $(document).ready(function() {
            imagesLoaded( $('.container'), function() {
              new $('.container').fluid({col: 4, spacingX: 20, spacingY: 20})
              $('.item').css('visibility', 'visible')
            })
            self.offset += 3
            self.request = true
          })
        })
      }, response => {
        console.log(response)
      })
    },
    show_note(noteId ) {
      this.$router.push({name: 'note_panel', params: {id: noteId}})
    }
  },
  watch: {
  },
  created () {
    let offset = this.offset
    this.$http.get(`/api/web/getNotes.php?offset=${offset}`).then(response => {
      this.note_wall = response.data
      this.$nextTick(function() {
        let self = this
        $(document).ready(function() {
        imagesLoaded( $('.container'), function() {
          new $('.container').fluid({col: 4, spacingX: 20, spacingY: 20})
          $('.item').css('visibility', 'visible')
        })
          self.offset += 10
        }
        )
      })
    }, response => {
      console.log(response)
    })
    let self = this
    window.onscroll = function() {
      if(!self.request) return
      self.request = false
      window.setTimeout(self.addNote, 300)
    }
  }
  }
</script>


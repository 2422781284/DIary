<template>
      <div class="contain">
        <section id="gallery-wrapper">
          <article class="white-panel" v-for="note in note_wall"  :data-name="note.name"  @click="show_note(note.noteId)">
            <img :src="note.headImg">
            <strong>{{note.title}}</strong>
            <p>{{note.summary}}</p>
          </article>
        </section>
      </div>
</template>
<style lang="less" scoped>
  .contain {
    min-height: 98vh;
  }
  #gallery-wrapper {
    position: relative;
    // max-width: 100%;
    width: 60%;
    height: 100%;
    margin: 0 auto;
  }
  .white-panel {
    visibility: hidden;
    &:hover::after {
      border-radius: 3px;
      padding: 5px;
      width: 100%;
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
      top: 0;
      left: 0;
    }
    color: rgba(0, 0, 0, 0.92);
    position: absolute;
    background: white;
    border-radius: 5px;
    box-shadow: 0px 1px 2px rgba(0,0,0,0.3);
    padding: 10px;
    strong {
      color: #A92733;
      margin: 5px;
    }
    p{
      margin: 5px;
    }
    img{
      border-radius: 3px;
      width: 50%;
      max-width: 200px;
      float: left;
      margin: 5px;
    }
  }
  .white-panel p {
    color: black;
  }
  .white-panel:hover {
    box-shadow: 1px 1px 10px rgba(0,0,0,0.5);
    margin-top: -5px;
    -webkit-transition: all 0.3s ease-in-out;
    -moz-transition: all 0.3s ease-in-out;
    -o-transition: all 0.3s ease-in-out;
    transition: all 0.3s ease-in-out;
  }
</style>
<script>
export default {
  data () {
    return {
      msg: 'hello vue',
      note_wall: '',
      offset: 0,
      request: true
    }
  },
  components: {
  },
  methods: {
    show_note(noteId ) {
      this.$router.push({name: 'note_panel', params: {id: noteId}})
    },
    addNote() {
        let self = this
        let offset = self.offset
        self.$http.get(`/api/web/getNotes.php?offset=${offset}`).then(response => {
          let data = response.data
          if(!data) {
            self.request = false
          }
          for(let i = 0; i < data.length; i++) {
            self.note_wall.push(data[i])
          }
          self.$nextTick(function(){
              $("#gallery-wrapper").pinterest_grid({
                no_columns: 2,
                padding_x: 20,
                padding_y: 20,
                margin_bottom: 100,
                single_column_breakpoint: 700
              })
              $('.white-panel').css('visibility', 'visible')
              self.offset += 3
              self.request = true
          })
        }, response => {
          console.log(response)
        })
    }
  },
  watch: {
  },
  created () {
      let self = this
      let offset = self.offset
      this.$http.get(/*`/api/web/getAllNote.php`*/`/api/web/getNotes.php?offset=${offset}`).then(response => {
      this.note_wall = response.data
      this.$nextTick(function() {
        $(document).ready(function() {
          $("#gallery-wrapper").pinterest_grid({
            no_columns: 4,
            padding_x: 20,
            padding_y: 20,
            margin_bottom: 100,
            single_column_breakpoint: 700
          })
          $('.white-panel').css('visibility', 'visible')
          self.offset += 10
        }
        )
      })
    }, response => {
      console.log(response)
    })

    let goal = 'session_id'
    this.$http.get(`/api/web/HandleGet.php?goal=${goal}`).then(response => {
      console.log(response.data)
    }, response => {
      console.log(response)
    })
    window.onscroll = function() {
      let height = $(document).scrollTop()
      // if((height + 600) > self.note.min_height) {
        if(!self.request) return
        self.request = false
        window.setTimeout(self.addNote, 200)
    }
  }
}
</script>

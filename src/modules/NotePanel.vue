<template>
    <div>
      <div class="container">
        <div class="row">
          <div class="left col-sm-2">
            <img :src="note.headImg" @click="personal_note(note.name, note.userId)" class="thumbnail"/>
            {{note.name}}
          </div>
          <div class="right col-sm-10">
            <div class="header">{{note.title}}</div>
            <div class="date">{{note.timestamp | format_time}}<br><br></div>
            <div class="text" id="text"></div>
            <div class="heat">
              <!--<i @click="change_favour($event)" class="fa" :class="{'fa-thumbs-o-up': !favour, 'fa-thumbs-up': favour}" aria-hidden="true">-->
                <!--<span>&nbsp;&nbsp;{{note.favour}}</span>-->
              <!--</i>-->
              <i class="fa fa-commenting-o" aria-hidden="true">
                <span>&nbsp;&nbsp;{{comment_list.length}}</span>
              </i>
              <i @click="heart_change" class="fa" :class="{'fa-heart-o': !heart, 'fa-heart': heart}" aria-hidden="true">
                <span>&nbsp;&nbsp;{{heart_count}}</span>
              </i>
            </div>
            <div class="comment">
              <div class="edit_comment">
                <div class="input-group input-group-lg">
                  <div class="input-group-btn dropup">
                    <button @click="show_face" class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <i class="fa fa-smile-o" aria-hidden="true"></i>
                    </button>
                    <ul id="face" class="dropdown-menu" aria-labelledby="dropdownMenu2">
                      <li><button>⊙﹏⊙b</button><button>~(@^_^@)~</button><button>（ˉ﹃ˉ）</button></li>
                      <li><button>(ㄒoㄒ)</button><button>(╰_╯)#</button><button>(@﹏@)~</button></li>
                      <li><button>(╯﹏╰)b</button><button>(⊙_⊙?)</button><button>(ˇ__ˇ)</button></li>
                      <li><button>(#‵′)凸</button><button>o(>﹏<)o</button><button>O(∩_∩)O</button></li>
                      <li><button>(*^◎^*)</button><button>o(≧v≦)o</button><button>╭(╯^╰)╮</button></li>
                      <li><button>（＞﹏＜）</button><button>╮(╯_╰)╭</button><button>（￣Ｑ￣）╯</button></li>
                      <li><button>(づ￣ 3￣)づ</button><button>[]~(￣▽￣)~*</button><button>╰（‵□′）╯</button></li>
                      <li><button>＼（￣︶￣）／</button><button>〈（＿　＿）〉</button><button>( ⊙ o ⊙ )！</button></li>
                      <li><button>Σ( ° △ °|||)|</button><button>（￣ c￣）y▂ξ</button><button>(￣o￣) . z Z</button></li>
                    </ul>
                  </div>
                  <input id="publish_text" type="text" v-model="comment" class="form-control" :placeholder="remindHolder" aria-describedby="sizing-addon1">
                  <span class="input-group-btn">
                    <button :disabled="comment === ''" @click="publish" class="btn btn-default" type="button">发表</button>
                  </span>
                </div>
              </div>
              <br>
              <div class="list-group">
                <a class="list-group-item" v-for="comment in comment_list">
                  <img :src="comment.headImg"/>
                  <a>{{comment.name}}</a>
                  <span v-if="comment.remindId !== '0' ">回复<a>@ {{comment.remindName}}</a></span>
                  <p> {{comment.content}}<p>
                  <button class="btn btn-default" @click="reply(comment.userId, comment.name)">回复</button>
                </a>
              </div>
            </div>
          </div>
        </div>
     </div>
    </div>
</template>
<style lang="less" scoped>
  .left, .right {
    margin-top: 50px;
    // border: 1px solid red;
  }
  .left{
    text-align: right;
    font-size: 1.5em;
    color: #ffffff;
    font-family: 楷体;
    img {
      width: 60%;
      margin-left: 40%;
      opacity: 0.8;
      &:hover {
        opacity: 1;
        box-shadow: 0px 0px 10px #ffffff;
      }
    }
  }
  .right {
    background-color: white;
    color: black;
    border-radius: 2px;
    box-shadow: 0 0 10px #dccb8b;
    padding: 10px;
    .header {
      font-family: 华文行楷;
      font-size: 2em;
    }
    .date {
      // text-align: right;
    }
    .heat {
      text-align: right;
      padding-top: 20px;
      padding-bottom: 20px;
      i {
        opacity: 0.6;
        margin-left: 30px;
      }
    }
    .comment {
      .list-group {
        a {
          background-color: rgba(255, 250, 225, 0.39);
          position: relative;
          img {
            width: 40px;
            border-radius: 3px;
            opacity: 0.8;
            &:hover {
              opacity: 1;
              box-shadow: 0 0 5px #4b4b4b;
            }
          }
          button {
            position: absolute;
            top: 0;
            right: 0;
          }
        }
      }
    }
    .edit_comment {
      > div {
        // border: 1px solid red;
        i {
          // font-size: 1.5em;
        }
        .dropup {
          .dropdown-toggle {
            border-radius: 0;
            width: 100%;
          }
          ul {
            li{
              button {
                width: 130px;
                padding: 3px;
                margin: 3px;
                border: none;
                background: none;
                &:hover {
                  border: 1px solid rgba(16, 16, 16, 0.52);
                }
              }
            }
          }
        }
      }
    }
  }
</style>
<script>
import moment from 'moment'

    export default {
        data(){
            return{
                noteId: '',
                note: '',
                comment: '',
                heart: false,
                login: false,
                comment_list: [],
                heart_count: 0,
                remindHolder: '评论',
                remindId: '0',
                remindName: ''
            }
        },
        components:{
        },
        filters: {
          format_time(value) {
            return moment(value).format('YYYY-MM-DD HH:mm:ss')
          }
        },
        methods: {
          /*change_favour(event) {
            this.favour = !this.favour
            if(this.favour) {
              this.note.favour ++
            }else {
              this.note.favour --
            }
            let self = this
            this.$http.post('/api/web/NoteHandle.php', {
              goal: 'favour',
              noteId: self.noteId,
              favour: self.note.favour
            }).then(response => {
            }, response => {})
          }*/
          reply(userId, name) {
            this.remindHolder = '@' + name
            $("#publish_text").focus()
            this.remindId = userId
            this.remindName = name
          },
          personal_note(userId) {
            let noteId = this.noteId
            this.$router.replace({name: 'personal_note', params: {userId: userId}})
          },
          heart_change() {
            if(!this.login) {
              layer.alert("请先登录", {
                skin: 'alert'
              })
              return
            }
            this.heart = !this.heart
            let self = this
            let goal = ''
            if(self.heart) {
              goal = 'insert'
              self.heart_count ++
            }else {
              goal = 'delete'
              self.heart_count --
            }
            this.$http.post('/api/web/HeartHandle.php', {
              goal: goal,
              noteId: self.noteId
            }).then(response => {
              let data = response.data
            }, response => {})
          },
          show_face() {
            let self = this
            $('#face').find('button').unbind('click').click(function(event) {
              self.comment += event.target.innerHTML
              // document.execCommand('insertText', false, event.target.innerHTML)
              event.preventDefault()
            })
          },
          publish() {
            if(!this.login) {
              layer.alert("请先登录", {
                skin: 'alert'
              })
              return
            }
            let self = this
            this.$http.post('/api/web/CommentHandle.php', {
              goal: 'create',
              noteId: self.noteId,
              content: self.comment,
              remindId: self.remindId,
              remindName: self.remindName
            }).then(response => {
              let data = response.data
              layer.alert('评论发表成功', {
                skin: 'alert'
              })
              self.comment_list.push({
                userId: data.userId,
                headImg: data.headImg,
                name: data.name,
                content: self.comment,
                remindId: self.remindId,
                remindName: self.remindName
              })
            }, response => {})
          }
        },
        created() {
          this.noteId = this.$route.params.id
          let self = this
          this.$http.post('/api/web/NoteHandle.php', {
            goal: 'single_note',
            noteId: self.noteId
          }).then(response => {
            let data = response.data
            self.note = data
            // self.note.favour = parseInt(self.note.favour)
            $('#text').html(data.text)
          }, response => {})
          this.$http.post('/api/web/CommentHandle.php', {
            goal: 'query',
            noteId: self.noteId
          }).then(response => {
            let data = response.data
            self.comment_list = data
          }, response => {})
          this.$http.post('/api/web/HeartHandle.php', {
            goal: 'count',
            noteId: self.noteId
          }).then(response => {
            let data = response.data
            self.heart_count = data
          }, response => {})
          let username = self.$cookie.get('username')
          let token = self.$cookie.get('token')
          if(username && token) {
            self.login = true
            this.$http.post('/api/web/HeartHandle.php', {
              goal: 'check',
              noteId: self.noteId
            }).then(response => {
              let data = response.data
              if(data === 'success') {
                self.heart = true
              }
            }, response => {})
          }
        }
    }
</script>

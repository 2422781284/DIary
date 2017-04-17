<template>
    <div class="container">
      <div class="row">
      <ul class="panel list-group col-sm-10 col-sm-offset-1">
        <li class="list-group-item" v-for="(note, index) in notes">
          <div class="test">
            <span class="bot"></span>
            <span class="top"></span>
            <ul class="list-group">
            <li class="list-group-item" v-for="comment in note.comment">
              <img :src="comment.headImg"/>&nbsp;<a>{{comment.name}}</a>
              <button @click="open_comment(note.noteInfo.noteId, comment.userId, comment.name, index)" class="btn btn-default" v-if="comment.remindId != '0'">回复</button>
              <button @click="open_comment(note.noteInfo.noteId, 0, '', index)" class="btn btn-default" v-else>评论</button>
              <label v-show="comment.remindId != '0'">回复<a>&nbsp;@{{comment.remindName}}</a></label>
              <p>{{comment.content}}</p>
            </li>
          </ul>
          </div>
          <div class="media">
            <div class="media-left media-middle">
              <a>
                <img class="media-object" :src="note.noteInfo.headImg"/>
              </a>
            </div>
            <div class="media-body">
              <a  @click="note_panel(note.noteInfo.noteId)">{{note.noteInfo.title}}</a>
              <p>{{note.noteInfo.summary}}</p>
            </div>
            </div>
        </li>
        <li class="list-group-item">
          <div class="media" style="text-align:center"><a @click="load_more">加载更多</a></div>
        </li>
      </ul>
      </div>
      <div id="comment" v-show="false">
        <br>
        <div class="input-group dropdown">
          <span @click="show_face" class="input-group-addon" data-toggle="dropdown">
            <i class="fa fa-smile-o" aria-hidden="true"></i>
          </span>
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
          <input type="text" v-model="comment" class="form-control" :placeholder="remindName">
          <span @click.stop="publish" class="input-group-addon">发表</span>
        </div>
      </div>
    </div>
</template>
<style lang="less" scoped>
  .container {
    color: black;
    .panel {
      padding: 0;
      background-color: transparent;
      > li {
        background: transparent;
        // border: 1px solid red;
        border-radius: 3px;
        border: none;
        // border-left: 2px dashed #ffffff;
        // border-right: 2px dashed #ffffff;
        padding: 0;
        margin-bottom: 30px;
        .media {
          // margin: 0;
          background: white;
          padding: 5px;
          border: 1px inset rgba(52, 52, 59, 0.39);
          border-radius: 3px;
          img {
            height: 80px;
          }
          .media-body {
            p {
              position: relative;
              height: 90px;
              line-height: 30px;
              overflow: hidden;
              &::after {
                content: '...';
                position: absolute;
                right: 0;
                bottom: 0;
                width: 2em;
                background: #fff;
                text-align: right;
              }
            }
          }
        }
        .test {
          background: white;
          color: black;
          width:100%;
          // padding:30px 20px;
          border:5px solid #ffffff;
          border-radius: 5px;
          position: relative;
          span {
            width:0;
            height:0;
            font-size:0;
            overflow:hidden;
            position:absolute;
          }
          .bot {
            border-width:20px;
            border-style:solid dashed dashed;
            border-color: #ffffff transparent transparent;
            left:80px;
            bottom:-40px;
          }
          .top {
            border-width:20px;
            border-style:solid dashed dashed;
            border-color: #ffffff transparent transparent;
            left:80px;
            bottom:-33px;
          }
          ul {
            // border: 1px solid green;
            margin: 0;
            li {
             //  background-color: rgba(190, 206, 235, 0.53);
              // border: none;
              border-left: none;
              border-right: none;
              border-bottom: none;
              position: relative;
              img {
                width: 30px;
              }
              button {
                position: absolute;
                top: 0;
                right: 0;
                border-right: none;
                border-top: none;
              }
            }
          }
        }
      }
    }
    #comment {
      background-color: white;
      height: 100%;
      .input-group {
        ul {
          li {
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
</style>
<script>
    export default{
        data(){
            return{
                offset: 0,
                notes: [],
                noteId: '',
                remindId: '',
                remindName: '',
                comment: '',
                current_index: -1
            }
        },
        components:{

        },
        methods: {
          load_more() {
            let offset = this.offset
            this.$http.post('/api/web/CommentHandle.php', {
              goal: 'my_comment',
              offset: offset
            }).then(resp => {
              let data = resp.data
              for(let i = 0; i < data.length; i ++) {
                this.notes.push(data[i])
              }
              this.offset += 3
            }, resp => {})
          },
          open_comment(noteId, remindId, remindName, index) {
            this.noteId = noteId
            this.remindId = remindId
            this.remindName = remindName
            this.comment = ''
            this.current_index = index
            // let self = this
            layer.open({
              type: 1,
              title: '发表评论',
              closeBtn: 1,
              anim: 4,
              area: ['600px', '400px'],
              shadeClose: true,
              content: $("#comment"),
              cancel: function() {
                // self.comment = ''
              }
            })
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
              self.notes[self.current_index].comment.push({
                userId: data.userId,
                headImg: data.headImg,
                name: data.name,
                content: self.comment,
                remindId: self.remindId,
                remindName: self.remindName
              })
            }, response => {})
          },
          note_panel(noteId) {
            this.$router.push({name: 'note_panel', params: {id: noteId}})
          },
        },
        created() {
          let offset = this.offset
          this.$http.post('/api/web/CommentHandle.php', {
            goal: 'my_comment',
            offset: offset
          }).then(resp => {
            let data = resp.data
            this.notes = data
            this.offset += 3
          }, resp => {})
        }
    }
</script>

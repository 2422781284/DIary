<template>
    <div>
      <div class="container">
        <div class="row">
          <div class="left col-sm-3">
            <img @click="face_panel" :src="face_img" class="img-rounded">
            <h4>{{username}}</h4>
            <div class="list-group">
              <a class="list-group-item active">星期{{moment.weekday() | weekday}}</a>
              <a class="list-group-item">{{moment.get('month') + 1}}月{{moment.get('date')}}日</a>
            </div>
            <div id="face_panel" v-show="false" class="container">
              <div class="row">
              <div class="col-sm-5">
                <button @click="face_upload" class="upload_button">上传</button>
                <div><canvas id="canvas"  width="200" height="200"></canvas></div>
              </div>
              <div class="col-sm-7 src-file">
                <a href="javascript:;" class="file">选择裁剪图片
                  <input type="file" name="" id="face_file">
                </a>
                <img id="face_image" :src="face_img">
              </div>
                </div>
            </div>
          </div>
          <div class="right col-sm-9">
            <div id="image_upload" v-show="false">
              <div class="file-upload btn btn-primary">
                <span>选择图片</span>
                <input type="file" id="image_file" class="upload"/>
              </div>
              <input type="text" id="imageuploadurl" readonly placeholder="文件大小不超过5M"><br><br>
              <button @click="insert_image" class="conform">确定</button>
              <!--<div><canvas id="canvas"></canvas></div>-->
            </div>
            <div id="preview" v-show="false">
            </div>
            <div id="music_input" v-show="false">
              <textarea id="music_html" class="form-control" rows="5" v-model="music_value"></textarea>
              <div>
                <span><br>
                  使用方式:<br>
                  1.在网页版（music.163.com）进入单曲、歌单、专辑、电台节目页面后，点击 “生成外链播放器” 链接。<br>
                  2.歌单和专辑外链播放器可以选择大中小三种尺寸，单曲和电台节目可以选择中小两种尺寸。你可以选择最适合你网站设计的尺寸。<br>
                  3.还可以选择是否要自动播放，打上勾后，别人查看时播放器会自动开始播放。<br>
                  4.最后将播放器的代码黏贴过来，大功告成！</span><br><br>
              </div>
              <div class="button_right"><button @click="insert_music" type="button" class="btn btn-default">确定</button></div>
            </div>
            <nav class="navbar navbar-default">
              <div class="btn-group tool-bar" role="group" aria-label="...">
                <button type="button" @click="show_panel('font_color')" class="btn btn-default fore-color" data-title="字体颜色">
                  <span class="glyphicon glyphicon-font" aria-hidden="true"></span>
                  <input id="font_color" type="color" v-model="font_color"/>
                </button>
                <button type="button" @click="show_panel('back_color')" class="btn btn-default back_color" data-title="背景颜色">
                  <span class="glyphicon glyphicon-font" aria-hidden="true"></span>
                  <input id="back_color" type="color" v-model="back_color"/>
                </button>
                <button type="button" @click="change_simple('Bold')" class="btn btn-default" data-title="加粗"><span class="glyphicon glyphicon-bold" aria-hidden="true"></span></button>
                <button type="button" @click="change_simple('removeFormat')" class="btn btn-default" data-title="清空格式"><span class="glyphicon glyphicon-erase" aria-hidden="true"></span></button>
                <button type="button" @click="change_simple('italic')" class="btn btn-default" data-title="斜体"><span class="glyphicon glyphicon-italic" aria-hidden="true"></span></button>
                <button type="button" @click="change_simple('underline')" class="btn btn-default" data-title="下划线"><i class="fa fa-underline" aria-hidden="true"></i></button>
                <button type="button" @click="change_simple('justifyCenter')" class="btn btn-default" data-title="居中"><span class="glyphicon glyphicon-align-center" aria-hidden="true"></span></button>
                <button type="button" @click="change_simple('justifyLeft')" class="btn btn-default" data-title="左对齐"><span class="glyphicon glyphicon-align-left" aria-hidden="true"></span></button>
                <button type="button" @click="change_simple('justifyRight')" class="btn btn-default" data-title="右对齐"><span class="glyphicon glyphicon-align-right" aria-hidden="true"></span></button>
                <button type="button" @click="change_simple('justifyFull')" class="btn btn-default" data-title="文本对齐"><span class="glyphicon glyphicon-align-justify" aria-hidden="true"></span></button>
                <button type="button" @click="image_window('#image_upload')" class="btn btn-default" data-title="图片"><span class="glyphicon glyphicon-picture" aria-hidden="true"></span></button>
                <button type="button" @click="music_input" class="btn btn-default" data-title="音乐"><span class="glyphicon glyphicon-music" aria-hidden="true"></span></button>
                <button type="button" @click="preview" class="btn btn-default" data-title="预览"><span class="glyphicon glyphicon-modal-window" aria-hidden="true"></span></button>
                <div class="btn-group" role="group">
                <button type="button" class="btn btn-default dropdown-toggle" data-title="字体类型" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <span class="glyphicon glyphicon-font"></span>
                  <span class="caret"></span>
                </button>
                <ul class="dropdown-menu">
                  <li><button  @click="set_font_family('华文行楷')" style="font-family:华文行楷" type="button" class="btn btn-default">华文行楷</button></li>
                  <li><button  @click="set_font_family('微软雅黑')" style="font-family:微软雅黑" type="button" class="btn btn-default">微软雅黑</button></li>
                  <li><button  @click="set_font_family('宋体')"  style="font-family:宋体" type="button" class="btn btn-default">宋体</button></li>
                  <li><button  @click="set_font_family('楷体')"  style="font-family:楷体" type="button" class="btn btn-default">楷体</button></li>
                </ul>
              </div>
                <div class="btn-group" role="group">
                  <button type="button" class="btn btn-default dropdown-toggle" data-title="字体大小" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span class="glyphicon glyphicon-text-size"></span>
                    <span class="caret"></span>
                  </button>
                  <ul class="dropdown-menu">
                    <li><button @click="set_font_size(10)"  style="font-size:10px" type="button" class="btn btn-default">10</button></li>
                    <li><button @click="set_font_size(13)"  style="font-size:13px" type="button" class="btn btn-default">13</button></li>
                    <li><button @click="set_font_size(16)"  style="font-size:16px" type="button" class="btn btn-default">16</button></li>
                    <li><button @click="set_font_size(20)"  style="font-size:20px" type="button" class="btn btn-default">20</button></li>
                  </ul>
                </div>
                <div class="btn-group" role="group">
                  <button @click="show_face" type="button" class="btn btn-default dropdown-toggle" data-title="颜文字" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i class="fa fa-smile-o" aria-hidden="true"></i>
                    <span class="caret"></span>
                  </button>
                  <ul id="face" class="dropdown-menu">
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
                <div class="btn-group" role="group">
                  <button type="button" class="btn btn-default dropdown-toggle" data-title="可见性设置" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {{permit | permit}}
                    <span class="caret"></span>
                  </button>
                  <ul class="dropdown-menu">
                    <li><button @click="permit = 0"  style="font-size:10px" type="button" class="btn btn-default">仅自己</button></li>
                    <li><button @click="permit = 1"  style="font-size:13px" type="button" class="btn btn-default">所有人</button></li>
                  </ul>
                </div>
              </div>
              <div class="show" id="show" contenteditable="true">
              </div>
              <div class="input-group">
                <span class="input-group-addon" id="basic-addon1">日记标题</span>
                <input type="text" v-model="title" class="form-control" placeholder="title" aria-describedby="basic-addon1">
              </div>
              <div class="publish">
                <span>journal of life</span>
                <button :disabled="title === ''" @click="publish" type="button" class="btn btn-default">发布</button>
              </div>
            </nav>
            </div>
        </div>
      </div>
    </div>
</template>
<style lang="less" scoped>
  .left, .right {
    // border: 1px solid red;
  }
  .left {
    text-align: center;
    img {
      width: 200px;
      height:200px;
    }
    .list-group {
      margin: 0 auto;
      width: 80%;
    }
    #face_panel {
      width: 100%;
      overflow-x: hidden;
      .row {
        // border: 1px solid red;
        >div{
          .upload_button {
            background: #D0EEFF;
            border: 1px solid #99D3F5;
            border-radius: 4px;
            padding: 4px 12px;
            overflow: hidden;
            color: #1E88C7;
            text-decoration: none;
            text-indent: 0;
            line-height: 20px;
            margin-bottom: 5px;
          }
         //  border: 1px solid green;
        }
      }
      .src-file {
        height: 100%;
      }
      .file {
        position: relative;
        display: inline-block;
        background: #D0EEFF;
        border: 1px solid #99D3F5;
        border-radius: 4px;
        padding: 4px 12px;
        overflow: hidden;
        color: #1E88C7;
        text-decoration: none;
        text-indent: 0;
        line-height: 20px;
      }
      .file input {
        position: absolute;
        font-size: 100px;
        right: 0;
        top: 0;
        opacity: 0;
      }
      .file:hover {
        background: #AADFFD;
        border-color: #78C3F3;
        color: #004974;
        text-decoration: none;
      }
    }
  }
  .right {
    #image_upload {
      width:100%;
      padding: 20px 5px 20px 5px;
      // background:#fff;
      .file-upload {
        position: relative;
        overflow: hidden;
        border-radius: 3px !important;
        background: #ff0000;
        text-transform: uppercase;
        font-size: 13px;
        border:none !important;
        box-shadow: none !important;
        color: #fff !important;
        text-shadow:none;
        padding: 5px 10px !important;
        font-family: Arial, sans-serif;
        display: inline-block;
        vertical-align: middle;
      }
      .file-upload input.upload {
        position: absolute;
        top: 0;
        right: 0;
        margin: 0;
        padding: 0;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        filter: alpha(opacity=0);
      }
      #imageuploadurl{
        display: inline-block;
        border:none;
        vertical-align: middle;
        background: none;
        box-shadow: none;
        font-size: 11px;
        padding-left: 0;
        width:220px;
        padding-right: 0;
      }
      .conform {
        margin-right: 0;
        border-radius: 3px;
        border: 3px solid #ff0003;
        background-color: #ff0003;
      }
    }
    #preview {
      background-color: #000000;
    }
    .tool-bar {
      .fore-color {
        position: relative;
        *{
        }
        input {
          position: absolute;
          top:55%;
          left: 15%;
          outline: none;
          border: none;
          background-color: transparent;
          height: 50%;
          width: 70%;
        }
      }
      .back_color {
        position: relative;
        span{
          z-index: 2;
        }
        input{
          position: absolute;
          left: 10%;
          top: 0;
          outline: none;
          border: none;
          background-color: transparent;
          width: 80%;
          height: 100%;
          z-index: 1;
        }
      }
      .state {
        position: relative;
        &:hover::after {
          border-radius: 3px;
          padding: 3px;
          font-size: 12px;
          content: attr(data-title);    //取到data-title属性的值
          display: inline-block;
          background: white;
          position: absolute;
          top: -25px;
          left: 0;
        }
      }
      > button {
        .state
      }
      .btn-group {
        > button {
          .state
        }
      }
      .dropdown-menu {
        li {
          button{
            border: none;
            width: 100%;
          }
        }
      }
      #face {
        width: 340px;
        button{
          padding: 5px 0 5px 0;
          width: 112px;
          background-color: transparent;
          color: black;
        }
      }
    }
    .show {
      // cursor: text;
      width: 100%;
      outline: none;
      border-top: 1px solid rgba(93, 93, 93, 0.71);
      border-bottom: 1px solid rgba(93, 93, 93, 0.71);
      min-height: 700px;
      color: black;
    }
    #preview, #music_input{
      background-color: white;
      color:black;
    }
    #music_input {
      padding: 5px;
      .button_right{
        text-align: right;
      }
    }
    .publish {
      span {
        display: inline-block;
        width: 50%;
        text-align: center;
        font-family: 'Bauhaus 93';
        font-size: 1.5em;
        color: #337ab7;
      }
      button {
        float: right;
        width: 50%;
        color: #337ab7;
      }
    }
  }
</style>
<script>
import moment from 'moment'

    export default {
        data(){
            return {
                username: '',
                face_img: '',
                moment: '',
                font_color: '#000000',
                back_color: '#ffffff',
                permit: 0,
                title: '',
                music_value: ''
            }
        },
        watch: {
          font_color: function(newValue) {
            document.execCommand('ForeColor', false, newValue)
          },
          back_color: function(newValue) {
            document.execCommand('BackColor', false, newValue)
          }
        },
        components:{
        },
        filters: {
          weekday(value) {
            let res = '日'
            switch(value) {
              case 1:
                res = '一'
                break
              case 2:
                res = '二'
                break
              case 3:
                res = '三'
                break
              case 4:
                res = '四'
                break
              case 5:
                res = '五'
                break
              case 6:
                res = '六'
                break
            }
            return res
          },
          permit(value) {
            if(value === 0) {
              return '仅自己'
            }
            return '所有人'
          }
        },
        methods: {
          face_panel() {
            layer.open({
              type: 1,
              title: '上传头像',
              closeBtn: 1,
              anim: 4,
              area: '600px',
              shadeClose: true,
              content: $('#face_panel'),
              cancel: function() {
              }
            })
            let canvas = document.getElementById("canvas")
            let ctx = canvas.getContext("2d")
            let img = document.getElementById('face_image')
            let file = document.getElementById('face_file')
            let reader = new FileReader()
            $.fn.cropper.setDefaults({
              viewMode: 2,
              background: false,
              modal: false,
              scalable: false,
              rotatable: false
            })
            $('#face_image').cropper({
              aspectRatio: 1,
              crop: function(e) {
                ctx.clearRect(0, 0, 200, 200)
                ctx.drawImage(img, e.x, e.y, e.width, e.height, 0, 0, 200, 200)
                // show.src = canvas.toDataURL()
                // console.log(canvas.toDataURL())
              }
            })
            reader.onload = function() {
              img.src = this.result
              $('#face_image').cropper('replace', this.result)
              $('#face_image').cropper('crop')
            }
            file.onchange = function() {
              reader.readAsDataURL(file.files[0])
            }
          },
          music_input() {
            layer.open({
              type: 1,
              title: '插件代码',
              closeBtn: 1,
              anim: 4,
              area: '600px',
              shadeClose: true,
              content: $('#music_input'),
              cancel: function() {
              }
            })
          },
          insert_music() {
            let res = $('#show').html()
            $('#show').html(res + this.music_value)
            layer.closeAll()
          },
          face_upload() {
            let canvas = document.getElementById("canvas")
            let src = canvas.toDataURL()
            this.$http.post('/api/web/FaceChange.php', {
              src: src
            }).then(response => {
              let data = response.data
              if(data === 'success') {
                this.face_img = src
                layer.alert("头像修改成功", {
                  skin: 'alert'
                })
              }else {
                layer.alert("出错了，请联系管理员", {
                  skin: 'alert'
                })
              }
            }, response => {})
          },
          change_simple(value) {
            document.execCommand(value)
          },
          show_panel(value) {
            $('#' + value).click()
          },
          set_font_family(value) {
            document.execCommand('FontName', false, value)
          },
          set_font_size(value) {
            let size = Math.floor(value/5) + "px"
            document.execCommand('FontSize', false, size)
          },
          publish() {
            let text = $('#show').html()
            let str = $('#show').text()
            let summary = str.substring(0, str.length / 5)
            let self = this
            this.$http.post('/api/web/NoteHandle.php', {
              goal: 'create',
              title: self.title,
              text: text,
              summary: summary,
              permit: self.permit
            }).then(response => {
              let res = response.data
              let message = ''
              if(res === 'success') {
                message = '发布成功'
              }else {
                message = '发布失败，请联系管理员'
              }
              layer.alert(message, {
                  skin: 'alert'
              })
            }, response => {})
          },
          preview() {
            $('#preview').html($("#show").html())
            layer.open({
              type: 1,
              title: '预览',
              closeBtn: 1,
              anim: 4,
              area: '800px',
              offset: '10%',
              shadeClose: true,
              content: $('#preview'),
              cancel: function() {
              }
            })
          },
          image_window(id) {
            layer.open({
              type: 1,
              title: '上传图片',
              closeBtn: 1,
              anim: 4,
              shadeClose: true,
              content: $(id),
              cancel: function() {
                $('#image_file').val('')
                $('#imageuploadurl').val('')
              }
            })
            document.getElementById("image_file").onchange = function () {
              document.getElementById("imageuploadurl").value = this.value
            }
          },
          insert_image() {
            let file = document.getElementById('image_file').files[0]
            if(file) {
              if(!/image\/\w+/.test(file.type)){
                $('#image_file').val('')
                $('#imageuploadurl').val('')
                layer.alert("请确保文件为图像类型", {
                  skin: 'alert'
                })
              }else {
                /* let image = new Image()
                // let canvas = document.createElement("canvas")
                let canvas = $('#canvas')[0]
                let ctx = canvas.getContext('2d')
                image.onload = function () {
                  let w = image.naturalWidth
                  let h = image.naturalHeight
                  let toSize = 200
                  canvas.width = toSize
                  canvas.height = toSize
                  let w2 = toSize
                  let h2 = toSize
                  if(w > h) {
                    h2 = h / w * toSize
                  }else {
                    w2 = w / h * toSize
                  }
                  ctx.drawImage(image, 0, 0, w, h, 0, 0, w2, h2)
                } */
                let reader=new FileReader()
                reader.onload = function() {
                  // image.src = this.result
                  // let compress = canvas.toDataURL("image/jpeg", 0.1)
                  // console.log(compress)
                  document.execCommand('insertImage', false, this.result)
                  $('#image_file').val('')
                  $('#imageuploadurl').val('')
                  layer.closeAll()
                }
                reader.readAsDataURL(file)
              }
            }
          },
          show_face() {
            $('#face').find('button').unbind('click').click(function(event) {
              document.execCommand('insertText', false, event.target.innerHTML)
              event.preventDefault()
            })
          }
          /* placeCaretAtEnd(el) {
             el.focus()
            if (typeof window.getSelection != "undefined"
            && typeof document.createRange != "undefined") {
              let range = document.createRange()
              range.selectNodeContents(el)
              range.collapse(false)
              let sel = window.getSelection()
              sel.removeAllRanges()
              sel.addRange(range)
            } else if (typeof document.body.createTextRange != "undefined") {
              let textRange = document.body.createTextRange()
              textRange.moveToElementText(el)
              textRange.collapse(false)
              textRange.select()
            }
          } */
        },
        created() {
            this.moment = moment()
            this.username = this.$cookie.get('username')
            let goal = 'face'
            this.$http.get(`/api/web/HandleGet.php?goal=${goal}`).then(resp => {
                if(resp.data) {
                    this.face_img = resp.data
                }
            }, resp => {
                console.log(resp)
            })
            layer.config({
              extend: 'myskin/style.css',
            })
        }
    }
</script>

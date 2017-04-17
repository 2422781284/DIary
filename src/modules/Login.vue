<template>
<div>
  <canvas id="canvas" key="canvas-key"></canvas>
  <nav id="nav" v-show="top_bar" class="navbar navbar-inverse">
      <div class="container-fluid">
        <div class="navbar-header">
          <span class="navbar-brand">Fallen<span class="glyphicon glyphicon-leaf"/></span>
        </div>
        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul class="nav navbar-nav">
          <li :class="{active: choose_first}"><a @click="choosed(true)">日记墙</a></li>
          <li :class="{active: !choose_first}"><a @click="choosed(false)">话题街</a></li>
            </ul>
          <form class="navbar-form navbar-left">
            <div class="form-group">
              <input type="text" class="form-control" placeholder="Search">
            </div>
          </form>
          <ul class="nav navbar-nav">
            <li class="dropdown">
              <a class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><i class="fa fa-search" aria-hidden="true"></i></a>
              <ul class="dropdown-menu">
                <li><a href="#">Action</a></li>
                <li><a href="#">Another action</a></li>
                <li><a href="#">Something else here</a></li>
                <li role="separator" class="divider"></li>
                <li><a href="#">Separated link</a></li>
                <li role="separator" class="divider"></li>
                <li><a href="#">One more separated link</a></li>
              </ul>
            </li>
          </ul>
          <ul class="nav navbar-nav navbar-right">
            <li><a @click="open_panel(false)">登录</a></li>
            <li><a @click="open_panel(true)">注册</a></li>
          </ul>
        </div><!-- /.navbar-collapse -->
      </div><!-- /.container-fluid -->
    </nav>
  <div id="login" v-show="false">
    <h5 v-show="errors.has('username')">用户名至少三位</h5>
    <div class="input-group">
      <span class="input-group-addon"><span class="glyphicon glyphicon-user"></span></span>
      <input type="text" class="form-control" name="username" v-validate="{ rules: { regex: /^([0-9a-zA-Z\u4E00-\u9FA5\uF900-\uFA2D]){3,}$/} }" v-model="login.username" placeholder="用户名" aria-describedby="basic-addon1">
    </div>
    <h5 v-show="errors.has('password')">密码至少六位的字母或数字</h5>
    <div class="input-group">
      <span class="input-group-addon"><i class="fa fa-key" aria-hidden="true"></i></span>
      <input type="password" name="password" v-validate="{ rules: { regex: /^([A-Za-z0-9]){6,}$/} }" v-model="login.password" class="form-control" placeholder="密码" aria-describedby="basic-addon1">
    </div>
    <h5 v-show="login.register && (login.password_again !== login.password)">两次密码不一致</h5>
    <div class="input-group" v-show="login.register">
      <span class="input-group-addon"><i class="fa fa-key" aria-hidden="true"></i></span>
      <input type="password" v-model="login.password_again" class="form-control" placeholder="确认密码" aria-describedby="basic-addon1">
    </div>
    <div id="embed-captcha"></div>
    <input type="submit" :disabled="(login.register && (login.password_again !== login.password)) || !login.username || !login.password || errors.has('username') || errors.has('password')" class="btn btn-default btn-lg btn-block" id="embed-submit" value="提交">
  </div>
  <!--<router-link to="/first">Go to login</router-link>-->
  <div class="header container-fluid">
    <div class="row">
      <!--<div class="col-md-2 col-md-offset-4"><button>登录</button></div>-->
      <!--<div class="col-md-2"><button>登录</button></div>-->
      <div class="logo col-sm-1 col-md-2 col-lg-3">
        <span>Fallen<span class="glyphicon glyphicon-leaf"/></span>
      </div>
      <div class="col-sm-10 col-md-8 col-lg-6">
        <div class="login-register row">
          <div class="col-sm-6"><button class="btn btn-lg" @click="open_panel(false)">登录</button></div>
          <div class="col-sm-6"><button class="btn btn-lg" @click="open_panel(true)">注册</button></div>
        </div>
        <div class="search row">
          <div class="input-group">
            <input type="text" class="form-control">
            <div class="input-group-btn">
              <button class="btn dropdown-toggle" data-toggle="dropdown">
                <i class="fa fa-search" aria-hidden="true"></i>
                <!--<i class="fa fa-sort-desc" aria-hidden="true"></i>-->
              </button>
              <ul class="dropdown-menu dropdown-menu-right">
                <li><a>按标题</a></li>
                <li><a href="#">按作者</a></li>
                <li role="separator" class="divider"></li>
                <li><a href="#">搜索话题街</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div class="choice row">
          <div class="col-sm-6"><div @click="choosed(true)" :class="{choosed: choose_first}"><i class="fa fa-book" aria-hidden="true"></i>日记墙</div></div>
          <div class="col-sm-6"><div @click="choosed(false)" :class="{choosed: !choose_first}"><i class="fa fa-road" aria-hidden="true"></i>话题街</div></div>
        </div>
      </div>
    </div>
  </div>
  <div class="container-fluid">
    <div class="row">
      <div class="wall col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2" id="wall"  v-show="choose_first">
        <div v-for="(note, index) in note_wall" @click="show_note(note.noteId)">
          <img :src="note.headImg"/>
          <div>
              <!--<i class="fa fa-thumbs-o-up" aria-hidden="true"><span>{{note.favour}}</span></i>-->
            <div>
              <strong>{{note.title}}</strong>
            </div>
            &nbsp;&nbsp;{{note.summary}}
          </div>
        </div>
      </div>
      <div class="topic-block col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2" v-show="!choose_first">
        话题街
      </div>
    </div>
  </div>
</div>
</template>

<style lang="less" scoped>
  #nav{
    position: fixed;
    width: 100%;
    z-index: 2;
    font-size: 1em;
    form {
      input {
        width: 400px;
      }
    }
    ul {
      a {
        cursor: context-menu;
      }
      .dropdown {
        i {
          font-size: 1.5em;
        }
      }
    }
  }
  #canvas {
    position: absolute;
    left: 0;
    top: 0;
    filter: blur(3px);
    -webkit-filter: blur(3px);  /* chrome, opera */
    -ms-filter: blur(3px);
    -moz-filter: blur(3px);
    filter: progid:DXImageTransform.Microsoft.Blur(PixelRadius=30, MakeShadow=false); /* IE6~IE9 */
    // -webkit-filter:sepia(0.5); // 灰度
    // -webkit-filter:saturate(0.5); // 饱和度
    // -webkit-filter:hue-rotate(90deg); // 色相
    // -webkit-filter:invert(1); // 反相
    // -webkit-filter:drop-shadow(2px 2px 2px rgba(94, 114, 22, 1)); // 加阴影
  }
  @white: rgba(255, 255, 255, 0.71);
  .transparent {
    background-color: transparent;
  }
  #login {
    h5 {
      color: #ff0003;
    }
    // border-bottom: 1px solid @white;
    background: transparent;
    padding: 10%;
    #embed-captcha {
      margin-bottom: 20px;
      background: transparent;
      opacity: 0.6;
    }
    i {
    }
    .input-group {
      margin-bottom: 20px;
    }
    input {
      color: @white;
      .transparent;
      outline: none;
    }
    button {
      padding: 2%;
      background: transparent;
      color: @white;
    }
  }
  .header {
    > div {
      // border: 1px solid red;
      .logo {
        font-family: "Bauhaus 93";
        color: @white;
        font-size: 4em;
      }
      .login-register {
        // border: 1px solid green;
        div {
          // border: 1px solid blue;
          text-align: center;
          padding: 5%;
          button {
            outline: none;
            color: @white;
            padding-left: 10%;
            padding-right: 10%;
            font-size: 1.5em;
            border: 1px solid rgba(255, 255, 255, 0.11);
            .transparent;
            &:hover, &:active {
              border: 1px solid rgba(255, 255, 255, 0.2);
              .transparent;
            }
          }
        }
      }
      .search {
        input {
          font-family: 华文行楷;
          font-size: 3em;
        }
        button {
          // font-size: 1.5em;
          i {
            opacity: 0.71;
            display: block;
            font-size: 3em;
          }
        }
        input, button {
          color: @white;
          border: 1px solid rgba(255, 255, 255, 0.11);
          outline: none;
          .transparent;
          height: 80px;
          &:focus, &:active{
            color: @white;
            border: 1px solid rgba(255, 255, 255, 0.2);
            outline: none;
            .transparent;
          }
        }
        ul {
          .transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          .divider {
            opacity: 0.2;
          }
          li {
            a {
              color: @white;
              font-size: 1.5em;
              &:hover {
                background-color: rgba(0, 0, 0, 0.51);
              }
            }
          }
        }
      }
      .choice {
        color: @white;
        font-size: 1.5em;
        .choosed {
          border-bottom: 1px solid white;
        }
        >div {
          text-align: center;
          padding: 2%;
          >div {
            display: inline-block;
            padding-bottom: 10px;
            cursor: context-menu;
            &:hover {
              color: rgba(162, 162, 162, 0.65);
            }
          }
        }
      }
    }
  }
  .wall {
    // border: 1px solid red;
    position: relative;
    // text-align: center;
    text-align: center;
    >div {
      width:200px;
      color: @white;
      position: absolute;
      display: inline-block;
      padding: 10px;
      &:hover {
        background-color: #ffffff;
      }
      * {
        width: 100%;
        border: 5px solid white;
      }
      img {
      }
      div {
        background-color: #ffffff;
        color: black;
        i {
          opacity: 0.6;
        }
        div {
          text-align: left;
          span{
            margin-right: 0;
          }
        }
      }
    }
  }
  .topic-block {
    height: 1200px;
    border: 1px solid red;
  }
</style>

<script>
import sha1 from 'sha1'
import Vue from 'vue'

export default {
  data () {
    return {
      Leaves: {
        height: 80,
        width: 80,
        leaves: [],
        leaf_image: ['./static/images/leaf1.png', './static/images/leaf2.png', './static/images/leaf3.png', './static/images/leaf4.png'],
        max_leaves: 20,
        min_scale: 0.4,
        draw: function() {
          this.setCanvasSize()
          this.ctx.clearRect(0, 0, this.w, this.h)
          let count = 0
          for (let i = 0; i < this.leaves.length; i++) {
            if(count > 3) {
              count = 0
            }
            let leaf = this.leaves[i]
            leaf.image = new Image()
            leaf.image.style.height = leaf.height
            leaf.image.src = this.leaf_image[count++]
            this.ctx.globalAlpha = leaf.opacity
            this.ctx.drawImage (leaf.image, leaf.x, leaf.y, leaf.width, leaf.height)
          }
          this.move()
        },
        move: function() {
          for(let i = 0; i < this.leaves.length; i++) {
            let leaf = this.leaves[i]
            leaf.y += leaf.ys
            leaf.x -= leaf.xs
            if((leaf.y > this.h)|| (leaf.x < -(leaf.width))) {
              leaf.x = Math.random() * this.w
              leaf.y = -1 * this.height
            }
          }
        },
        setCanvasSize: function() {
          this.canvas.width = document.body.clientWidth
          this.canvas.height = 1000
          this.w = this.canvas.width
          this.h = this.canvas.height
        },
        initialize: function() {
          this.canvas = $('#canvas')[0]
          if(!this.canvas)
            return
          this.setCanvasSize()
          this.ctx = this.canvas.getContext('2d')
          for(let i = 0; i < this.max_leaves; i++) {
            let scale = (Math.random() * (1 - this.min_scale)) + this.min_scale
            this.leaves.push({
              x: Math.random() * this.w,
              y: Math.random() * this.h,
              ys: Math.random() + 0.7,
              xs: Math.random() + 0.7,
              height: scale * this.height,
              width: scale * this.width,
              opacity: scale
            })
          }
          setInterval($.proxy(this.draw, this), 30)
        }
      },
      login: {
        username: '',
        password: '',
        password_again: '',
        register: ''
      },
      choose_first: true,
      note_wall: [],
      note: {
        width: '',
        count: 0,
        arr: '',
        min_height: '',
        left_base: 0
      },
      top_bar: false,
      search: '',
      offset: 0,
      request: true
    }
  },
  methods: {
    open_panel(flag) {
      this.login.register = flag
      let title = "登录"
      if(flag) {
        title = "注册"
      }
      this.open_window(title, "#login", "#embed-captcha")
      this.get_verify()
    },
    setWidth() {
      let width = $("#wall").width()
      let column = Math.floor(width/200)
      this.note.width = 200
      this.note.left_base = (width - 200*column) / 2
      this.note.arr = new Array(column).fill(0)
    },
    composing() {
      let self = this
      $('#wall').imagesLoaded(function() {
        let nodes = $('#wall').children()
        for(let i = self.note.count; i < nodes.length; i++) {
          let index = self.find_min(self.note.arr)
          nodes[i].style.left = (index * self.note.width + self.note.left_base) + 'px'
          nodes[i].style.top = self.note.arr[index] + 'px'
          self.note.arr[index] += nodes[i].offsetHeight
        }
        self.note.count = nodes.length
        self.note.min_height = self.note.arr[self.find_min(self.note.arr)]
      }
      )
    },
    find_min(arr) {
      if(arr.length < 1) return -1
      let index = 0
      let min = arr[0]
      for(let i = 1;i < arr.length; i++) {
        if(arr[i] < min) {
          min = arr[i]
          index = i
        }
      }
      return index
    },
    choosed(flag) {
      console.log(flag)
      this.choose_first = flag
    },
    open_window(title, element, verify) {
      let self = this
      layer.open({
        type: 1,
        title: title,
        closeBtn: 1,
        anim: 4,
        style: 'background: rgba(216,100,125,0.2); color:#fff; border:none;',
        shade: ['0.6'],
        shadeClose: true,
        skin: 'login_window',
        content: $(element),
        shadeClose: false,
        offset: '30%',
        cancel: function() {
          $(verify).empty()
          self.login.username = ''
          self.login.password = ''
          self.login.password_again = ''
        }
      })
    },
    show_note(noteId) {
      this.$router.push({name: 'note_panel', params: {id: noteId}})
    },
    get_verify() {
      let self = this
      this.$http.get('/api/web/StartCaptchaServlet.php?type=pc&t=' + (new Date()).getTime()).then(response => {
        let data = response.data
        initGeetest({
          gt: data.gt,
          challenge: data.challenge,
          product: "embed", // 产品形式，包括：float，embed，popup。注意只对PC版验证码有效
          offline: !data.success // 表示用户后台检测极验服务器是否宕机，一般不需要关注
        }, function(captchaObj) {
          $("#embed-submit").unbind('click').click(function (e) {
            var validate = captchaObj.getValidate()
            if (!validate) {
              layer.alert('验证码错误', {
                title: '错误',
                skin: 'alert'
              })
              return
            }
            let goal = 'login'
            if(self.login.register) goal = 'register'
            self.$http.post('/api/web/VerifyLoginServlet.php', {
              type: 'pc',
              goal: goal,
              username: self.login.username,
              password: sha1(self.login.password),
              geetest_challenge: validate.geetest_challenge,
              geetest_validate: validate.geetest_validate,
              geetest_seccode: validate.geetest_seccode
            }).then(response => {
              const data = response.data
              if(data) {
                let msg = ''
                switch(data)
                {
                case '0':
                  msg = "该用户名已存在"
                  break
                case '1':
                  msg = "该用户名不存在，请先注册"
                  break
                case '2':
                  msg = "密码错误"
                  break
                case '3':
                  self.$root.eventHub.$emit('show_bar', true)
                  self.$router.push({path: '/index'})
                  return
                case '4':
                  msg = "出错了，请联系管理员"
                  break
                case '5':
                  msg = "验证码错误"
                  break
                }
                layer.alert(msg, {
                  title:'信息',
                  skin: 'alert'
                })
              } else {
                alert('出错了联系管理员')
              }
            }, response => {
              layer.alert('出错了，请联系管理员', {
                title: '错误',
                skin: 'alert'
                }
              )
            })
          })
          self.login.submit = true
          captchaObj.appendTo("#embed-captcha")
        })
      }, response => {
        console.log(response.data)
      })
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
            $(document).ready(function() {
              self.composing()
              self.offset += 3
              self.request = true
            })
          })
        }, response => {
          console.log(response)
      })
    }
  },
  components: {
  },
  created () {
    let self = this
    let offset = this.offset
    this.$http.get(`/api/web/getNotes.php?offset=${offset}`).then(response => {
      this.note_wall = response.data
      this.$nextTick(function() {
        let self = this
        $(document).ready(function() {
          self.setWidth()
          self.composing()
          self.offset += 10
        }
        )
      })
    }, response => {
      console.log(response)
    })
    $(document).ready(function() {
      self.Leaves.initialize()
      console.log('ready1')
      console.log(self.note_wall)
      // self.setWidth()
      // self.composing()
    })
    window.onscroll = function() {
      let height = $(document).scrollTop()
      console.log(height + 300)
      console.log(self.note.min_height)
      if(height > 300) {
        self.top_bar = true
      } else {
        self.top_bar = false
      }
      if((height + 600) > self.note.min_height) {
        if(!self.choose_first) return
        if(!self.request) return
        self.request = false
        window.setTimeout(self.addNote, 300)
      }
    }
    layer.config({
      //加载您的扩展样式
      extend: 'myskin/style.css',
    })
  }
}
</script>
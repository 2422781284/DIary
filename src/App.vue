<template>
  <div>
      <div class="head">
        <nav id="top_bar" v-show="show_bar" class="navbar navbar-inverse">
        <div class="container-fluid">
          <div class="navbar-header">
            <span class="navbar-brand" style="font-family: 'Bauhaus 93';">Fallen<span class="glyphicon glyphicon-leaf"/></span>
          </div>
          <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul id="click_panel" class="nav navbar-nav">
              <li><a :class="{clicked: temp_click === 1}" @click="jump_to('/note_wall', 1)">日记墙</a></li>
              <li><a :class="{clicked: temp_click === 2}">话题街</a></li>
              <li><a :class="{clicked: temp_click === 3}" @click="jump_to('/my_collect', 3)">收藏</a></li>
              <li><a :class="{clicked: temp_click === 4}" @click="jump_to('/my_note', 4)">我的日记</a></li>
              <li><a :class="{clicked: temp_click === 5}" @click="jump_to('/new_note', 5)">写日记</a></li>
              <li><a :class="{clicked: temp_click === 6}" @click="jump_to('/my_comment', 6)">我的评论</a></li>
            </ul>
            <!--<form class="navbar-form navbar-left">-->
              <!--<div class="form-group">-->
                <!--<input type="text" class="form-control" placeholder="Search">-->
              <!--</div>-->
            <!--</form>-->
            <!--<ul class="nav navbar-nav">-->
              <!--<li class="dropdown">-->
                <!--<a class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><i class="fa fa-search" aria-hidden="true"></i></a>-->
                <!--<ul class="dropdown-menu">-->
                  <!--<li><a href="#">Action</a></li>-->
                  <!--<li><a href="#">Another action</a></li>-->
                  <!--<li><a href="#">Something else here</a></li>-->
                  <!--<li role="separator" class="divider"></li>-->
                  <!--<li><a href="#">Separated link</a></li>-->
                  <!--<li role="separator" class="divider"></li>-->
                  <!--<li><a href="#">One more separated link</a></li>-->
                <!--</ul>-->
              <!--</li>-->
            <!--</ul>-->
            <ul class="nav navbar-nav navbar-right">
              <li><a>欢迎！{{username}}</a></li>
              <li><a @click="sign_out"><i class="fa fa-sign-out" aria-hidden="true"></i></a></li>
            </ul>
          </div><!-- /.navbar-collapse -->
        </div><!-- /.container-fluid -->
      </nav>
      </div>
    <router-view></router-view>
  </div>
</template>

<script>
import Hello from './components/Hello'
import Login from './modules/Login'
import Vue from 'vue'

export default {
  name: 'App',
  data () {
    return {
      show_bar: false,
      username: '',
      face_img: './static/images/face.jpg',
      temp_click: 1
    }
  },
  components: {
    Hello,
    Login
  },
  watch: {
    show_bar: function(newValue) {
      if(newValue) {
        this.username = this.$cookie.get('username')
      }
    }
  },
  methods: {
    begin () {
      this.left_node = window.document.getElementById('left-progress')
      this.right_node = window.document.getElementById('right-progress')
      this.disk = window.document.getElementById('disk')
      this.interval = window.setInterval(this.run, 1000)
    },
    jump_to(value, temp_click) {
      this.temp_click = temp_click
      this.$router.push({path: value})
    },
    sign_out() {
      this.$cookie.set('username', '')
      this.$cookie.set('token', '')
      this.show_bar = false
      this.$router.push({path: '/login'})
    },
    show(flag) {
      this.show_bar = flag
    }
  },
  created() {
    this.$root.eventHub.$on('show_bar', this.show)
    let username = this.$cookie.get('username')
    let token = this.$cookie.get('token')
    if(!username || !token) {
      this.show_bar = false
      this.$router.push({path: '/login'})
    } else {
      this.$http.get('/api/web/CookieVerify.php').then(response => {
        let data = response.data
        if(data && data === '1') {
          this.show_bar = true
          this.$router.push({path: '/index'})
        } else {
          this.show_bar = false
          this.$router.push({path: '/login'})
        }
      }, response => {
        console.log(response)
      })
    }
  }
}
</script>

<style lang="less" scoped>
  #top_bar {
    cursor: context-menu;
    color: white;
    form {
      input {
        width: 400px;
      }
    }
    .navbar-right{
      img {
        width: 30px;
        height: 30px;
      }
      i {
        color: red;
      }
    }
    #click_panel {
      .clicked {
        color: white;
      }
    }
  }
  router-view{
  }
</style>

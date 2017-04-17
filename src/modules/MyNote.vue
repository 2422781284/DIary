<template>
    <div>
      <div class="container">
      <div class="row">
      <div class="left col-sm-3">
        <img :src="face_img" class="img-rounded">
        <h4>{{username}}</h4>
        <div class="list-group">
          <a @click="display_style = 0" :class="{active: display_style === 0}" class="list-group-item">最近日记</a>
          <a @click="date_view" :class="{active: display_style === 1}" class="list-group-item">时光倒流</a>
          <a @click="note_manage" :class="{active: display_style === 2}" class="list-group-item">日记管理</a>
        </div>
      </div>
      <div class="right col-sm-9">
        <div class="recent_notes" v-show="display_style === 0">
          <div class="note" v-for="(note, index) in recent_note">
            <br>
            <div class="header">
              <div :data-month="month(note.timestamp)">
                <label>{{note.timestamp | weekDay}}</label>
                <label>{{note.timestamp | day}}</label>
              </div>
              <strong>{{note.title}}</strong>
            </div>
            <br>
            <div class="text" :id="note.noteId">
              <div v-html="note.text"></div>
              <div class="heat">
                <i @click="answer(note.noteId)" class="fa fa-commenting-o" aria-hidden="true" v-if="comments[note.noteId]"><span>{{comments[note.noteId].length}}</span></i>
                <i class="fa fa-heart-o" aria-hidden="true" v-if="comments[note.noteId]"><span>{{hearts[note.noteId]}}</span></i>
              </div>
              <div class="list-group">
                <a class="list-group-item" v-for="comment in comments[note.noteId]">
                  <img :src="comment.headImg"/>
                  <a>{{comment.name}}</a>
                  <span v-if="comment.remindId !== '0' ">回复<a>@ {{comment.remindName}}</a></span>
                  <p>{{comment.content}}<p>
                </a>
              </div>
            </div>
            <i @click="show_all(note.noteId, $event)" class="fa fa-angle-double-down" aria-hidden="true"></i>
          </div>
          <div class="load_more"><a @click="load_more">加载更多</a></div>
        </div>
        <div class="note_manage" v-show="display_style === 2">
          <div class="public">
            <span class="label label-info">所有人可见</span>
            <nav aria-label="Page navigation">
              <ul class="pagination">
                <li>
                  <a @click="change_public_page(current_public_page - 1)" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                  </a>
                </li>
                <li v-for="num in public_note.page" :class="{active: num === current_public_page}"><a @click="change_public_page(num)">{{num}}</a></li>
                <li>
                  <a @click="change_public_page(current_public_page + 1)" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                  </a>
                </li>
              </ul>
            </nav>
            <div class="list-group">
              <a class="list-group-item" v-for="(note, index) in public_note[current_public_page]">
                <a @click="answer(note.noteId)">{{note.title}}</a>
                <div class="operation">
                  <span @click="edit_note(note.noteId)" class="glyphicon glyphicon-edit" aria-hidden="true"></span>
                  <span @click="delete_note(note.noteId, index, 1)" class="glyphicon glyphicon-trash" aria-hidden="true"></span>
                </div>
                <div class="content"><p>{{note.summary}}<p></div>
              </a>
            </div>
          </div>
          <div class="private">
            <span class="label label-info">仅自己可见</span>
            <nav aria-label="Page navigation">
              <ul class="pagination">
                <li>
                  <a @click="change_private_page(current_private_page - 1)" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                  </a>
                </li>
                <li v-for="num in private_note.page" :class="{active: num === current_private_page}"><a @click="change_private_page(num)">{{num}}</a></li>
                <li>
                  <a @click="change_private_page(current_private_page + 1)" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                  </a>
                </li>
              </ul>
            </nav>
            <div class="list-group">
              <a class="list-group-item" v-for="(note, index) in private_note[current_private_page]">
                <a @click="answer(note.noteId)">{{note.title}}</a>
                <div class="operation">
                  <span @click="edit_note(note.noteId)" class="glyphicon glyphicon-edit" aria-hidden="true"></span>
                  <span @click="delete_note(note.noteId, index, 0)" class="glyphicon glyphicon-trash" aria-hidden="true"></span>
                </div>
                <div class="content"><p>{{note.summary}}<p></div>
              </a>
            </div>
          </div>
        </div>
        <div class="date-view" v-show="display_style === 1">
          <nav aria-label="Page navigation">
            <ul class="pagination">
              <li>
                <a @click="change(-1, 'years')" aria-label="Previous">
                  <span aria-hidden="true">&laquo;</span>
                </a>
              </li>
              <li>
                <a @click="change(-1, 'months')" aria-label="Previous">
                  <span aria-hidden="true">&laquo;</span>
                </a>
              </li>
              <li><a>{{date | to_month}}</a></li>
              <li>
                <a @click="change(1, 'months')" aria-label="Next">
                  <span aria-hidden="true">&raquo;</span>
                </a>
              </li>
              <li>
                <a @click="change(1, 'years')" aria-label="Next">
                  <span aria-hidden="true">&raquo;</span>
                </a>
              </li>
            </ul>
          </nav>
          <nav class="day-out" aria-label="Page navigation">
            <ul class="pagination day-scroll">
              <li @click="date_note(day)" v-for="day in days" :class="{active: day === tmp_day}">
                <a>
                 {{day}}
                </a>
              </li>
              </ul>
          </nav>
            <div class="list-group">
              <a class="list-group-item" v-for="(note, index) in current_date_notes">
                <a @click="answer(note.noteId)">{{note.title}}</a>
                <div class="operation">
                  <span @click="edit_note(note.noteId)" class="glyphicon glyphicon-edit" aria-hidden="true"></span>
                  <span @click="delete_date_note(note.noteId, index)" class="glyphicon glyphicon-trash" aria-hidden="true"></span>
                </div>
                <div class="content"><p>{{note.summary}}<p></div>
              </a>
              <div class="none" v-show="!current_date_notes[0]">
                  这天什么都没留下
              </div>
            </div>
        </div>
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
      width: 200px;
      .active {
        background-color: rgba(46, 141, 237, 0.55);
        border: none;
      }
      a {
        cursor: context-menu;
      }
    }
  }
  .right {
    .recent_notes {
      background-color: white;
      color: black;
      padding: 10px;
      .note {
        border-top: 1px dashed #2e8ded;
        margin: 30px 0 30px 0;
        .header {
          strong{
            color: #2e8ded;
            font-weight: bold;
          }
          div {
            display: inline-block;
            position: relative;
            &:hover::after {
              position: absolute;
              content: attr(data-month);
              width: 100%;
              height: 100%;
              padding-top: 20%;
              color: #fcffc8;
              font-size: 1.5em;
              border-radius: 5px;
              // opacity: 0.7;
              text-align: center;
              background: #76c2c4;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
            }
            label {
              color: brown;
              display: block;
              // border: 1px solid red;
              margin: 0;
              text-align: center;
              padding: 5px 10px 5px 10px;
              &:nth-child(1) {
                border-radius: 5px 5px 0 0;
                background-color: rgba(255, 185, 171, 0.71);
              }
              &:nth-child(2) {
                background-color: #a5fff5;
                border-radius:  0 0 5px 5px;
              }
            }
          }
        }
        .text {
          height: 300px;
          width: 100%;
          overflow-y: hidden;
          padding: 10px;
          border: 1px solid rgba(46, 141, 237, 0.36);
          box-shadow: 0px 4px 10px rgba(46, 141, 237, 0.45);
          // border: 1px solid firebrick;
          // box-shadow: 0 5px 8px rgba(104, 104, 104, 0.42);
          .heat {
            text-align: right;
            i {
              font-size: 1em;
              color: rgba(47, 47, 47, 0.61);
              display: inline-block;
              span {
                padding: 10px;
              }
            }
          }
          .list-group {
            .list-group-item {
              img {
                width: 30px;
              }
            }
          }
        }
        i {
          display: block;
          width: 10%;
          height: 30px;
          margin: 0 auto;
          font-size: 1.5em;
          font-weight: bold;
          color: rgba(46, 141, 237, 0.65);
        }
      }
      .load_more {
        padding-bottom: 20px;
        text-align: center;
        position: relative;
        a {
          position: absolute;
          left: 50%;
          display: block;
          transform: translateX(-100%);
        }
      }
    }
    .note_manage {
      .public, .private{
        // border: 1px solid #7347ff;
        background-color: white;
        color: black;
        .list-group {
          .list-group-item {
            position: relative;
            .content {
              position: relative;
              height: 50px;
              line-height: 25px;
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
            .operation {
              position: absolute;
              top: 0;
              right: 0;
              span {
                margin: 5px;
              }
            }
          }
        }
      }
    }
    .date-view {
      .list-group {
        .list-group-item {
          position: relative;
          .content {
            position: relative;
            height: 50px;
            line-height: 25px;
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
          .operation {
            position: absolute;
            top: 0;
            right: 0;
            span {
              margin: 5px;
            }
          }
        }
      }
      .day-out {
        padding: 0;
        width: 100%;
        // background-color: #337ab7;
        overflow-x: scroll;
        &::-webkit-scrollbar
        {
          width: 16px;
          height: 16px;
          background-color: #ffffff;
        }

        /*定义滚动条轨道 内阴影+圆角*/
        &::-webkit-scrollbar-track
        {
          // -webkit-box-shadow: inset 0 0 6px rgba(255, 255, 255, 0.3);
          // border-radius: 10px;
          background-color: #ffffff;
        }

        /*定义滑块 内阴影+圆角*/
        &::-webkit-scrollbar-thumb
        {
          // border-radius: 7px;
          // -webkit-box-shadow: inset 0 0 6px rgba(165, 255, 245, 0.8);
          background: linear-gradient(to right, #ffffff 45%,#337ab7 45%,#337ab7 55%, #ffffff 50%);
        }
        .day-scroll {
          margin: 0;
          text-align: center;
          margin: 0;
          width: 150%;
        }
      }
      .none {
        border-top: 1px dashed #337ab7;
        width: 100%;
        background: white;
        color: black;
        border-radius: 2px;
        height: 400px;
        font-family: 华文楷体;
        font-size: 1.5em;
        color: #337ab7;
      }
    }
  }
</style>
<script>
import moment from 'moment'

    export default{
        data(){
            return {
                username: '',
                face_img: '',
                display_style: 0,
                recent_note: [],
                recent_offset: 0,
                comments: {},
                hearts: {},
                public_note: {
                },
                private_note: {
                },
                page_count: 5,
                current_public_page: 1,
                current_private_page: 1,
                date: '',
                days: '',
                tmp_day: 0,
                date_notes: {},
                current_date_notes: []
            }
        },
        components: {
        },
        filters: {
          weekDay(value) {
            let week = ['星期日','星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
            let index = parseInt(moment(value).weekday())
            return week[index]
          },
          day(value) {
            return moment(value).date()
          },
          to_month(value) {
            return moment(value).format('YYYY年MM月')
          }
        },
        methods: {
          month(value) {
            return (moment(value).month() + 1) + '月'
          },
          note_manage(value) {
            this.display_style = 2
            if(!this.public_note.count) {
              this.$http.get(`/api/web/MyNote.php?goal=${'count'}`).then(resp => {
                let data = resp.data
                this.$set(this.public_note, 'page', Math.ceil(data[0]/this.page_count))
                this.$set(this.private_note, 'page', Math.ceil(data[1]/this.page_count))
              }, resp => {})
              let limit = this.page_count
              this.$http.get(`/api/web/MyNote.php?goal=${'public'}&offset=${0}&limit=${limit}`).then(resp=>{
                let data = resp.data
                this.$set(this.public_note, '1', data)
              }, resp=>{})
              this.$http.get(`/api/web/MyNote.php?goal=${'private'}&offset=${0}&limit=${limit}`).then(resp=>{
                let data = resp.data
                this.$set(this.private_note, '1', data)
              }, resp=>{})
            }
          },
          change_private_page(num) {
            if(num < 1) return
            if(num > this.private_note.page) return
            this.current_private_page = num
            if(!this.private_note[num]) {
              let offset = (num - 1) * 5
              let limit = this.page_count
              this.$http.get(`/api/web/MyNote.php?goal=${'private'}&offset=${offset}&limit=${limit}`).then(resp=>{
                let data = resp.data
                this.$set(this.private_note, `${num}`, data)
              }, resp=>{})
            }
          },
          change_public_page(num) {
            if(num < 1) return
            if(num > this.public_note.page) return
            this.current_public_page = num
            if(!this.public_note[num]) {
              let offset = (num - 1) * 5
              let limit = this.page_count
              this.$http.get(`/api/web/MyNote.php?goal=${'public'}&offset=${offset}&limit=${limit}`).then(resp=>{
                let data = resp.data
                this.$set(this.public_note, `${num}`, data)
              }, resp=>{})
            }
          },
          delete_note(noteId, index, type) {
            if(type === 1) {
              this.public_note[this.current_public_page].splice(index, 1)
            }else {
              this.private_note[this.current_private_page].splice(index, 1)
            }
            this.$http.post('/api/web/NoteHandle.php', {
              goal: 'delete',
              noteId: noteId
            }).then(resp => {
              let data = resp.data
              if(data === 'success') {
                layer.alert('删除成功', {
                  skin: 'alert'
                })
              }
            }, resp => {})
          },
          delete_date_note(noteId, index) {
            this.current_date_notes.splice(index, 1)
            this.$http.post('/api/web/NoteHandle.php', {
              goal: 'delete',
              noteId: noteId
            }).then(resp => {
              let data = resp.data
              if(data === 'success') {
                layer.alert('删除成功', {
                  skin: 'alert'
                })
              }
            }, resp => {})
          },
          show_all(noteId, event) {
            let flag = $(event.target).hasClass('fa-angle-double-down')
            if(flag) {
              if(!this.comments[noteId]) {
                this.$http.post('/api/web/CommentHandle.php', {
                  goal: 'query',
                  noteId: noteId
                }).then(response => {
                  let data = response.data
                  this.$set(this.comments, `${noteId}`, data)
                }, response => {})
                this.$http.post('/api/web/HeartHandle.php', {
                  goal: 'count',
                  noteId: noteId
                }).then(response => {
                  let data = response.data
                  this.$set(this.hearts, `${noteId}`, data)
                }, response => {})
              }
              $('#' + noteId).css('overflow-y', 'visible').css('height', 'auto')
              $(event.target).removeClass('fa-angle-double-down').addClass('fa-angle-double-up')
            } else {
              $('#' + noteId).css('overflow-y', 'hidden').css('height', '300px')
              $(event.target).removeClass('fa-angle-double-up').addClass('fa-angle-double-down')
            }
          },
          answer(noteId) {
            this.$router.push({name: 'note_panel', params: {id: noteId}})
          },
          edit_note(noteId) {
            this.$router.push({name: 'note_edit', params: {id: noteId}})
          },
          load_more() {
            let offset = this.recent_offset
            this.$http.get(`/api/web/MyNote.php?goal=${'recent'}&offset=${offset}`).then(resp => {
              if(resp.data) {
                let data = resp.data
                for(let i = 0; i < data.length; i++) {
                  this.recent_note.push(data[i])
                }
                this.recent_offset += 3
              }
            }, resp => {})
          },
          date_view() {
            this.display_style = 1
            this.date = moment()
            this.days = moment().endOf('month').date()
            this.tmp_day = moment().date()
            this.note_byDate(this.date)
          },
          change(n, type) {
            this.date = moment(this.date).add(n, type).date(1)
            this.days = moment(this.date).endOf('month').date()
            this.tmp_day = 1
          },
          date_note(day) {
            this.tmp_day = day
            this.date = moment(this.date).date(day)
            this.note_byDate(this.date)
          },
          note_byDate(date) {
            let key = moment(date).format('YYYY-MM-DD')
            if(!this.date_notes[key]) {
              this.$http.get(`/api/web/MyNote.php?goal=${'date_note'}&date=${key}`).then(resp => {
                let data = resp.data
                this.current_date_notes = data
                this.$set(this.date_notes, `${key}`, data)
              }, resp => {})
            } else {
               this.current_date_notes = this.date_notes[key]
            }
          }
        },
        created() {
            this.username = this.$cookie.get('username')
            let goal = 'face'
            this.$http.get(`/api/web/HandleGet.php?goal=${goal}`).then(resp => {
                if(resp.data) {
                    this.face_img = resp.data
                }
            }, resp => {
                console.log(resp)
            })
            let offset = this.recent_offset
            this.$http.get(`/api/web/MyNote.php?goal=${'recent'}&offset=${offset}`).then(resp => {
              if(resp.data) {
                this.recent_note = resp.data
                this.recent_offset += 3
              }
            }, resp => {})
        }
    }
</script>

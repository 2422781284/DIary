<template>
    <div>
{{userId}}<br>
      {{info.name}}
      <img :src="info.headImg">
    </div>
</template>
<style>
</style>
<script>
    export default{
        data(){
            return {
                userId:'',
                info: ''
            }
        },
        components: {
        },
        created() {
          this.userId = this.$route.params.userId
            let goal = 'get_info'
            let userId = this.userId
            this.$http.get(`/api/web/HandleGet.php?goal=${goal}&userId=${userId}`).then(resp => {
                if(resp.data) {
                    this.info = resp.data
                }
            }, resp => {
                console.log(resp)
            })
        }
    }
</script>

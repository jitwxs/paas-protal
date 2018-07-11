<template>

</template>

<script>
    export default {
        name: "ContainerDetails",
        data(){
            return{
                containerId:'',
            }
        },
        methods:{

        },
        created(){
            this.containerId = this.$route.query.id;
        }
    }
</script>

<style scoped>

</style>

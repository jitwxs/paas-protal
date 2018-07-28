<template>
    <div class="pushable">

        <!-- Following Menu -->
        <div class="ui large top fixed hidden menu">
            <div class="ui container conbbb" >
                <a class="active item">Home</a>
                <a class="item">Work</a>
                <a class="item">Company</a>
                <a class="item">Careers</a>
                <div class="right menu">
                    <div class="item" style="width: 500px;">
                        <router-link to="/Login" class="ui button" >Log in</router-link>
                    </div>
                    <div class="item">
                        <a class="ui primary button">Sign Up</a>
                    </div>
                </div>
            </div>
        </div>

        <!-- Sidebar Menu -->
        <div class="ui vertical inverted sidebar menu left">
            <a class="active item">Home</a>
            <a class="item">Work</a>
            <a class="item">Company</a>
            <a class="item">Careers</a>
            <a class="item">Login</a>
            <a class="item">Signup</a>
        </div>


        <!-- Page Contents -->
        <div class="pusher">
            <div class="ui inverted vertical masthead center aligned segment" style="height: 940px;">

                <div class="ui container conbbb">
                    <div class="ui large secondary inverted pointing menu">
                        <a class="toc item">
                            <i class="sidebar icon"></i>
                        </a>
                        <a class="item">Home</a>
                        <a class="item">Work</a>
                        <a class="item">Company</a>
                        <a class="item">Careers</a>
                        <div class="right item">
                            <!--< to="/" class="ui button">Log in</>-->
                            <router-link to="Login" class="ui inverted button">Log in</router-link>
                            <router-link to="Register" class="ui inverted button">Sign Up</router-link>
                        </div>
                    </div>
                </div>

                <div class="ui text container conbbb" style="height: 600px; margin-top: 100px;">
                    <h1 class="ui inverted header">
                        无道云PasS云平台
                    </h1>
                    <h2>个人级容器云 - 基于 docker 的PasS平台</h2>
                    <router-link to="Login" class="ui huge primary button">Get Started <i class="right arrow icon"></i></router-link>
                </div>

            </div>

            <div class="ui vertical stripe quote segment">

                <div class="ui equal width stackable internally celled grid">
                    <div class="center aligned row">
                        <div class="column">
                            <h3>构建灵动新 IT</h3>
                            <p>Building a new IT with a new spirit </p>
                        </div>
                        <div class="column">
                            <h3>"科技洞见未来"</h3>
                            <p>
                                <img src="../../../static/img/index/picture1.jpg" class="ui avatar image"> <b>Nan</b> Chief Fun Officer Acme Toys
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="ui vertical stripe segment" align="center">
                <div class="chanping">产品优势</div>
                <br/>
                <img src="../../../static/img/index/picture6.png" class="picture2">
            </div>

            <div class="ui vertical stripe segment" align="center">
                <div class="chanping" >核心功能</div>
                <br>
                <img src="../../../static/img/index/picture7.png" class="picture2">

                <!--<br>-->
                <!--<div class="ui middle aligned stackable grid container">-->
                <!--<div class="row">-->
                <!--<div class="eight wide column">-->
                <!--<p style="">-->
                <!--<img src="../../assets/picture1.jpg" class="ui avatar image"> <a class="zhiti1">容器调度</a>-->
                <!--<img src="../../assets/picture1.jpg" class="ui avatar image"> <a class="zhiti1">应用编排</a>-->

                <!--</p>-->
                <!--<br>-->
                <!--<p>-->
                <!--<img src="../../assets/picture1.jpg" class="ui avatar image"> <a class="zhiti1">集群管理</a>-->
                <!--<img src="../../assets/picture1.jpg" class="ui avatar image"> <a class="zhiti1">监控告警</a>-->
                <!--</p>-->
                <!--<br>-->
                <!--<p>-->
                <!--<img src="../../assets/picture1.jpg" class="ui avatar image"> <a class="zhiti1">镜像仓库</a>-->
                <!--<img src="../../assets/picture1.jpg" class="ui avatar image"> <a class="zhiti1">日志审计</a>-->
                <!--</p>-->

                <!--</div>-->
                <!--<div class="six wide right floated column">-->
                <!--<img src="../../assets/picture1.jpg" class="ui large bordered rounded image">-->
                <!--</div>-->
                <!--</div>-->
                <!--&lt;!&ndash;<div class="row">&ndash;&gt;-->
                <!--&lt;!&ndash;<div class="center aligned column">&ndash;&gt;-->
                <!--&lt;!&ndash;<a class="ui huge button">了解更多</a>&ndash;&gt;-->
                <!--&lt;!&ndash;</div>&ndash;&gt;-->
                <!--&lt;!&ndash;</div>&ndash;&gt;-->
                <!--</div>-->
            </div>

            <div class="ui vertical stripe segment" align="center">
                <div class="chanping">产品架构</div>
                <br/>
                <img src="../../../static/img/index/picture2.png" class="picture2">
            </div>
        </div>

        <!--<div class="ui vertical stripe segment">-->
        <!--<div class="chanping">适用场景</div>-->
        <!--<br>-->
        <!--<br>-->
        <!--<div class="ui middle aligned stackable grid container" >-->

        <!--<div class="six wide left floated column aaa">-->
        <!--<img src="../../assets/picture4.jpg" class="ui large bordered rounded image">-->
        <!--<h2 style="text-align: center;color: #fff">敏捷开发快速上线</h2>-->
        <!--</div>-->

        <!--<div class="six wide right floated column aaa">-->
        <!--<img src="../../assets/picture5.jpg" class="ui large bordered rounded image">-->
        <!--<h2 style="text-align: center;color: #fff">微服务架构应用</h2>-->
        <!--</div>-->

        <!--</div>-->
        <!--</div>-->

        <div class="ui vertical stripe segment">
            <div class="chanping">应用场景</div>
            <br>
            <br>
            <div class="ui middle aligned stackable grid container">
                <div class="row">
                    <div class="eight wide column">
                        <p style="font-size: 30px">持续集成与持续部署</p>
                        <p >基于docker容器服务的Pass平台为用户提供基础的开发环境，使开发者只需要关注代码开发减少相关工具的安装和配置工作量。同时丰富的容器镜像，可以让运维人员在平台上快速部署开发所需要的服务，支持通过环境变量绑定服务。实现开发环境、测试环境以及生产环境的隔离以及环境的快速搭建和回收，提高了整体效率。</p>
                    </div>
                    <div class="six wide right floated column">
                        <img src="../../../static/img/index/picture8.png" class="ui large bordered rounded image">
                    </div>
                </div>

            </div>
        </div>

        <div class="ui inverted vertical footer segment">
            <div class="ui container conbbb">
                <div class="ui stackable inverted divided equal height stackable grid">
                    <div class="three wide column">
                        <h4 class="ui inverted header">About</h4>
                        <div class="ui inverted link list">
                            <a href="#" class="item">Sitemap</a>
                            <a href="#" class="item">Contact Us</a>
                            <a href="#" class="item">Religious Ceremonies</a>
                            <a href="#" class="item">Gazebo Plans</a>
                        </div>
                    </div>
                    <div class="three wide column">
                        <h4 class="ui inverted header">Services</h4>
                        <div class="ui inverted link list">
                            <a href="#" class="item">Banana Pre-Order</a>
                            <a href="#" class="item">DNA FAQ</a>
                            <a href="#" class="item">How To Access</a>
                            <a href="#" class="item">Favorite X-Men</a>
                        </div>
                    </div>

                    <div class="three wide column">
                        <h4 class="ui inverted header">关于我们</h4>
                        <div class="ui inverted link list">
                            <a href="#" class="item">团队介绍</a>
                            <a href="#" class="item">产品动态</a>
                            <a href="#" class="item">品牌标识</a>
                            <a href="#" class="item">近期福利</a>
                            <a href="#" class="item">联系我们</a>
                            <a href="#" class="item">加入我们</a>
                        </div>
                    </div>

                    <div class="three wide column">
                        <h4 class="ui inverted header">售后</h4>
                        <div class="ui inverted link list">
                            <a href="#" class="item">Tel：025-110110110</a>
                            <br>
                            <a href="#" class="item">Email：jitwxs@foxmail.com</a>
                            <br>
                            <a href="#" class="item">地址：南京市金陵科技学院</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>




</template>

<script>
    export default {
        name: "index",
        methods:{
            login(){
                console.log(111);
                this.router.push({path:'/login'})
            }
        }
    }

</script>

<style scoped>
    .aaa{
        margin: auto 7.6%;
        /*float: right;*/
        /*padding-top: auto;*/
    }


    .container {
        padding: 10px;

        border: 0px solid #373a4b;
        border-radius: 5px;
    }
    .conbbb {
        background: #373a4b;
    }


    .ui.inverted.segment,
    .ui.primary.inverted.segment {
        background: #373a4b;
        color: rgb(16, 38, 165);

    }

    .ui.secondary.inverted.pointing.menu {
        border-width: 2px;
        border-color: rgb(55, 58, 75);
    }

    .header {
        background-color: #373a4b;
    }
    /*#F7F8F9*/
    .ui.inverted.segment[data-v-441ccd6b], .ui.primary.inverted.segment[data-v-441ccd6b] {
        background: #373a4b;
        color: #fff;
    }

    .masthead h1.ui.header[data-v-441ccd6b] {
        margin-top: 2em;
        margin-bottom: 1em;
        font-size: 4em;
        font-weight: normal;
    }

    .masthead h2[data-v-441ccd6b] {
        font-size: 1.1em;
        font-weight: normal;
    }

    .ui.header {
        color: #fff;
    }

    .zhiti {
        color: #fff;
    }
    .zhiti1 {
        color: #fff;
        margin: auto 40% auto auto;
    }

    .picture2 {
        border-image-width: auto;
    }

    .chanping {
        text-align: center;
        font-size: 50px;
    }

    .hidden.menu {
        display: none;
    }

    .masthead.segment {
        min-height: 700px;
        padding: 1em 0em;
    }
    .masthead .logo.item img {
        margin-right: 1em;
    }
    .masthead .ui.menu .ui.button {
        margin-left: 0.5em;
    }
    .masthead h1.ui.header {
        margin-top: 3em;
        margin-bottom: 0em;
        font-size: 4em;
        font-weight: normal;
    }
    .masthead h2 {
        font-size: 1.7em;
        font-weight: normal;
    }

    .ui.vertical.stripe {
        padding: 8em 0em;
    }
    .ui.vertical.stripe h3 {
        font-size: 2em;
    }
    .ui.vertical.stripe .button + h3,
    .ui.vertical.stripe p + h3 {
        margin-top: 3em;
    }
    .ui.vertical.stripe .floated.image {
        clear: both;
    }
    .ui.vertical.stripe p {
        font-size: 1.33em;
    }
    .ui.vertical.stripe .horizontal.divider {
        margin: 3em 0em;
    }

    .quote.stripe.segment {
        padding: 0em;
    }
    .quote.stripe.segment .grid .column {
        padding-top: 5em;
        padding-bottom: 5em;
    }

    .footer.segment {
        padding: 5em 0em;
    }

    .secondary.pointing.menu .toc.item {
        display: none;
    }

    @media only screen and (max-width: 700px) {
        .ui.fixed.menu {
            display: none !important;
        }
        .secondary.pointing.menu .item,
        .secondary.pointing.menu .menu {
            display: none;
        }
        .secondary.pointing.menu .toc.item {
            display: block;
        }
        .masthead.segment {
            min-height: 350px;
        }
        .masthead h1.ui.header {
            font-size: 2em;
            margin-top: 1.5em;
        }
        .masthead h2 {
            margin-top: 0.5em;
            font-size: 1.5em;
        }

    }



</style>

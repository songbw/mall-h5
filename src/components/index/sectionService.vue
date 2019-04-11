<template>
  <section :style="{'margin-bottom': datas.settings.marginBottom+'px','background-color':mBackgroundColor}">
    <div class="section0-list">
      <ul :style="{'background-color':mBackgroundColor}">
        <li v-for="k in datas.list.slice(0,5)" @click="onClick(k.targetUrl)" :style="{'background-color':mBackgroundColor}">
          <img v-lazy="k.imageUrl">
          <h2 :style="isDeepColor(mBackgroundColor)? 'color:white':'color:blank'">
            {{k.name}}
          </h2>
        </li>
      </ul>
    </div>
    <div class="section1-list" v-if="datas.list.length > 5">
      <ul :style="{'background-color':mBackgroundColor}">
        <li v-for="k in datas.list.slice(5,10)" @click="onClick(k.targetUrl)" :style="{'background-color':mBackgroundColor}">
          <img v-lazy="k.imageUrl">
          <h2 :style="isDeepColor(mBackgroundColor)? 'color:white':'color:blank'">
            {{k.name}}
          </h2>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
  export default {
    props: ['datas', 'mBackgroundColor'],
    methods: {
      See(e) {
        window.location.href = e
      },
      isDeepColor(hexColor) {
        this.$log("isDeepColor:"+hexColor)
/*        if(hexColor == undefined)
          return false;*/
        if (hexColor.substr(0, 1) == "#") hexColor = hexColor.substring(1);
        hexColor = hexColor.toLowerCase();
        let b = new Array();
        for (let x = 0; x < 3; x++) {
          b[0] = hexColor.substr(x * 2, 2)
          b[3] = "0123456789abcdef";
          b[1] = b[0].substr(0, 1)
          b[2] = b[0].substr(1, 1)
          b[20 + x] = b[3].indexOf(b[1]) * 16 + b[3].indexOf(b[2])
        }
        let grayLevel  =  b[20] * 0.299 +  b[21] * 0.587 +  b[22]* 0.114
        if(grayLevel >= 192)
          return false
        else
          return true;
      },
      gotoGoodsPage(skuid) {
        try {
          //获取goods信息，update current googds
          this.$api.xapi({
            method: 'get',
            url: '/prod',
            params: {
              id: skuid,
            }
          }).then((res) => {
            this.updateCurrentGoods(res.data.data.result);
            this.$router.push("/detail");
          }).catch((error) => {
            console.log(error)
          })
        } catch (e) {
        }
      },
      onClick(targetId) {
        if (targetId.startsWith("aggregation://")) {
          let id = targetId.substr(14);
          this.$router.push({path: '/index/' + id});
        } else if (targetId.startsWith("route://")) {
          let target = targetId.substr(8);
          let paths = target.split("/");
          this.$log(paths);
          if (paths[0] === 'category') {
            this.$router.push({path: '/category'})
          } else if (paths[0] === 'commodity') {
            try {
              if (paths[1] != null)
                this.gotoGoodsPage(paths[1]);
            } catch (e) {
            }
          }
        } else if (targetId.startsWith("http://") || targetId.startsWith("http://")) {
          this.See(targetId);
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/fz.less";
  @import "../../assets/index/style.css";

  .section0-list {
    ul {
      display: -webkit-flex;
      display: -ms-flex;
      display: flex;

      li {
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        width: 20%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: Center;

        a,
        img {
          width: 100%;
          display: block;
          height: 4.2em;
        }

        h2 {
          .fz(font-size, 26);
          color: #333;
          padding: 2vw 1.2vw;
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: center;
        }
      }
    }
  }

  .section1-list {
    ul {
      display: -webkit-flex;
      display: -ms-flex;
      display: flex;

      li {
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        width: 20%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: Center;

        a,
        img {
          width: 100%;
          display: block;
          height: 4.2em;
        }

        h2 {
          .fz(font-size, 26);
          color: #333;
          padding: 2vw 1.2vw;
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: center;
        }
      }
    }
  }
</style>

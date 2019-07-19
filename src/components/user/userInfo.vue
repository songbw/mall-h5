<template lang="html">
  <section class="userInfo">
    <v-header class="header">
      <h1 slot="title">个人信息</h1>
    </v-header>
    <div class="userMain">
      <van-cell-group>
        <van-cell isLink="true" url="">
          <div slot="title" class="avatarTitle">
            <span>头像</span>
          </div>
          <div slot="right-icon" class="header-icon">
            <img :src="avatarDefaultImg">
          </div>
        </van-cell>
        <van-cell title="用户ID">
          <div slot="label">
            <span>{{user.openId}}</span>
          </div>
        </van-cell>
        <van-cell title="昵称" :value=user.nickname isLink="true" @click="onNickNameClick()"></van-cell>
        <van-dialog
          v-model="nickNameDlgShow"
          title="修改昵称"
          @confirm="onNickNameConfirmClick"
        >
          <van-field v-model="user.nickname" rows="1" placeholder="请输入您的昵称"/>
        </van-dialog>
        <van-cell title="手机号" :value=user.telephone isLink="true" @click="onTelClick()"></van-cell>
        <van-dialog
          v-model="telDlgShow"
          title="修改手机号"
          show-cancel-button="true"
          confirm-button-color="#FF4444"
          cancel-button-color="#8c8c8c"
          :beforeClose="beforeCloseTelDialog"
        >
          <van-field v-model="user.telephone" type="tel" rows="1" placeholder="请输入您的电话号码"/>
        </van-dialog>
        <van-cell title="性别" :value=user.sex isLink="true" @click="onSexClick()"></van-cell>
        <van-dialog
          v-model="sexDlgShow"
          title="修改性别"
          @confirm="onSexConfirmClick"
        >
          <div class="sexSelector">
            <van-radio-group v-model=user.sex>
              <van-radio name="男">男</van-radio>
              <van-radio name="女">女</van-radio>
            </van-radio-group>
          </div>
        </van-dialog>
        <van-cell title="生日" :value=birthDay isLink="true" @click="onBirthClick()"></van-cell>
        <!-- <van-dialog
           v-model="birthDlgShow"
           title="标题"
         >
          <div class="birthSelector">
            <van-datetime-picker
              v-model="user.birth"
              type="date"
              :min-date="minDate"
              :max-date="maxDate"
              :format="formatter"
            />
          </div>
         </van-dialog>-->
        <div class="birthSelector">
          <van-popup v-model="birthDlgShow" position="bottom" :overlay="false">
            <van-datetime-picker
              title="修改生日"
              v-model="birthDayValue"
              type="date"
              :min-date="minDate"
              :max-date="maxDate"
              @confirm="onBirthSelectorConfirmClick"
              @cancel="onBirthSelectorCancelClick"
            />
          </van-popup>
        </div>

      </van-cell-group>
    </div>

  </section>
</template>

<script>
  import Header from '@/common/_header.vue'

  export default {
    components: {
      'v-header': Header,
    },

    data() {
      return {
        user: {},
        nickNameDlgShow: false,
        telDlgShow: false,
        birthDlgShow: false,
        sexDlgShow: false,
        minDate: new Date(1940, 1, 1),
        maxDate: new Date(2120, 1, 1),
        birthDay: '',
        birthDayValue: null,
        avatarDefaultImg: require('@/assets/icons/ico_avatar.png'),
      }
    },

    created() {
      let that = this;
      that.$log("userInfo created Enter")
      that.user = this.$route.params.user;
      that.$log(that.user);
      if (that.user.birth != null) {
        this.birthDayValue = new Date(that.user.birth);
        this.birthDay = that.user.birth;
      }
    },

    methods: {
      formatDateTime(date) {
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        let d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        return y + '-' + m + '-' + d
      },
      saveUserInfo() {
        let that = this;
        this.$api.xapi({
          method: 'put',
          baseURL: this.$api.SSO_BASE_URL,
          //url: '/user/updateProfile',
          url: '/user',
          data: this.user
        }).then((response) => {
          that.$log(response.data)
        }).catch(function (error) {
          that.$log(error)
        })
      },
      onBirthSelectorConfirmClick(value) {
        this.$log("onBirthSelectorConfirmClick Enter");
        this.birthDlgShow = false;
        let date = new Date(value);
        this.birthDay = this.formatDateTime(date);
        this.user.birth = this.birthDay;
        this.saveUserInfo();
      },
      onBirthSelectorCancelClick() {
        this.$log("onBirthSelectorCancelClick Enter");
        this.birthDlgShow = false;
      },
      onNickNameConfirmClick() {
        this.$log("onNickNameConfirmClick Enter")
        this.saveUserInfo();
      },

      beforeCloseTelDialog(action, done) {
        this.$log("beforeCloseTelDialog Enter");

        if(action === 'confirm') {
          if(!this.user.telephone.match("^((\\\\+86)|(86))?[1][3456789][0-9]{9}$"))
          {
            this.$toast("请输入正确的电话号码")
            done(false) //不关闭弹框
          } else {
            this.saveUserInfo();
            done()
          }

        } else if(action === 'cancel') {
          done() //关闭
        }
      },

      onSexConfirmClick() {
        this.$log("onSexConfirmClick Enter")
        this.saveUserInfo();
      },
      onNickNameClick() {
        this.$log("onNickNameClick Enter")
        this.nickNameDlgShow = true;
      },
      onTelClick() {
        this.$log("onTelClick Enter")
        this.telDlgShow = true;
      },
      onBirthClick() {
        this.$log("onBirthClick Enter")
        this.birthDlgShow = true;
      },
      onSexClick() {
        this.$log("onSexClick Enter")
        this.sexDlgShow = true;
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../../assets/fz.less';
  @import '../../assets/index/style.css';

  .userInfo {
    .userMain {
      .avatarTitle {
        height: 4em;
        line-height: 4em;
        align-items: center;
      }

      .header-icon {
        height: 4em;
        line-height: 4em;
        align-items: center;
        img{
          height: 35px;
          width: 35px;
        }
      }

      .sexSelector {
        .van-radio-group {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;

          .van-radio {
            margin: 10px;
          }
        }

      }

      .birthSelector {
        width: 100%;
      }
    }
  }


</style>

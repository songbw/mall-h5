<template lang="html">
  <section class="userInfo">
    <v-header class="header" v-if="showHeader">
      <h1 slot="title">个人信息</h1>
    </v-header>
    <div class="userMain">
      <van-cell-group>
        <van-cell isLink="true" url="">
          <div slot="title" class="avatarTitle">
            <span>头像</span>
          </div>
          <div slot="right-icon" class="header-icon">
            <img :src="(user.headImg !=null && user.headImg.length > 0) ? user.headImg : avatarDefaultImg">
          </div>
        </van-cell>
<!--        <van-cell title="用户ID" v-if="user.openId != null">
          <div slot="label">
            <span>{{user.openId}}</span>
          </div>
        </van-cell>-->
        <van-cell title="手机号" :value=user.telephone></van-cell>
        <van-cell title="昵称" :value=user.nickname isLink="true" @click="onNickNameClick()"></van-cell>
        <van-dialog
          v-model="nickNameDlgShow"
          title="修改昵称"
          show-cancel-button="true"
          :beforeClose="beforeCloseNickNameDialog"
        >
          <van-field
            v-model="inputNickName"
            rows="1"
            maxlength="10"
            placeholder="请输入您的昵称"
            clearable
          />
        </van-dialog>

        <!--<van-dialog
          v-model="telDlgShow"
          maxlength="30"
          title="修改手机号"
          show-cancel-button="true"
          :beforeClose="beforeCloseTelDialog"
        >
          <van-field
            v-model="inputTel"
            type="tel"
            rows="1"
            placeholder="请输入您的电话号码"
            clearable>
          </van-field>
        </van-dialog>-->
        <van-cell title="性别" :value=user.sex isLink="true" @click="onSexClick()"></van-cell>
        <van-dialog
          v-model="sexDlgShow"
          title="修改性别"
          @confirm="onSexConfirmClick"
        >
          <div class="sexSelector">
            <van-radio-group v-model=user.sex>
              <van-radio name="男" checked-color="#FF4444">男</van-radio>
              <van-radio name="女" checked-color="#FF4444">女</van-radio>
            </van-radio-group>
          </div>
        </van-dialog>
        <van-cell title="生日" :value=birthDay isLink="true" @click="onBirthClick()"></van-cell>
        <div class="birthSelector">
          <van-popup v-model="birthDlgShow" position="bottom">
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
      //  telDlgShow: false,
        birthDlgShow: false,
        sexDlgShow: false,
        minDate: new Date(1940, 1, 1),
        maxDate: new Date(2120, 1, 1),
        birthDay: '',
        birthDayValue: null,
        avatarDefaultImg: require('@/assets/icons/ico_avatar.png'),
        inputNickName: '',
        inputTel: '',
        showHeader: true
      }
    },

    created() {
      let that = this;
      that.$log("userInfo created Enter")
      this.showHeader = this.$api.HAS_HEADER;
      that.user = this.$route.params.user;
      that.$log(that.user);
      if (that.user.birth != null) {
        this.birthDayValue = new Date(that.user.birth);
        this.birthDay = that.user.birth;
      }
    },

    methods: {
      updateUserDatail(userDetail) {
        this.$store.commit('SET_USER_DETAIL', JSON.stringify(userDetail));
      },
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
          this.updateUserDatail(this.user);
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

      beforeCloseNickNameDialog(action, done) {
        this.$log("beforeCloseNickNameDialog Enter");
        if (action === 'confirm') {
          this.user.nickname = this.inputNickName
          this.saveUserInfo();
          done()
        } else if (action === 'cancel') {
          done() //关闭
        }
      },

/*      beforeCloseTelDialog(action, done) {
        this.$log("beforeCloseTelDialog Enter");
        if (action === 'confirm') {
          if (this.inputTel == null || this.inputTel.length == 0 || !this.inputTel.match("^((\\\\+86)|(86))?[1][3456789][0-9]{9}$")) {
            this.$toast("请输入正确的电话号码")
            done(false) //不关闭弹框
          } else {
            this.user.telephone = this.inputTel
            this.saveUserInfo();
            done()
          }
        } else if (action === 'cancel') {
          done() //关闭
        }
      },*/

      onSexConfirmClick() {
        this.$log("onSexConfirmClick Enter")
        this.saveUserInfo();
      },
      onNickNameClick() {
        this.$log("onNickNameClick Enter")
        this.inputNickName = this.user.nickname;
        this.nickNameDlgShow = true;
      },
/*      onTelClick() {
        this.$log("onTelClick Enter")
        this.inputTel = this.user.telephone
        this.telDlgShow = true;
      },*/
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
      .van-dialog {
        color: black;
      }

      .avatarTitle {
        height: 4em;
        line-height: 4em;
        align-items: center;
      }

      .header-icon {
        height: 4em;
        line-height: 4em;
        align-items: center;

        img {
          display: inline-block;
          border-radius: 50%;
          height: 50px;
          width: 50px;
        }
      }


      .sexSelector {
        .van-radio-group {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;

          .van-radio {
            margin: 20px;
          }
        }

      }

      .birthSelector {
        width: 100%;
      }
    }

  }


</style>

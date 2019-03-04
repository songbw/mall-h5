import NodeRSA from 'node-rsa'

const STORAGE_USER_KEY = 'STORAGE_USER_KEY'
const RSA_PRIVATE_KEY = '-----BEGIN PRIVATE KEY-----\n' +
  'MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCldVUhunigZe4k\n' +
  'sx5hRt0jEgfNr2YqrEAZc97+/JI5l4OwtdspnuhcHQHBrMvzgHflE4YdadqYkQVm\n' +
  'LzvmnJwclDzEW8dhVi1FdSROrnFtpf8QnZ6BXmRyXpoxcCRIwGwRd5GxRWWbVSNe\n' +
  'GinqQfW8PY1kBbwPWUVp0Os6jWdr5AfzjKWneft681p4rn/gVWoOsPEAG+UnoV1F\n' +
  'yB4G0kgu/HhJGwVP1BDn+P6lY0m+UGs1GDB1d3TfgoYtbffpblNMmliX8gyg2hpL\n' +
  'OrnSwJpIJPYZv5QeW4PpsyVTrsiqBk6nRW8OS7qFKv+xV7/RFhY96YBsgefS1LSp\n' +
  'lB6l5gAbAgMBAAECggEAaZf9Eb5wt2T126QYklpoTLZ4FnOHD1rIubWyLidAptKk\n' +
  'b8VPrjtE7Wxxr4m4y5lEawTPxbvFjzKWMIWag+2Uz8RnF6W/E8ass7QzzKcVqrWS\n' +
  'l6cP/l4gWsE3RK/d6DQtg+Q8LdctJjnqjWbDM0aPLmhV8Oyb/WuqmgKD7OVLiJWC\n' +
  'vjLMsTyoXxzzKKIiVAZaD6G7iD0Tx9hMK4X8IYvJvDZO/WNJfGH079DGHgpWB9r7\n' +
  '9fMVlX0dd/sCEVxgaFQS++sU59D0nGSwmKQTo5eAG2BNwVjM0NsnUdbCwFfYZod7\n' +
  'jHe6mZiQSpNEgfyXSVlvmwzaGi7t9jxxQduSY1YnUQKBgQDaIQqmVmhPhm7hjY2E\n' +
  'OifvatWduh+0t97D+75cbzcmueRHQvVGm2PJ7iI7+qKiapEVmrnrLxJRYrjUGC5t\n' +
  '9P/mV8H1TjkaLQcr6Q24Nf8Ltipno5SyOq5XNIBBh4t+kVYSHiyeLhwH3Ji+zFKG\n' +
  'qdoylLSDd45GkQIYRMkMzEs4KQKBgQDCL0numDbh0B2OeN8FH4FD7tfcJUQaB2zu\n' +
  'zAw+TI9gjMzDrcfVznk3uwYE4d+IRoOm9ET4Zq19/ohNJML1b9QjX3faQ3lZl0YA\n' +
  'TZG7zqt8xAgZ067Tgfo1jvZHVQ+xQMxhEH39yak2sbsKpqr1gddKAL421ZhNK1tr\n' +
  'L++BR1cOowKBgGZo1ugrb0PO+OX6oHNxHmjAftRTmyksnnDjE4ewS3NqGSv/2sow\n' +
  'kFQw8m+4h3y7jaxX/WvWqMH/GImzZLEJMs/BafWyqQqKE3DhNSjEaR7lgtkvqtNW\n' +
  'y51zr7eUXMCqmX9eHVKSkWR7hFcn9KL2wdO3j1yd1/V3hUVBnibdD3+pAoGAZjqL\n' +
  'C4cq7Xqo9MaBcqsBXIgzL/yWe7WJDbZyg6G+oa++ZQ3p9I98lXBqXMuk6JNm39Ad\n' +
  'N0Cm+Xu0uhguYxP6dJzf9hIropTXD3XG0T6eXVK+iQo+Ma9t0CBxW2BWoJRihH8w\n' +
  'NRmjcd3jgFn6CsHOW3FEso2EXqwCts1Ho6GxHU0CgYAgUMQSe6s3+2IDt5Hl4/e9\n' +
  'WUyetgGf7uJ6ZvRlnhxNYn2TtZ5yKJx4LjxXhr6EnLtwg7nZl9nY43TkBdtguTay\n' +
  'ZaDxpJSWcDuIvMBwNrkRIGuBuVq2h5m/QVhbg2t2Pnc+xHSA4NeONCIw+7362vHP\n' +
  'EvyFkE5/apuTy7bg2CGjgw=='

const RSA_PUBLIC_KEY = '-----BEGIN PUBLIC KEY-----\n' +
  'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApXVVIbp4oGXuJLMeYUbd\n' +
  'IxIHza9mKqxAGXPe/vySOZeDsLXbKZ7oXB0BwazL84B35ROGHWnamJEFZi875pyc\n' +
  'HJQ8xFvHYVYtRXUkTq5xbaX/EJ2egV5kcl6aMXAkSMBsEXeRsUVlm1UjXhop6kH1\n' +
  'vD2NZAW8D1lFadDrOo1na+QH84ylp3n7evNaeK5/4FVqDrDxABvlJ6FdRcgeBtJI\n' +
  'Lvx4SRsFT9QQ5/j+pWNJvlBrNRgwdXd034KGLW336W5TTJpYl/IMoNoaSzq50sCa\n' +
  'SCT2Gb+UHluD6bMlU67IqgZOp0VvDku6hSr/sVe/0RYWPemAbIHn0tS0qZQepeYA\n' +
  'GwIDAQAB\n' +
  '-----END PUBLIC KEY-----'

const SRV_RSA_PUBLIC_KEY = '-----BEGIN PUBLIC KEY-----\n' +
  'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzr6nGZUKZGb99uruu7Fx\n' +
  'J5Q/OokQrdAHq2N17ZLhKHJCkCA3GiY+mVJA/E0o2VITPMqbj2HUY6lo+yXOCZ3m\n' +
  'RdVfKZn4Zsb5FuXsAWhs4AAdPL9SEg/LBJopXlhUFJW0MPaiLyiaUvShd33a9SiX\n' +
  'ukFrj+E9++qyQxxnHiCvLSarnW+Ur4Yeu4Lm5LMaP7xN4YzcCxB5xdR4KB+EkuBV\n' +
  '2KtE/g220Won7mPLE3aaheNq19KFu5eSm/1p9p9GKdve7gaPUCoR0NKH7VaR5rmw\n' +
  'zuPDKhjRdWMGvjG5zZNGisUEBAy33SANU/an8MsISEL6zzeJTHAK5/ZYNsuMWFrh\n' +
  'uwIDAQAB\n' +
  '-----END PUBLIC KEY-----'

const prikey = new NodeRSA(RSA_PRIVATE_KEY,'pkcs8-private');
const pubkey = new NodeRSA(RSA_PUBLIC_KEY, 'pkcs8-public');

export default {
  // 获取
  getLocal(key = STORAGE_USER_KEY) {
    return JSON.parse(window.localStorage.getItem(key))
  },
  // 设置用
  setLocal(res, key = STORAGE_USER_KEY, isSaveOldData = false) {
    //第三个参数是true的话,会增加数据而不是重新设置,res必须是数组
    if (isSaveOldData) {
      if (this.getLocal(key)) {
        let oldData = this.getLocal(key);
        return window.localStorage.setItem(key, JSON.stringify(oldData.concat(res)))
      }
    }
    return window.localStorage.setItem(key, JSON.stringify(res))
  },

  test() {
    console.log("TEST ###########")

  //  const prikey = new NodeRSA();
  //  prikey.importKey(RSA_PRIVATE_KEY, 'pkcs8-private');
  //  const pubkey = new NodeRSA();
  //  pubkey.importKey(RSA_PUBLIC_KEY, 'pkcs8-public')
    //console.log("KEY size:"+key.getKeySize())
    const str = "Jon";
    let signature = prikey.sign(str);
    let flag = pubkey.verify(str, signature);
    console.log("flag is:" + flag)
    let jsonObj = {
      "a": 123,
      "b": {
        "bb2": {
          "ccc2": [
            {
              xxx: 1,
              yyy: 2
            },
            {
              xxx: 1,
              yyy: ''
            },
          ],
          "ccc1": "afdgsdfgad",
        },
        "bb1": null
      }
    }
    console.log('formatedStr:' + this.formatSignString(jsonObj))
  },

  formatSignString(jsonObj) {
    let arr = [];
    for (let key in jsonObj) {
      arr.push(key)
    }
    arr.sort();
    let str = '';
    for (let i in arr) {
      if (jsonObj[arr[i]] != null) {
        if (typeof jsonObj[arr[i]] == "object") {
          if(jsonObj[arr[i]]  instanceof Array) {
            let len = jsonObj[arr[i]].length;

            str += arr[i] + '=['
            for (let k =0 ;k < len ; k++) {
              str += '{'
              str += this.formatSignString(jsonObj[arr[i]][k]);
              str += '}'
              if(k < len-1) {
                str += ','
              }
            }
            str += ']' + "&"
          } else {
            str += arr[i] + '={'
            str += this.formatSignString(jsonObj[arr[i]])
            str += '}' + "&"
          }

        } else {
          if (typeof jsonObj[arr[i]] == "string" && jsonObj[arr[i]].length == 0)
            continue;
          str += arr[i] + "=" + jsonObj[arr[i]] + "&";
        }
      }
    }
    return str.substr(0, str.length - 1)
  }
}

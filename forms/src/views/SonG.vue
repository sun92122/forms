<template>
  <div class="SonG">
    <div class="title">
      <h1>{{ Title.title }}</h1>
      <div v-for="str in Title.subtitle" :key="str">{{ str }}<br /></div>
    </div>
    <form class="form" :action="PostUrl" method="post" target="_self">
      <div class="question" v-for="(data, key) in Datas" :key="key">
        <label :for="key">
          <div>
            {{ key }}
            <div class="req" v-if="data.other.required == 'true'">*</div>
          </div>
          <div v-if="data.example != ''">
            <br />
            {{ data.example }}
          </div>
        </label>
        <input
          :id="key"
          :name="data.name"
          :type="data.type"
          v-if="data.type != 'textarea'"
          v-bind="data.other"
        />
        <textarea
          :id="key"
          :name="data.name"
          :type="data.type"
          v-if="data.type == 'textarea'"
          v-bind="data.other"
        ></textarea>
      </div>
      <div class="submit">
        <input type="submit" value="Submit" />
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import background from "../assets/bg.jpg";

const AppScriptUrl =
  "https://script.google.com/macros/s/AKfycbw_xlSbZXT1F5syqnrGBA-3iNvOdc-Ggf5Gcy4jPGPNwhwjjTLd7WfSfAIOEfMkOaMWfQ/exec";

export default {
  name: "SonG",
  data() {
    return {
      BGimg: background,
      Title: {
        title: "雅歌G小組成員資料",
        subtitle: [
          "親愛的弟兄姊妹們大家好",
          "以下表單是個人資料調查表請大家填寫，裡面各項資訊請盡量填寫",
          "所有資料僅供小組長及小家長們參考，絕不外流，謝謝大家",
        ],
      },
      test: [],
      PostUrl: AppScriptUrl,
      Datas: {
        姓名: {
          name: "name",
          example: "",
          value: "",
          type: "text",
          other: {
            autocomplete: "name",
            required: "true",
          },
        },
        生日: {
          name: "birth",
          example: "",
          value: "",
          type: "date",
          other: {
            autocomplete: "bday",
            placeholder: "yyyy-mm-dd",
            required: "true",
            max: this.today(),
          },
        },
        配偶姓名: {
          name: "spouse",
          example: "",
          value: "",
          type: "text",
          other: {
            autocomplete: "off",
          },
        },
        電子郵件: {
          name: "email",
          example: "",
          value: "",
          type: "email",
          other: {
            autocomplete: "email",
            required: "true",
          },
        },
        手機號碼: {
          name: "phone",
          example: "",
          value: "",
          type: "tel",
          other: {
            autocomplete: "tel",
            required: "true",
          },
        },
        住家地址: {
          name: "address",
          example: "",
          value: "",
          type: "text",
          other: {
            autocomplete: "address",
          },
        },
        住家電話: {
          name: "telephone",
          example: "",
          value: "",
          type: "tel",
          other: {
            autocomplete: "off",
          },
        },
        服務單位及職稱: {
          name: "job",
          example: "",
          value: "",
          type: "textarea",
          other: {
            autocomplete: "organization",
          },
        },
        服事項目及頻率: {
          name: "church",
          example: "",
          value: "",
          type: "textarea",
          other: {
            autocomplete: "off",
          },
        },
        子女: {
          name: "child",
          example: "",
          value: "",
          type: "text",
          other: {
            autocomplete: "off",
          },
        },
      },
    };
  },
  methods: {
    today() {
      const today = new Date().toLocaleDateString("zh-TW", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      return today.replace(/\//g, "-");
    },
  },
  mounted() {
    axios.get(AppScriptUrl).then((res) => {
      const tempDatas = res.data;
      this.test = tempDatas;
      console.log(tempDatas);
      for (var i = 0; i < tempDatas.length; i++) {
        const tempdata = tempDatas[i];
        console.log(tempdata[0], tempdata[1]);
        if (tempdata[0] == "標題") this.Title.title = tempdata[1];
        else if (tempdata[0] == "副標題")
          this.Title.subtitle = tempdata[1].split(/\r?\n/);
        else this.Datas[tempdata[0]].example = tempdata[1];
      }
    });
  },
};
</script>

<style lang="scss" scoped>
.SonG {
  font-weight: 500;
  padding: 2rem;
  background: {
    image: var(--bg-img, url(../assets/bg.jpg));
    size: cover;
    repeat: no-repeat;
    position: center;
    attachment: fixed;
  }
}

.title {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 1rem auto;
  margin-top: 0;
  width: calc(100% - 4rem);
  max-width: 500px;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  box-shadow: 0 0 10px #2221;
  background: rgba(255, 255, 255, 0.75);

  h1 {
    font-size: calc(18px + 2vw);
    margin: 0.5rem 0;
  }

  div {
    width: 100%;
    margin: 0.1rem 0;
    text-align: left;
  }
}

.form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  width: calc(100% - 4rem);
  max-width: 500px;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  box-shadow: 0 0 10px #2221;
  background: rgba(255, 255, 255, 0.75);
}

.question {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0.5rem;
  width: 90%;
  max-width: 500px;
  padding: 1rem;

  @media screen and (max-width: 550px) {
    margin: 0.5rem 0;
  }

  label {
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: left;
    width: 100%;
    max-width: 500px;

    .req {
      display: inline-block;
      text-align: center;
      margin: 0 0.5rem;
      color: #f00;
    }

    div {
      flex-direction: row;
      text-align: left;
    }
  }

  @mixin inp {
    display: block;
    margin: 0.5rem;
    width: 90%;
    min-height: 1.5rem;
    padding: 0.5rem 1rem;
    border: 1px solid #ccc;
    border-radius: 0.5rem;
    box-shadow: 0 0 10px #2221;
    background-color: rgba(255, 255, 255, 0.79);
    -webkit-appearance: none;
    -moz-appearance: textfield;
  }

  input {
    @include inp;
  }

  textarea {
    @include inp;
    min-height: 5rem;
    resize: vertical;
  }
}

.submit {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 0.5rem;
  width: 90%;
  max-width: 500px;
  padding: 1rem;

  @media screen and (max-width: 550px) {
    margin: 0.5rem 0;
  }

  input[type="submit"] {
    display: block;
    width: 100px;
    min-height: 3rem;
    padding: 0.5rem 1rem;
    border: 1px solid #ccc;
    border-radius: 0.5rem;
    box-shadow: 0 0 10px #2221;
    background: gray;
    color: white;
    cursor: pointer;
    -webkit-appearance: none;
    -moz-appearance: textfield;

    &:hover {
      background: rgb(255, 0, 0);
    }
  }
}
</style>

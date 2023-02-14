<template>
  <div class="SonG">
    <div class="title">
      <h1>{{ Title.title }}</h1>
      <div v-html="Title.subtitle"></div>
    </div>
    <div class="form afterSubmit" v-show="Submited">
      <div v-html="afterSubmit"></div>
      <a href="/SonG" @click="clearForm">提交另一份表單</a>
    </div>
    <form
      class="form"
      :action="PostUrl"
      method="post"
      target="nothing"
      v-show="!Submited"
      @submit="Submited = true"
    >
      <div class="explain">
        <div class="req">*</div>
        <div>必填</div>
      </div>
      <div class="question" v-for="(data, key) in Datas" :key="key">
        <label :for="key">
          <div>
            {{ key }}
            <div class="req" v-if="data.other.required == 'true'">*</div>
          </div>
          <div
            class="example"
            v-if="data.example != ''"
            v-html="data.example"
          ></div>
        </label>
        <input
          :id="key"
          :name="data.name"
          :type="data.type"
          v-if="data.type != 'textarea'"
          v-bind="data.other"
          v-model="data.value"
        />
        <textarea
          :id="key"
          :name="data.name"
          :type="data.type"
          v-if="data.type == 'textarea'"
          v-bind="data.other"
          v-model="data.value"
        ></textarea>
      </div>
      <div class="question">
        <label>子女</label>
        <input
          :id="'子女'"
          :name="Child.name"
          :type="Child.type"
          v-bind="Child.other"
          v-model="allChilds"
        />
      </div>
      <div class="question" v-for="child in Childs" :key="child">
        <label :for="child.childName.name">
          <div>
            {{ child.childName.label }}
            <div class="req">*</div>
          </div>
        </label>
        <input
          :id="child.childName.name"
          :type="child.childName.type"
          v-bind="child.childName.other"
          v-model="child.childName.value"
        />
        <label :for="child.childBirth.name">
          <div>
            {{ child.childBirth.label }}
            <div class="req">*</div>
          </div>
        </label>
        <input
          :id="child.childBirth.name"
          :type="child.childBirth.type"
          v-bind="child.childBirth.other"
          v-model="child.childBirth.value"
        />
      </div>
      <div class="childButton">
        <button type="button" @click="addChild">新增</button>
        <button type="button" @click="delChild" v-if="Childs.length">
          刪除
        </button>
      </div>
      <div class="submit">
        <input type="submit" value="送出" />
      </div>
    </form>
    <iframe v-show="false" name="nothing"></iframe>
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
      Submited: false,
      BGimg: background,
      Title: {
        title: "雅歌G小組成員資料",
        subtitle:
          "親愛的弟兄姊妹們大家好" +
          "<br \\>" +
          "以下表單是個人資料調查表請大家填寫，裡面各項資訊請盡量填寫" +
          "<br \\>" +
          "所有資料僅供小組長及小家長們參考，絕不外流，謝謝大家" +
          "<br \\>",
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
            autocomplete: "off",
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
      },
      Child: {
        name: "child",
        example: "",
        value: "",
        type: "hidden",
        other: {
          autocomplete: "off",
        },
      },
      Childs: [],
      afterSubmit: "資料調查表已提交，感謝您的填寫",
    };
  },
  computed: {
    allChilds() {
      var allChilds = "";
      for (var i = 0; i < this.Childs.length; i++) {
        allChilds +=
          this.Childs[i].childName.value +
          "（" +
          this.Childs[i].childBirth.value +
          "）\n";
      }
      return allChilds ? allChilds : "無";
    },
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
    addChild() {
      this.Childs.push({
        childName: {
          name: "childName" + this.Childs.length,
          label: "小孩姓名 " + (this.Childs.length + 1),
          type: "text",
          other: {
            autocomplete: "off",
            required: "true",
          },
          value: "",
        },
        childBirth: {
          name: "childBirth" + this.Childs.length,
          label: "小孩生日 " + (this.Childs.length + 1),
          type: "date",
          other: {
            autocomplete: "off",
            placeholder: "yyyy-mm-dd",
            required: "true",
            max: this.today(),
          },
          value: "",
        },
      });
    },
    delChild() {
      this.Childs.pop();
    },
    clearForm() {
      for (var data in this.Datas) {
        this.Datas[data].value = "";
      }
      this.Childs = [];
    },
  },
  created() {
    axios.get(AppScriptUrl).then((res) => {
      const tempDatas = res.data;
      this.test = tempDatas;
      console.log(tempDatas);
      for (var i = 0; i < tempDatas.length; i++) {
        const tempdata = tempDatas[i];
        console.log(tempdata[0], tempdata[1]);
        if (tempdata[0] == "標題") this.Title.title = tempdata[1];
        else if (tempdata[0] == "副標題")
          this.Title.subtitle = tempdata[1].replace(/\r?\n/g, "<br \\>");
        else if (tempdata[0] == "傳送後訊息")
          this.afterSubmit = tempdata[1].replace(/\r?\n/g, "<br \\>");
        else
          this.Datas[tempdata[0]].example = tempdata[1].replace(
            /\r?\n/g,
            "<br \\>"
          );
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
  min-height: 100vh;
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

  .req {
    display: inline-block;
    text-align: center;
    margin: 0 0.5rem;
    color: #f00;
  }
}

.explain {
  display: flex;
  flex-direction: row;
  text-align: left;
  width: 100%;
  max-width: 500px;

  div {
    font-size: smaller;
  }
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

    div {
      flex-direction: row;
      text-align: left;
    }

    .example {
      display: flex;
      font-size: smaller;
      margin: 0 0.5rem;
      color: #666;
      text-justify: top;
      font-style: italic;
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

.childButton {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 0 0.5rem;
  width: 88%;
  max-width: 500px;
  padding: 0 1rem;

  @media screen and (max-width: 550px) {
    margin: 0.5rem 0;
  }

  button {
    display: block;
    width: 75px;
    min-height: 2rem;
    padding: 0;
    border: 1px solid #ccc;
    border-radius: 0.5rem;
    box-shadow: 0 0 10px #2221;
    background: gray;
    color: white;
    cursor: pointer;
    -webkit-appearance: none;
    -moz-appearance: textfield;

    &:hover {
      background: #666;
    }
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
      background: goldenrod;
    }
  }
}
</style>

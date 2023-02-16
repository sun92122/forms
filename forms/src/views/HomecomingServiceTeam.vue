<template>
  <div class="HomecomingServiceTeam">
    <div class="title">
      <h1>{{ Title.title }}</h1>
      <img :src="Title.image" v-show="!Submited" />
      <div v-show="!Submited">
        <div v-for="item in Title.subtitle" :key="item" v-html="item"></div>
      </div>
    </div>
    <div class="form AfterSubmit" v-show="Submited">
      <div v-html="AfterSubmit"></div>
      <div>
        <div>各種傳送門</div>
        <div>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSfjUcHtNB83e4kIF8mjT_xIZnN9aoWoJpdIfqXtWtraCLOYAQ/viewform?usp=sf_link"
          >
            27返服股長意願
          </a>
        </div>
        <div>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSc6jOqFRvdzMO4bUT7dce6Zm2vYKz1cN2Rb-g8PltdG3yoNYw/viewform?usp=sf_link"
          >
            27竹苗幹部意願
          </a>
        </div>
        <div>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSc1NMSYH7AnI7hYRqalPfgbEtknX8ZnwIa1uxKCMytgX_dCTw/viewform?usp=sf_link"
          >
            27竹苗會長改選意願
          </a>
        </div>
        <div>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSf0zeiFpduhwTK-57TpcMP6lkl4FlqDNQ0N8GOxg6Z0SCLhqg/viewform?usp=sf_link"
          >
            竹苗週招工登記表
          </a>
        </div>
        <div>
          <a href="/forms/HomecomingServiceTeam" @click="clearForm">
            提交另一份表單
          </a>
        </div>
      </div>
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
      <div
        class="question BeforeDatas"
        v-for="(data, key) in BeforeDatas"
        :key="key"
      >
        <label :for="key">
          <div>
            {{ key }}
            <div class="req">*</div>
          </div>
        </label>
        <input
          :id="key"
          v-bind="data.other"
          v-model="data.value"
          required
          @change="autoGet(data.value)"
        />
        <input
          type="hidden"
          :name="key"
          :value="!Anonymous ? data.value : '匿名'"
        />
      </div>
      <input type="hidden" name="record" :value="BeforeDatas.姓名.value" />
      <div
        class="question BeforeDatas"
        v-for="(data, key) in BeforeDatas2"
        :key="key"
      >
        <label :for="key">
          <div>
            {{ key }}
            <div class="req">*</div>
          </div>
        </label>
        <div
          class="options"
          :style="
            data.options.length < 3 ? { 'justify-content': 'flex-start' } : {}
          "
        >
          <div
            class="option"
            v-for="option in data.options"
            v-show="option != ''"
            :key="option"
          >
            <label :for="key + 'option'">
              <div>
                {{ option }}
              </div>
            </label>
            <input
              :id="key + 'option'"
              :name="key"
              required
              v-bind="data.other"
              :value="option"
              v-model="data.value"
            />
          </div>
        </div>
      </div>
      <div class="Anonymous">
        <label for="Anonymous">
          <div>匿名</div>
        </label>
        <Toggle id="Anonymous" v-model="Anonymous" />
      </div>
      <div class="question Datas" v-if="Object.keys(Datas).length == 0">
        <h3>載入中...滿滿的問題馬上就來</h3>
      </div>
      <div v-if="BeforeDatas.包裝名.value != 'test'">
        <div class="question Datas" v-for="(data, key) in Datas" :key="key">
          <label :for="key">
            <div>
              {{ key }}
              <div class="req">*</div>
            </div>
          </label>
          <input
            :id="key"
            :name="key"
            type="hidden"
            :value="(data.value + '\n' + data.suggestion).trim()"
          />
          <div class="options">
            <div
              class="option"
              v-for="option in data.options"
              v-show="option != ''"
              :key="option"
            >
              <label :for="key + option">
                <div>
                  {{ option }}
                </div>
              </label>
              <input
                :id="key + option"
                :name="key + 'option'"
                required
                v-bind="data.other"
                :value="option"
                v-model="data.value"
              />
            </div>
          </div>
          <label :for="key + 'suggestion'" v-show="data.value != ''">
            <div>{{ key }}的建議或回饋</div>
          </label>
          <textarea
            :id="key + 'suggestion'"
            :name="key + 'suggestion'"
            :type="data.type"
            v-bind="data.other"
            v-model="data.suggestion"
            v-show="data.value != ''"
            :placeholder="'請輸入' + key + '的建議或回饋'"
          ></textarea>
        </div>
        <div
          class="question AfterDatas"
          v-for="(data, key) in AfterDatas"
          :key="key"
        >
          <label :for="key">
            <div>
              {{ key }}
            </div>
          </label>
          <textarea
            :id="key"
            :name="key"
            v-bind="data.other"
            v-model="data.value"
          ></textarea>
        </div>
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
import Toggle from "@vueform/toggle";
import HomecomingServiceTeamImage from "@/assets/HomecomingServiceTeamImage.jpg";

const AppScriptUrl =
  "https://script.google.com/macros/s/AKfycbwB7_d9M9dIO8GrkQGu0tQF4cSF93YfXMEIOzJb25YeD6V1NJphqQheyeFZsre7fC-o_Q/exec";

export default {
  name: "HomecomingServiceTeam",
  components: {
    Toggle,
  },
  data() {
    return {
      Submited: false,
      Title: {
        title: "返服工人回饋調查",
        image: HomecomingServiceTeamImage,
        subtitle: [
          "各位早安，這是總籌B倒數第二次跟大家問早",
          "<s>因為結案報告有點空</s>，為了給往後的返服有更多參考資料，希望大家填一下這個很長的調查表",
          "考慮到有些問題需要回憶一下，預計填表時間可能長達半小時以上",
          "我幫大家準備了匿名開關，如果打開它，提交的姓名和包裝名將不會與其他答案連結，只用於紀錄是否填表，不過如果填錯或想修改我就沒辦法幫你從後台刪掉前次提交了",
          "<br /><br />",
          "因為還在測試階段，如果本表單有Bug可以直接通知我",
          "注意：瀏覽器重新整理將清空表單，建議使用電腦作答或先在其他地方打好再複製進來",
        ],
      },
      PostUrl: AppScriptUrl,
      Anonymous: false,
      BeforeDatas: {
        姓名: {
          value: "",
          other: {
            type: "text",
            placeholder: "請輸入姓名",
          },
        },
        包裝名: {
          value: "",
          other: {
            type: "text",
            placeholder: "請輸入包裝名",
          },
        },
      },
      BeforeDatas2: {
        股別: {
          other: {
            type: "radio",
          },
          options: ["總籌股", "活動股", "美輔股", "課程股", "生器股"],
          value: "",
        },
        股長or股員: {
          other: {
            type: "radio",
          },
          options: ["股長", "股員"],
          value: "",
        },
      },
      Datas: {},
      AfterDatas: {
        其他建議或回饋: {
          value: "",
          other: {
            type: "textarea",
            placeholder: "請輸入其他建議或回饋",
          },
        },
      },
      AfterSubmit: "", // TODO: Add your after submit message
    };
  },
  methods: {
    clearForm() {
      var key = undefined;
      for (key in this.BeforeDatas) this.BeforeDatas[key].value = "";
      for (key in this.AfterDatas) this.AfterDatas[key].value = "";
      for (key in this.Datas) {
        this.Datas[key].value = "";
        this.Datas[key].suggestion = "";
      }
    },
    autoGet(name) {
      axios.get(AppScriptUrl + "?mode=record&name=" + name).then((res) => {
        const tempDatas = res.data;
        console.log(res.data);
        if (tempDatas == []) return;
        this.BeforeDatas.姓名.value = tempDatas[0];
        this.BeforeDatas.包裝名.value = tempDatas[1];
        this.BeforeDatas2.股別.value = tempDatas[2];
        this.BeforeDatas2.股長or股員.value = tempDatas[3];
      });
    },
  },
  created() {
    axios.get(AppScriptUrl + "?mode=DATA").then((res) => {
      const tempDatas = res.data;
      for (var i = 0; i < tempDatas.length; i++) {
        const tempdata = tempDatas[i];
        if (tempdata[0] == "傳送後訊息")
          this.AfterSubmit = tempdata[1].replace(/\r?\n/g, "<br />");
        else if (tempdata.filter((x) => x != "").length > 2)
          this.Datas[tempdata[0]] = {
            other: {
              type: "radio",
            },
            options: tempdata.filter((x) => x != "").slice(1),
            value: "",
            suggestion: "",
          };
      }
    });
  },
};
</script>

<style src="@vueform/toggle/themes/default.css"></style>
<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Noto+Serif+TC&display=swap");

.HomecomingServiceTeam {
  font-family: "Noto Serif TC", serif;
  font-weight: 500;
  padding: 2rem;
  background: {
    color: rgba(246, 230, 82, 0.8);
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

  @media screen and (max-width: 550px) {
    width: calc(100% - 2rem);
  }

  h1 {
    font-size: calc(18px + 2vw);
    margin: 0.5rem 0;
  }

  img {
    width: 100%;
    max-width: 500px;
    margin: 0.5rem 0;
    height: auto;
  }

  div {
    font-size: 14px;
    width: 100%;
    margin: 0.1rem 0;
    text-align: left;
    line-height: 1.5;
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

  @media screen and (max-width: 550px) {
    width: calc(100% - 2rem);
  }

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

.Anonymous {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin: 0.5rem;
  width: 90%;
  max-width: 500px;
  padding: 1rem;

  @media screen and (max-width: 550px) {
    margin: 0.5rem 0;
  }

  label {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-right: 1rem;
  }

  // --toggle-width: 3rem;
  // --toggle-height: 1.25rem;
  // --toggle-border: 0.125rem;
  // --toggle-font-size: 0.75rem;
  // --toggle-duration: 150ms;
  --toggle-bg-on: gold;
  // --toggle-bg-off: #e5e7eb;
  // --toggle-bg-on-disabled: #d1d5db;
  // --toggle-bg-off-disabled: #e5e7eb;
  --toggle-border-on: gold;
  // --toggle-border-off: #e5e7eb;
  // --toggle-border-on-disabled: #d1d5db;
  // --toggle-border-off-disabled: #e5e7eb;
  // --toggle-ring-width: 3px;
  --toggle-ring-color: yellow;
  // --toggle-text-on: #ffffff;
  // --toggle-text-off: #374151;
  // --toggle-text-on-disabled: #9ca3af;
  // --toggle-text-off-disabled: #9ca3af;
  // --toggle-handle-enabled: #ffffff;
  // --toggle-handle-disabled: #f3f4f6;
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
    align-items: flex-start;
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
    padding: 0.5rem 1rem;
    border: 1px solid #ccc;
    border-radius: 0.5rem;
    box-shadow: 0 0 10px #2221;
    background-color: rgba(255, 255, 255, 0.79);
    -webkit-appearance: none;
    -moz-appearance: textfield;
  }

  input[type="text"] {
    @include inp;
    min-height: 1.5rem;
  }

  textarea {
    @include inp;
    min-height: 5rem;
    resize: vertical;
  }
  .options {
    margin: 0.5rem 0;
    width: 100%;
    padding: 0.5rem 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    @media screen and (max-width: 550px) {
      width: 120%;
      font-size: smaller;
    }

    @media screen and (max-width: 400px) {
      width: 130%;
      font-size: smaller;
    }

    .option {
      margin: 0 0.5rem;
      width: 22%;
      align-items: center;
      display: flex;
      flex-direction: column;

      label {
        align-items: center;
        width: 120%;
      }
    }

    input[type="radio"] {
      appearance: none;

      border-radius: 50%;
      width: 18px;
      height: 18px;
      padding: 0;
      border: 2px solid #999;
      transition: 0.2s all linear;
      margin: 4px 0 0;

      &:checked {
        border: 6px solid goldenrod;
      }
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
    background: gold;
    color: gray;
    font-weight: 700;
    cursor: pointer;
    -webkit-appearance: none;
    -moz-appearance: textfield;

    &:hover {
      background: goldenrod;
    }
  }
}

.AfterSubmit {
  text-align: left;
  align-items: flex-start;

  div {
    margin: 0.5rem;
  }

  a {
    color: black;
  }
}
</style>
